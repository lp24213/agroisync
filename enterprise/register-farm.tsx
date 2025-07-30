import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { v4 as uuidv4 } from 'uuid';

// Importações internas
import { useAuth } from '../hooks/useAuth';
import { captureException, startTransaction } from '../monitoring/sentry.config';
import { createAlert } from '../monitoring/alerts';
import { uploadToIPFS } from '../utils/ipfs';
import { registerFarmOnChain } from './tokenize';

// Corrigir ícone do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/map/marker-icon-2x.png',
  iconUrl: '/images/map/marker-icon.png',
  shadowUrl: '/images/map/marker-shadow.png',
});

// Componente para upload de arquivos estilizado
const UploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

// Tipos de propriedades rurais
const farmTypes = [
  { value: 'crop', label: 'Lavoura' },
  { value: 'livestock', label: 'Pecuária' },
  { value: 'mixed', label: 'Mista' },
  { value: 'forestry', label: 'Florestal' },
  { value: 'aquaculture', label: 'Aquicultura' },
];

// Tipos de culturas
const cropTypes = [
  { value: 'soy', label: 'Soja' },
  { value: 'corn', label: 'Milho' },
  { value: 'cotton', label: 'Algodão' },
  { value: 'wheat', label: 'Trigo' },
  { value: 'rice', label: 'Arroz' },
  { value: 'coffee', label: 'Café' },
  { value: 'sugarcane', label: 'Cana-de-açúcar' },
  { value: 'other', label: 'Outro' },
];

// Tipos de pecuária
const livestockTypes = [
  { value: 'cattle', label: 'Bovinos' },
  { value: 'poultry', label: 'Aves' },
  { value: 'swine', label: 'Suínos' },
  { value: 'sheep', label: 'Ovinos' },
  { value: 'goat', label: 'Caprinos' },
  { value: 'other', label: 'Outro' },
];

// Estados brasileiros
const brazilianStates = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
];

// Componente para selecionar localização no mapa
const LocationPicker = ({ position, setPosition }) => {
  const map = useMapEvents({
    click: (e) => {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? (
    <Marker position={position}>
      <Popup>Localização selecionada</Popup>
    </Marker>
  ) : null;
};

// Passos do formulário
const steps = ['Informações Básicas', 'Documentação', 'Localização', 'Tokenização'];

// Interface para os dados do formulário
interface FarmData {
  name: string;
  registrationNumber: string;
  ownerName: string;
  ownerDocument: string;
  farmType: string;
  productionType: string;
  totalArea: number;
  productiveArea: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates: [number, number] | null;
  documents: File[];
  documentDescriptions: string[];
  tokenSymbol: string;
  tokenName: string;
  tokenSupply: number;
  tokenPrice: number;
  tokenDescription: string;
}

// Componente principal
const RegisterFarm: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  // Estado para controlar o passo atual
  const [activeStep, setActiveStep] = useState(0);
  
  // Estado para os dados do formulário
  const [formData, setFormData] = useState<FarmData>({
    name: '',
    registrationNumber: '',
    ownerName: '',
    ownerDocument: '',
    farmType: '',
    productionType: '',
    totalArea: 0,
    productiveArea: 0,
    address: '',
    city: '',
    state: '',
    zipCode: '',
    coordinates: null,
    documents: [],
    documentDescriptions: [],
    tokenSymbol: '',
    tokenName: '',
    tokenSupply: 1000,
    tokenPrice: 1,
    tokenDescription: '',
  });
  
  // Estados para controle de validação e carregamento
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [documentPreviews, setDocumentPreviews] = useState<string[]>([]);
  
  // Verificar autenticação
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      enqueueSnackbar('Você precisa estar autenticado para registrar uma fazenda', { 
        variant: 'warning',
        action: (
          <Button color="inherit" size="small" onClick={() => router.push('/auth/login')}>
            Login
          </Button>
        )
      });
      router.push('/auth/login?redirect=/enterprise/register-farm');
    }
  }, [authLoading, isAuthenticated, router, enqueueSnackbar]);
  
  // Verificar carteira conectada
  useEffect(() => {
    if (isAuthenticated && !publicKey) {
      enqueueSnackbar('Conecte sua carteira para continuar', { variant: 'warning' });
    }
  }, [isAuthenticated, publicKey, enqueueSnackbar]);
  
  // Gerar símbolo do token com base no nome da fazenda
  useEffect(() => {
    if (formData.name) {
      // Gerar símbolo a partir do nome (até 5 caracteres, maiúsculos)
      const symbol = formData.name
        .replace(/[^a-zA-Z0-9]/g, '') // Remover caracteres especiais
        .substring(0, 5)
        .toUpperCase();
      
      // Gerar nome do token
      const tokenName = `${formData.name} Farm Token`;
      
      setFormData(prev => ({
        ...prev,
        tokenSymbol: symbol,
        tokenName,
      }));
    }
  }, [formData.name]);
  
  // Manipulador de mudança de campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (!name) return;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Limpar erro do campo
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Manipulador de upload de documentos
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files);
    const newDescriptions = newFiles.map(() => '');
    
    // Gerar previews
    const newPreviews = newFiles.map(file => {
      if (file.type.startsWith('image/')) {
        return URL.createObjectURL(file);
      }
      return file.type.includes('pdf') 
        ? '/images/pdf-icon.png' 
        : '/images/document-icon.png';
    });
    
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...newFiles],
      documentDescriptions: [...prev.documentDescriptions, ...newDescriptions],
    }));
    
    setDocumentPreviews(prev => [...prev, ...newPreviews]);
  };
  
  // Manipulador de descrição de documentos
  const handleDocumentDescriptionChange = (index: number, value: string) => {
    setFormData(prev => {
      const newDescriptions = [...prev.documentDescriptions];
      newDescriptions[index] = value;
      return {
        ...prev,
        documentDescriptions: newDescriptions,
      };
    });
  };
  
  // Remover documento
  const handleRemoveDocument = (index: number) => {
    setFormData(prev => {
      const newDocuments = [...prev.documents];
      const newDescriptions = [...prev.documentDescriptions];
      newDocuments.splice(index, 1);
      newDescriptions.splice(index, 1);
      return {
        ...prev,
        documents: newDocuments,
        documentDescriptions: newDescriptions,
      };
    });
    
    setDocumentPreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };
  
  // Validar passo atual
  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (activeStep) {
      case 0: // Informações Básicas
        if (!formData.name) newErrors.name = 'Nome da fazenda é obrigatório';
        if (!formData.registrationNumber) newErrors.registrationNumber = 'Número de registro é obrigatório';
        if (!formData.ownerName) newErrors.ownerName = 'Nome do proprietário é obrigatório';
        if (!formData.ownerDocument) newErrors.ownerDocument = 'Documento do proprietário é obrigatório';
        if (!formData.farmType) newErrors.farmType = 'Tipo de propriedade é obrigatório';
        if (!formData.productionType) newErrors.productionType = 'Tipo de produção é obrigatório';
        if (!formData.totalArea || formData.totalArea <= 0) newErrors.totalArea = 'Área total deve ser maior que zero';
        if (formData.productiveArea <= 0) newErrors.productiveArea = 'Área produtiva deve ser maior que zero';
        if (formData.productiveArea > formData.totalArea) newErrors.productiveArea = 'Área produtiva não pode ser maior que a área total';
        break;
        
      case 1: // Documentação
        if (formData.documents.length === 0) newErrors.documents = 'Pelo menos um documento é obrigatório';
        formData.documentDescriptions.forEach((desc, index) => {
          if (!desc) newErrors[`documentDescription-${index}`] = 'Descrição do documento é obrigatória';
        });
        break;
        
      case 2: // Localização
        if (!formData.address) newErrors.address = 'Endereço é obrigatório';
        if (!formData.city) newErrors.city = 'Cidade é obrigatória';
        if (!formData.state) newErrors.state = 'Estado é obrigatório';
        if (!formData.zipCode) newErrors.zipCode = 'CEP é obrigatório';
        if (!formData.coordinates) newErrors.coordinates = 'Selecione a localização no mapa';
        break;
        
      case 3: // Tokenização
        if (!formData.tokenSymbol) newErrors.tokenSymbol = 'Símbolo do token é obrigatório';
        if (!formData.tokenName) newErrors.tokenName = 'Nome do token é obrigatório';
        if (!formData.tokenSupply || formData.tokenSupply <= 0) newErrors.tokenSupply = 'Quantidade de tokens deve ser maior que zero';
        if (!formData.tokenPrice || formData.tokenPrice <= 0) newErrors.tokenPrice = 'Preço do token deve ser maior que zero';
        if (!formData.tokenDescription) newErrors.tokenDescription = 'Descrição do token é obrigatória';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Avançar para o próximo passo
  const handleNext = () => {
    if (validateStep()) {
      setActiveStep(prev => prev + 1);
    }
  };
  
  // Voltar para o passo anterior
  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };
  
  // Enviar formulário
  const handleSubmit = async () => {
    if (!validateStep()) return;
    
    const transaction = startTransaction({
      name: 'register-farm',
      op: 'farm-registration',
    });
    
    try {
      setLoading(true);
      
      // Verificar se o usuário está autenticado e tem carteira conectada
      if (!isAuthenticated || !publicKey) {
        throw new Error('Você precisa estar autenticado e com a carteira conectada');
      }
      
      // 1. Fazer upload dos documentos para IPFS
      const documentCIDs = [];
      for (let i = 0; i < formData.documents.length; i++) {
        const file = formData.documents[i];
        const description = formData.documentDescriptions[i];
        
        // Atualizar progresso
        setUploadProgress((i / formData.documents.length) * 50);
        
        // Upload para IPFS
        const cid = await uploadToIPFS(file, {
          name: file.name,
          description,
          type: file.type,
          size: file.size,
          owner: user?.id,
          farmName: formData.name,
        });
        
        documentCIDs.push({
          cid,
          name: file.name,
          description,
          type: file.type,
        });
      }
      
      // 2. Preparar metadados da fazenda para IPFS
      const farmMetadata = {
        name: formData.name,
        registrationNumber: formData.registrationNumber,
        owner: {
          name: formData.ownerName,
          document: formData.ownerDocument,
          walletAddress: publicKey.toString(),
        },
        farmType: formData.farmType,
        productionType: formData.productionType,
        area: {
          total: formData.totalArea,
          productive: formData.productiveArea,
          unit: 'hectares',
        },
        location: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          coordinates: formData.coordinates,
        },
        documents: documentCIDs,
        token: {
          symbol: formData.tokenSymbol,
          name: formData.tokenName,
          supply: formData.tokenSupply,
          price: formData.tokenPrice,
          description: formData.tokenDescription,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        id: uuidv4(),
      };
      
      // 3. Fazer upload dos metadados para IPFS
      setUploadProgress(60);
      const metadataFile = new File(
        [JSON.stringify(farmMetadata, null, 2)],
        'farm-metadata.json',
        { type: 'application/json' }
      );
      
      const metadataCID = await uploadToIPFS(metadataFile, {
        name: 'Farm Metadata',
        description: `Metadata for ${formData.name}`,
        type: 'application/json',
      });
      
      setUploadProgress(70);
      
      // 4. Registrar fazenda na blockchain
      const tokenizedFarm = await registerFarmOnChain({
        connection,
        wallet: publicKey,
        metadata: {
          name: formData.tokenName,
          symbol: formData.tokenSymbol,
          description: formData.tokenDescription,
          metadataUri: `ipfs://${metadataCID}`,
        },
        supply: formData.tokenSupply,
        price: formData.tokenPrice,
      });
      
      setUploadProgress(100);
      
      // 5. Registrar no banco de dados (opcional, depende da implementação)
      // ...
      
      // Sucesso
      enqueueSnackbar('Fazenda registrada com sucesso!', { variant: 'success' });
      
      // Registrar evento de sucesso
      createAlert({
        type: 'business',
        level: 'info',
        title: 'Nova fazenda registrada',
        message: `A fazenda ${formData.name} foi registrada com sucesso por ${user?.email}`,
      });
      
      // Redirecionar para a página de detalhes da fazenda
      router.push(`/enterprise/farms/${tokenizedFarm.mint.toString()}`);
      
      transaction.finish();
    } catch (error) {
      console.error('Erro ao registrar fazenda:', error);
      captureException(error);
      
      // Registrar evento de erro
      createAlert({
        type: 'business',
        level: 'error',
        title: 'Erro ao registrar fazenda',
        message: `Ocorreu um erro ao registrar a fazenda ${formData.name}: ${error.message}`,
      });
      
      enqueueSnackbar(`Erro ao registrar fazenda: ${error.message}`, { variant: 'error' });
      transaction.finish('error');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };
  
  // Renderizar conteúdo do passo atual
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nome da Fazenda"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Número de Registro (INCRA/CAR)"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                error={!!errors.registrationNumber}
                helperText={errors.registrationNumber}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nome do Proprietário"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                error={!!errors.ownerName}
                helperText={errors.ownerName}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Documento do Proprietário (CPF/CNPJ)"
                name="ownerDocument"
                value={formData.ownerDocument}
                onChange={handleChange}
                error={!!errors.ownerDocument}
                helperText={errors.ownerDocument}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.farmType} required>
                <InputLabel>Tipo de Propriedade</InputLabel>
                <Select
                  name="farmType"
                  value={formData.farmType}
                  onChange={handleChange}
                  label="Tipo de Propriedade"
                >
                  {farmTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.farmType && <FormHelperText>{errors.farmType}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.productionType} required>
                <InputLabel>Tipo de Produção</InputLabel>
                <Select
                  name="productionType"
                  value={formData.productionType}
                  onChange={handleChange}
                  label="Tipo de Produção"
                  disabled={!formData.farmType}
                >
                  {formData.farmType === 'crop' && cropTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                  {formData.farmType === 'livestock' && livestockTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                  {(formData.farmType === 'mixed' || formData.farmType === 'forestry' || formData.farmType === 'aquaculture') && (
                    <MenuItem value="general">
                      {formData.farmType === 'mixed' ? 'Produção Mista' : 
                       formData.farmType === 'forestry' ? 'Produção Florestal' : 'Produção Aquícola'}
                    </MenuItem>
                  )}
                </Select>
                {errors.productionType && <FormHelperText>{errors.productionType}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Área Total (hectares)"
                name="totalArea"
                type="number"
                value={formData.totalArea}
                onChange={handleChange}
                error={!!errors.totalArea}
                helperText={errors.totalArea}
                InputProps={{
                  endAdornment: <InputAdornment position="end">ha</InputAdornment>,
                }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Área Produtiva (hectares)"
                name="productiveArea"
                type="number"
                value={formData.productiveArea}
                onChange={handleChange}
                error={!!errors.productiveArea}
                helperText={errors.productiveArea}
                InputProps={{
                  endAdornment: <InputAdornment position="end">ha</InputAdornment>,
                }}
                required
              />
            </Grid>
          </Grid>
        );
        
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Documentos da Propriedade
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Faça upload dos documentos da propriedade (escritura, CAR, ITR, licenças ambientais, etc.)
              </Typography>
              
              {errors.documents && (
                <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                  {errors.documents}
                </Typography>
              )}
              
              <input
                accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx"
                style={{ display: 'none' }}
                id="document-upload"
                type="file"
                multiple
                onChange={handleDocumentUpload}
              />
              
              <label htmlFor="document-upload">
                <UploadBox>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Clique para fazer upload
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Arraste e solte arquivos ou clique para selecionar
                  </Typography>
                </UploadBox>
              </label>
            </Grid>
            
            {formData.documents.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Documentos Carregados
                </Typography>
                
                <Grid container spacing={2}>
                  {formData.documents.map((doc, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={2}>
                            <Box 
                              component="img" 
                              src={documentPreviews[index]}
                              alt={doc.name}
                              sx={{
                                width: 60,
                                height: 60,
                                objectFit: 'cover',
                                borderRadius: 1,
                                mr: 2,
                              }}
                            />
                            <Box>
                              <Typography variant="subtitle2" noWrap>
                                {doc.name}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {(doc.size / 1024).toFixed(2)} KB
                              </Typography>
                            </Box>
                          </Box>
                          
                          <TextField
                            fullWidth
                            label="Descrição do Documento"
                            value={formData.documentDescriptions[index]}
                            onChange={(e) => handleDocumentDescriptionChange(index, e.target.value)}
                            error={!!errors[`documentDescription-${index}`]}
                            helperText={errors[`documentDescription-${index}`]}
                            size="small"
                            margin="dense"
                            required
                          />
                          
                          <Box display="flex" justifyContent="flex-end" mt={1}>
                            <Button 
                              size="small" 
                              color="error" 
                              onClick={() => handleRemoveDocument(index)}
                            >
                              Remover
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}
          </Grid>
        );
        
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Endereço da Propriedade
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Endereço"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={!!errors.address}
                helperText={errors.address}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cidade"
                name="city"
                value={formData.city}
                onChange={handleChange}
                error={!!errors.city}
                helperText={errors.city}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth error={!!errors.state} required>
                <InputLabel>Estado</InputLabel>
                <Select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  label="Estado"
                >
                  {brazilianStates.map(state => (
                    <MenuItem key={state.value} value={state.value}>
                      {state.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.state && <FormHelperText>{errors.state}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="CEP"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                error={!!errors.zipCode}
                helperText={errors.zipCode}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Localização no Mapa
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Clique no mapa para selecionar a localização exata da propriedade
              </Typography>
              
              {errors.coordinates && (
                <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                  {errors.coordinates}
                </Typography>
              )}
              
              <Box sx={{ height: 400, width: '100%', border: '1px solid #ddd', borderRadius: 1 }}>
                <MapContainer 
                  center={[-15.7801, -47.9292]} // Centro do Brasil
                  zoom={4} 
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationPicker 
                    position={formData.coordinates} 
                    setPosition={(pos) => setFormData(prev => ({ ...prev, coordinates: pos }))}
                  />
                </MapContainer>
              </Box>
              
              {formData.coordinates && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Coordenadas selecionadas: {formData.coordinates[0].toFixed(6)}, {formData.coordinates[1].toFixed(6)}
                </Typography>
              )}
            </Grid>
          </Grid>
        );
        
      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Informações de Tokenização
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Configure os detalhes do token que representará sua propriedade na blockchain
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Símbolo do Token"
                name="tokenSymbol"
                value={formData.tokenSymbol}
                onChange={handleChange}
                error={!!errors.tokenSymbol}
                helperText={errors.tokenSymbol || 'Símbolo único que identificará seu token (ex: FARM)'}
                required
                inputProps={{ maxLength: 5 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nome do Token"
                name="tokenName"
                value={formData.tokenName}
                onChange={handleChange}
                error={!!errors.tokenName}
                helperText={errors.tokenName || 'Nome completo do token'}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Quantidade de Tokens"
                name="tokenSupply"
                type="number"
                value={formData.tokenSupply}
                onChange={handleChange}
                error={!!errors.tokenSupply}
                helperText={errors.tokenSupply || 'Quantidade total de tokens a serem emitidos'}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Preço Inicial por Token (USDC)"
                name="tokenPrice"
                type="number"
                value={formData.tokenPrice}
                onChange={handleChange}
                error={!!errors.tokenPrice}
                helperText={errors.tokenPrice || 'Preço inicial de cada token em USDC'}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição do Token"
                name="tokenDescription"
                value={formData.tokenDescription}
                onChange={handleChange}
                error={!!errors.tokenDescription}
                helperText={errors.tokenDescription || 'Descrição detalhada do token e da propriedade que ele representa'}
                multiline
                rows={4}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Resumo da Tokenização
              </Typography>
              
              <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, border: '1px solid #ddd' }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Valor Total Estimado:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" fontWeight="bold">
                      ${(formData.tokenSupply * formData.tokenPrice).toLocaleString()}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Valor por Hectare:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      ${formData.totalArea > 0 ? ((formData.tokenSupply * formData.tokenPrice) / formData.totalArea).toLocaleString(undefined, { maximumFractionDigits: 2 }) : 0}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Tokens por Hectare:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      {formData.totalArea > 0 ? (formData.tokenSupply / formData.totalArea).toLocaleString(undefined, { maximumFractionDigits: 2 }) : 0}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        );
        
      default:
        return null;
    }
  };
  
  // Renderizar botões de navegação
  const renderNavigationButtons = () => {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          disabled={activeStep === 0 || loading}
          onClick={handleBack}
          variant="outlined"
        >
          Voltar
        </Button>
        
        <Box sx={{ position: 'relative' }}>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrar Fazenda'}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={loading}
            >
              Próximo
            </Button>
          )}
          
          {loading && (
            <CircularProgress
              size={24}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          )}
        </Box>
      </Box>
    );
  };
  
  // Renderizar barra de progresso durante o upload
  const renderProgressBar = () => {
    if (!loading || uploadProgress === 0) return null;
    
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <Typography variant="body2" color="textSecondary" align="center">
          {uploadProgress < 100 ? 'Processando...' : 'Concluído!'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress variant="determinate" value={uploadProgress} />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography variant="body2" color="textSecondary">
              {`${Math.round(uploadProgress)}%`}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };
  
  // Componente principal
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Registrar Nova Propriedade Rural
      </Typography>
      
      <Typography variant="body1" color="textSecondary" paragraph>
        Registre sua propriedade rural na blockchain e tokenize seu ativo para acesso a financiamento e investimentos.
      </Typography>
      
      <Box sx={{ width: '100%', mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      
      <Box sx={{ mt: 2, mb: 4 }}>
        {renderStepContent()}
        {renderProgressBar()}
        {renderNavigationButtons()}
      </Box>
    </Container>
  );
};

export default RegisterFarm;