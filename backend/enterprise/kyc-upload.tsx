import React, { useState, useEffect, useCallback } from 'react';
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
  InputLabel,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  useTheme,
  Alert,
  AlertTitle,
  IconButton,
  Paper,
  LinearProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useDropzone } from 'react-dropzone';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';

// Importações internas
import { useAuth } from '../hooks/useAuth';
import { captureException, startTransaction } from '../monitoring/sentry.config';
import { createAlert } from '../monitoring/alerts';
import { uploadToIPFS } from '../utils/ipfs';

// Componente para upload de arquivos estilizado
const DropzoneContainer = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: theme.palette.background.default,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.primary.dark,
  },
  '&.active': {
    borderColor: theme.palette.success.main,
    backgroundColor: theme.palette.success.light + '20',
  },
}));

// Tipos de documentos KYC/AML
const documentTypes = [
  { value: 'id_card', label: 'Carteira de Identidade' },
  { value: 'passport', label: 'Passaporte' },
  { value: 'drivers_license', label: 'Carteira de Motorista' },
  { value: 'tax_id', label: 'CPF' },
  { value: 'company_registration', label: 'CNPJ' },
  { value: 'proof_of_address', label: 'Comprovante de Residência' },
  { value: 'bank_statement', label: 'Extrato Bancário' },
  { value: 'utility_bill', label: 'Conta de Serviço Público' },
  { value: 'articles_of_incorporation', label: 'Contrato Social' },
  { value: 'certificate_of_incorporation', label: 'Certificado de Registro' },
  { value: 'financial_statement', label: 'Demonstrativo Financeiro' },
  { value: 'other', label: 'Outro' },
];

// Tipos de entidades
const entityTypes = [
  { value: 'individual', label: 'Pessoa Física' },
  { value: 'company', label: 'Pessoa Jurídica' },
  { value: 'partnership', label: 'Sociedade' },
  { value: 'trust', label: 'Trust' },
  { value: 'foundation', label: 'Fundação' },
  { value: 'other', label: 'Outro' },
];

// Passos do formulário
const steps = ['Informações Básicas', 'Upload de Documentos', 'Verificação', 'Confirmação'];

// Interface para os dados do formulário
interface KYCData {
  entityType: string;
  fullName: string;
  email: string;
  phone: string;
  taxId: string;
  dateOfBirth?: string;
  nationality?: string;
  companyName?: string;
  registrationNumber?: string;
  incorporationDate?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  documents: Array<{
    file: File;
    type: string;
    description: string;
    status: 'pending' | 'uploaded' | 'verified' | 'rejected';
    message?: string;
    ipfsHash?: string;
  }>;
  termsAccepted: boolean;
  privacyAccepted: boolean;
}

// Componente principal
const KYCUpload: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { publicKey } = useWallet();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  // Estado para controlar o passo atual
  const [activeStep, setActiveStep] = useState(0);
  
  // Estado para os dados do formulário
  const [formData, setFormData] = useState<KYCData>({
    entityType: 'individual',
    fullName: '',
    email: '',
    phone: '',
    taxId: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Brasil',
    documents: [],
    termsAccepted: false,
    privacyAccepted: false,
  });
  
  // Estados para controle de validação e carregamento
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<Record<number, number>>({});
  const [overallProgress, setOverallProgress] = useState<number>(0);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'processing' | 'approved' | 'rejected'>('pending');
  const [verificationMessage, setVerificationMessage] = useState<string>('');
  
  // Verificar autenticação
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      enqueueSnackbar('Você precisa estar autenticado para completar o processo KYC', { 
        variant: 'warning',
        action: (
          <Button color="inherit" size="small" onClick={() => router.push('/auth/login')}>
            Login
          </Button>
        )
      });
      router.push('/auth/login?redirect=/enterprise/kyc-upload');
    }
  }, [authLoading, isAuthenticated, router, enqueueSnackbar]);
  
  // Verificar carteira conectada
  useEffect(() => {
    if (isAuthenticated && !publicKey) {
      enqueueSnackbar('Conecte sua carteira para continuar', { variant: 'warning' });
    }
  }, [isAuthenticated, publicKey, enqueueSnackbar]);
  
  // Preencher dados do usuário se disponíveis
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.displayName || prev.fullName,
        email: user.email || prev.email,
      }));
    }
  }, [user]);
  
  // Configuração do dropzone para upload de arquivos
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Verificar se já existem documentos do mesmo tipo
    const newDocuments = acceptedFiles.map(file => ({
      file,
      type: '',
      description: '',
      status: 'pending' as const,
    }));
    
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...newDocuments],
    }));
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 10485760, // 10MB
  });
  
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
  
  // Manipulador de checkbox
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: checked,
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
  
  // Manipulador de tipo de documento
  const handleDocumentTypeChange = (index: number, value: string) => {
    setFormData(prev => {
      const newDocuments = [...prev.documents];
      newDocuments[index] = {
        ...newDocuments[index],
        type: value,
      };
      return {
        ...prev,
        documents: newDocuments,
      };
    });
  };
  
  // Manipulador de descrição de documento
  const handleDocumentDescriptionChange = (index: number, value: string) => {
    setFormData(prev => {
      const newDocuments = [...prev.documents];
      newDocuments[index] = {
        ...newDocuments[index],
        description: value,
      };
      return {
        ...prev,
        documents: newDocuments,
      };
    });
  };
  
  // Remover documento
  const handleRemoveDocument = (index: number) => {
    setFormData(prev => {
      const newDocuments = [...prev.documents];
      newDocuments.splice(index, 1);
      return {
        ...prev,
        documents: newDocuments,
      };
    });
    
    // Remover progresso de upload
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[index];
      return newProgress;
    });
  };
  
  // Validar passo atual
  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (activeStep) {
      case 0: // Informações Básicas
        if (!formData.entityType) newErrors.entityType = 'Tipo de entidade é obrigatório';
        if (!formData.fullName) newErrors.fullName = 'Nome completo é obrigatório';
        if (!formData.email) newErrors.email = 'Email é obrigatório';
        else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email inválido';
        if (!formData.phone) newErrors.phone = 'Telefone é obrigatório';
        if (!formData.taxId) newErrors.taxId = 'CPF/CNPJ é obrigatório';
        
        if (formData.entityType === 'individual') {
          if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Data de nascimento é obrigatória';
          if (!formData.nationality) newErrors.nationality = 'Nacionalidade é obrigatória';
        } else {
          if (!formData.companyName) newErrors.companyName = 'Nome da empresa é obrigatório';
          if (!formData.registrationNumber) newErrors.registrationNumber = 'Número de registro é obrigatório';
        }
        
        if (!formData.address) newErrors.address = 'Endereço é obrigatório';
        if (!formData.city) newErrors.city = 'Cidade é obrigatória';
        if (!formData.state) newErrors.state = 'Estado é obrigatório';
        if (!formData.zipCode) newErrors.zipCode = 'CEP é obrigatório';
        if (!formData.country) newErrors.country = 'País é obrigatório';
        break;
        
      case 1: // Upload de Documentos
        if (formData.documents.length === 0) {
          newErrors.documents = 'Pelo menos um documento é obrigatório';
        } else {
          formData.documents.forEach((doc, index) => {
            if (!doc.type) newErrors[`documentType-${index}`] = 'Tipo de documento é obrigatório';
            if (!doc.description) newErrors[`documentDescription-${index}`] = 'Descrição do documento é obrigatória';
          });
        }
        break;
        
      case 2: // Verificação
        // Nenhuma validação necessária neste passo
        break;
        
      case 3: // Confirmação
        if (!formData.termsAccepted) newErrors.termsAccepted = 'Você deve aceitar os termos e condições';
        if (!formData.privacyAccepted) newErrors.privacyAccepted = 'Você deve aceitar a política de privacidade';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Avançar para o próximo passo
  const handleNext = async () => {
    if (validateStep()) {
      // Se estiver no passo de upload de documentos, fazer upload antes de avançar
      if (activeStep === 1) {
        await uploadDocuments();
      }
      
      // Se estiver no passo de verificação, simular verificação
      if (activeStep === 2) {
        await simulateVerification();
      }
      
      setActiveStep(prev => prev + 1);
    }
  };
  
  // Voltar para o passo anterior
  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };
  
  // Upload de documentos para IPFS
  const uploadDocuments = async () => {
    if (formData.documents.length === 0) return;
    
    const transaction = startTransaction({
      name: 'kyc-document-upload',
      op: 'document-upload',
    });
    
    try {
      setLoading(true);
      
      // Verificar se o usuário está autenticado
      if (!isAuthenticated) {
        throw new Error('Você precisa estar autenticado para fazer upload de documentos');
      }
      
      // Fazer upload de cada documento
      const totalDocuments = formData.documents.length;
      let completedUploads = 0;
      
      const updatedDocuments = [...formData.documents];
      
      for (let i = 0; i < totalDocuments; i++) {
        const doc = formData.documents[i];
        
        // Pular documentos já enviados
        if (doc.status === 'uploaded' || doc.status === 'verified') {
          completedUploads++;
          continue;
        }
        
        try {
          // Iniciar progresso
          setUploadProgress(prev => ({ ...prev, [i]: 0 }));
          
          // Upload para IPFS com metadados
          const ipfsHash = await uploadToIPFS(doc.file, {
            name: doc.file.name,
            type: doc.type,
            description: doc.description,
            owner: user?.id,
            entityType: formData.entityType,
            uploadedAt: new Date().toISOString(),
          }, (progress) => {
            // Atualizar progresso individual
            setUploadProgress(prev => ({ ...prev, [i]: progress }));
            
            // Calcular progresso geral
            const totalProgress = Object.values({
              ...uploadProgress,
              [i]: progress,
            }).reduce((sum, current) => sum + current, 0) / totalDocuments;
            
            setOverallProgress(totalProgress);
          });
          
          // Atualizar documento com hash IPFS
          updatedDocuments[i] = {
            ...doc,
            status: 'uploaded',
            ipfsHash,
          };
          
          // Atualizar progresso
          setUploadProgress(prev => ({ ...prev, [i]: 100 }));
          completedUploads++;
          
          // Registrar evento de sucesso
          createAlert({
            type: 'business',
            level: 'info',
            title: 'Documento KYC enviado',
            message: `Documento ${doc.type} foi enviado com sucesso para IPFS`,
          });
        } catch (error) {
          console.error(`Erro ao fazer upload do documento ${i}:`, error);
          captureException(error);
          
          // Marcar documento como falha
          updatedDocuments[i] = {
            ...doc,
            status: 'rejected',
            message: `Erro ao fazer upload: ${error.message}`,
          };
          
          // Registrar evento de erro
          createAlert({
            type: 'business',
            level: 'error',
            title: 'Erro ao enviar documento KYC',
            message: `Erro ao enviar documento ${doc.type}: ${error.message}`,
          });
        }
      }
      
      // Atualizar documentos no estado
      setFormData(prev => ({
        ...prev,
        documents: updatedDocuments,
      }));
      
      // Verificar se todos os documentos foram enviados
      if (completedUploads === totalDocuments) {
        enqueueSnackbar('Todos os documentos foram enviados com sucesso!', { variant: 'success' });
      } else {
        enqueueSnackbar(`${completedUploads} de ${totalDocuments} documentos foram enviados com sucesso.`, { variant: 'info' });
      }
      
      transaction.finish();
      return true;
    } catch (error) {
      console.error('Erro ao fazer upload de documentos:', error);
      captureException(error);
      
      enqueueSnackbar(`Erro ao fazer upload de documentos: ${error.message}`, { variant: 'error' });
      transaction.finish('error');
      return false;
    } finally {
      setLoading(false);
      setOverallProgress(0);
    }
  };
  
  // Simular verificação de documentos (em produção, seria um processo assíncrono)
  const simulateVerification = async () => {
    setLoading(true);
    setVerificationStatus('processing');
    setVerificationMessage('Verificando documentos...');
    
    // Simular tempo de processamento
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Verificar se todos os documentos foram enviados
    const allUploaded = formData.documents.every(doc => doc.status === 'uploaded' || doc.status === 'verified');
    
    if (allUploaded) {
      // Atualizar status dos documentos
      const updatedDocuments = formData.documents.map(doc => ({
        ...doc,
        status: 'verified',
      }));
      
      setFormData(prev => ({
        ...prev,
        documents: updatedDocuments,
      }));
      
      setVerificationStatus('approved');
      setVerificationMessage('Todos os documentos foram verificados e aprovados.');
    } else {
      setVerificationStatus('rejected');
      setVerificationMessage('Alguns documentos não foram enviados ou foram rejeitados. Por favor, verifique e tente novamente.');
    }
    
    setLoading(false);
    return allUploaded;
  };
  
  // Enviar formulário final
  const handleSubmit = async () => {
    if (!validateStep()) return;
    
    const transaction = startTransaction({
      name: 'kyc-submission',
      op: 'kyc-submit',
    });
    
    try {
      setLoading(true);
      
      // Verificar se o usuário está autenticado e tem carteira conectada
      if (!isAuthenticated || !publicKey) {
        throw new Error('Você precisa estar autenticado e com a carteira conectada');
      }
      
      // Verificar se todos os documentos foram verificados
      const allVerified = formData.documents.every(doc => doc.status === 'verified');
      if (!allVerified) {
        throw new Error('Todos os documentos devem ser verificados antes de enviar');
      }
      
      // Preparar dados para envio
      const kycSubmission = {
        userId: user?.id,
        walletAddress: publicKey.toString(),
        entityType: formData.entityType,
        personalInfo: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          taxId: formData.taxId,
          dateOfBirth: formData.dateOfBirth,
          nationality: formData.nationality,
          companyName: formData.companyName,
          registrationNumber: formData.registrationNumber,
          incorporationDate: formData.incorporationDate,
        },
        address: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        documents: formData.documents.map(doc => ({
          type: doc.type,
          description: doc.description,
          ipfsHash: doc.ipfsHash,
          status: doc.status,
          uploadedAt: new Date().toISOString(),
        })),
        termsAccepted: formData.termsAccepted,
        privacyAccepted: formData.privacyAccepted,
        submittedAt: new Date().toISOString(),
        status: 'pending',
      };
      
      // Simular envio para API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Registrar evento de sucesso
      createAlert({
        type: 'business',
        level: 'info',
        title: 'Verificação KYC enviada',
        message: `Verificação KYC para ${formData.fullName} foi enviada com sucesso`,
      });
      
      // Sucesso
      enqueueSnackbar('Verificação KYC enviada com sucesso!', { variant: 'success' });
      
      // Redirecionar para a página de status
      router.push('/enterprise/kyc-status');
      
      transaction.finish();
    } catch (error) {
      console.error('Erro ao enviar verificação KYC:', error);
      captureException(error);
      
      // Registrar evento de erro
      createAlert({
        type: 'business',
        level: 'error',
        title: 'Erro ao enviar verificação KYC',
        message: `Ocorreu um erro ao enviar verificação KYC: ${error.message}`,
      });
      
      enqueueSnackbar(`Erro ao enviar verificação KYC: ${error.message}`, { variant: 'error' });
      transaction.finish('error');
    } finally {
      setLoading(false);
    }
  };
  
  // Renderizar conteúdo do passo atual
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.entityType} required>
                <InputLabel>Tipo de Entidade</InputLabel>
                <Select
                  name="entityType"
                  value={formData.entityType}
                  onChange={handleChange}
                  label="Tipo de Entidade"
                >
                  {entityTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.entityType && <FormHelperText>{errors.entityType}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nome Completo"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                error={!!errors.fullName}
                helperText={errors.fullName}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Telefone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={formData.entityType === 'individual' ? 'CPF' : 'CNPJ'}
                name="taxId"
                value={formData.taxId}
                onChange={handleChange}
                error={!!errors.taxId}
                helperText={errors.taxId}
                required
              />
            </Grid>
            
            {formData.entityType === 'individual' ? (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Data de Nascimento"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth || ''}
                    onChange={handleChange}
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nacionalidade"
                    name="nationality"
                    value={formData.nationality || ''}
                    onChange={handleChange}
                    error={!!errors.nationality}
                    helperText={errors.nationality}
                    required
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nome da Empresa"
                    name="companyName"
                    value={formData.companyName || ''}
                    onChange={handleChange}
                    error={!!errors.companyName}
                    helperText={errors.companyName}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Número de Registro"
                    name="registrationNumber"
                    value={formData.registrationNumber || ''}
                    onChange={handleChange}
                    error={!!errors.registrationNumber}
                    helperText={errors.registrationNumber}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Data de Constituição"
                    name="incorporationDate"
                    type="date"
                    value={formData.incorporationDate || ''}
                    onChange={handleChange}
                    error={!!errors.incorporationDate}
                    helperText={errors.incorporationDate}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </>
            )}
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                Endereço
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
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Estado"
                name="state"
                value={formData.state}
                onChange={handleChange}
                error={!!errors.state}
                helperText={errors.state}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
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
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="País"
                name="country"
                value={formData.country}
                onChange={handleChange}
                error={!!errors.country}
                helperText={errors.country}
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
                Upload de Documentos
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Faça upload dos documentos necessários para verificação KYC/AML. Todos os documentos devem estar legíveis e válidos.
              </Typography>
              
              {errors.documents && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errors.documents}
                </Alert>
              )}
              
              <DropzoneContainer
                {...getRootProps()}
                className={isDragActive ? 'active' : ''}
              >
                <input {...getInputProps()} />
                <CloudUploadIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                {isDragActive ? (
                  <Typography variant="h6" color="primary">
                    Solte os arquivos aqui...
                  </Typography>
                ) : (
                  <>
                    <Typography variant="h6" color="primary" gutterBottom>
                      Arraste e solte arquivos aqui
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      ou clique para selecionar arquivos
                    </Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: 'block' }}>
                      Formatos aceitos: JPG, PNG, PDF (máx. 10MB)
                    </Typography>
                  </>
                )}
              </DropzoneContainer>
            </Grid>
            
            {formData.documents.length > 0 && (
              <Grid item xs={12} sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Documentos Carregados
                </Typography>
                
                {formData.documents.map((doc, index) => (
                  <Paper 
                    key={index} 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      mb: 2,
                      borderColor: doc.status === 'rejected' ? 'error.main' : 
                                  doc.status === 'verified' ? 'success.main' : 
                                  doc.status === 'uploaded' ? 'info.main' : 'divider'
                    }}
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={6} md={4}>
                        <Box display="flex" alignItems="center">
                          {doc.status === 'verified' && <CheckCircleIcon color="success" sx={{ mr: 1 }} />}
                          {doc.status === 'rejected' && <ErrorIcon color="error" sx={{ mr: 1 }} />}
                          {doc.status === 'uploaded' && <InfoIcon color="info" sx={{ mr: 1 }} />}
                          {doc.status === 'pending' && <WarningIcon color="warning" sx={{ mr: 1 }} />}
                          
                          <Typography variant="subtitle2" noWrap>
                            {doc.file.name}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="textSecondary">
                          {(doc.file.size / 1024).toFixed(2)} KB
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth error={!!errors[`documentType-${index}`]} required size="small">
                          <InputLabel>Tipo de Documento</InputLabel>
                          <Select
                            value={doc.type}
                            onChange={(e) => handleDocumentTypeChange(index, e.target.value as string)}
                            label="Tipo de Documento"
                          >
                            {documentTypes.map(type => (
                              <MenuItem key={type.value} value={type.value}>
                                {type.label}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors[`documentType-${index}`] && (
                            <FormHelperText>{errors[`documentType-${index}`]}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Descrição"
                          value={doc.description}
                          onChange={(e) => handleDocumentDescriptionChange(index, e.target.value)}
                          error={!!errors[`documentDescription-${index}`]}
                          helperText={errors[`documentDescription-${index}`]}
                          size="small"
                          required
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={1} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton 
                          color="error" 
                          onClick={() => handleRemoveDocument(index)}
                          disabled={doc.status === 'verified'}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                      
                      {(uploadProgress[index] !== undefined && uploadProgress[index] < 100) && (
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ width: '100%', mr: 1 }}>
                              <LinearProgress variant="determinate" value={uploadProgress[index]} />
                            </Box>
                            <Box sx={{ minWidth: 35 }}>
                              <Typography variant="body2" color="textSecondary">
                                {`${Math.round(uploadProgress[index])}%`}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      )}
                      
                      {doc.status === 'rejected' && doc.message && (
                        <Grid item xs={12}>
                          <Alert severity="error">
                            {doc.message}
                          </Alert>
                        </Grid>
                      )}
                      
                      {doc.status === 'uploaded' && (
                        <Grid item xs={12}>
                          <Alert severity="info">
                            Documento enviado com sucesso. Aguardando verificação.
                          </Alert>
                        </Grid>
                      )}
                      
                      {doc.status === 'verified' && (
                        <Grid item xs={12}>
                          <Alert severity="success">
                            Documento verificado com sucesso.
                          </Alert>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                ))}
              </Grid>
            )}
          </Grid>
        );
        
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Verificação de Documentos
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Seus documentos estão sendo verificados. Este processo pode levar alguns minutos.
              </Typography>
              
              <Alert 
                severity={
                  verificationStatus === 'pending' || verificationStatus === 'processing' ? 'info' :
                  verificationStatus === 'approved' ? 'success' : 'error'
                }
                sx={{ mb: 3 }}
              >
                <AlertTitle>
                  {verificationStatus === 'pending' && 'Aguardando Verificação'}
                  {verificationStatus === 'processing' && 'Processando'}
                  {verificationStatus === 'approved' && 'Aprovado'}
                  {verificationStatus === 'rejected' && 'Rejeitado'}
                </AlertTitle>
                {verificationMessage}
              </Alert>
              
              {(verificationStatus === 'pending' || verificationStatus === 'processing') && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress />
                </Box>
              )}
              
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
                Status dos Documentos
              </Typography>
              
              <Grid container spacing={2}>
                {formData.documents.map((doc, index) => (
                  <Grid item xs={12} key={index}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={1}>
                          {doc.status === 'verified' && <CheckCircleIcon color="success" />}
                          {doc.status === 'rejected' && <ErrorIcon color="error" />}
                          {doc.status === 'uploaded' && <InfoIcon color="info" />}
                          {doc.status === 'pending' && <WarningIcon color="warning" />}
                        </Grid>
                        
                        <Grid item xs={11} sm={5}>
                          <Typography variant="subtitle2">
                            {documentTypes.find(t => t.value === doc.type)?.label || doc.type}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" noWrap>
                            {doc.file.name}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2">
                            Status: 
                            <Box component="span" sx={{ 
                              ml: 1,
                              color: doc.status === 'verified' ? 'success.main' :
                                    doc.status === 'rejected' ? 'error.main' :
                                    doc.status === 'uploaded' ? 'info.main' : 'warning.main'
                            }}>
                              {doc.status === 'verified' && 'Verificado'}
                              {doc.status === 'rejected' && 'Rejeitado'}
                              {doc.status === 'uploaded' && 'Enviado'}
                              {doc.status === 'pending' && 'Pendente'}
                            </Box>
                          </Typography>
                          
                          {doc.message && (
                            <Typography variant="body2" color="error">
                              {doc.message}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        );
        
      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="success" sx={{ mb: 3 }}>
                <AlertTitle>Verificação Concluída</AlertTitle>
                Seus documentos foram verificados com sucesso. Por favor, revise suas informações e confirme o envio.
              </Alert>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Resumo das Informações
              </Typography>
              
              <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Tipo de Entidade
                    </Typography>
                    <Typography variant="body1">
                      {entityTypes.find(t => t.value === formData.entityType)?.label}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Nome Completo
                    </Typography>
                    <Typography variant="body1">
                      {formData.fullName}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {formData.email}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Telefone
                    </Typography>
                    <Typography variant="body1">
                      {formData.phone}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      {formData.entityType === 'individual' ? 'CPF' : 'CNPJ'}
                    </Typography>
                    <Typography variant="body1">
                      {formData.taxId}
                    </Typography>
                  </Grid>
                  
                  {formData.entityType === 'individual' ? (
                    <>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">
                          Data de Nascimento
                        </Typography>
                        <Typography variant="body1">
                          {formData.dateOfBirth}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">
                          Nacionalidade
                        </Typography>
                        <Typography variant="body1">
                          {formData.nationality}
                        </Typography>
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">
                          Nome da Empresa
                        </Typography>
                        <Typography variant="body1">
                          {formData.companyName}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">
                          Número de Registro
                        </Typography>
                        <Typography variant="body1">
                          {formData.registrationNumber}
                        </Typography>
                      </Grid>
                    </>
                  )}
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Endereço
                    </Typography>
                    <Typography variant="body1">
                      {formData.address}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="textSecondary">
                      Cidade
                    </Typography>
                    <Typography variant="body1">
                      {formData.city}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="textSecondary">
                      Estado
                    </Typography>
                    <Typography variant="body1">
                      {formData.state}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="textSecondary">
                      CEP
                    </Typography>
                    <Typography variant="body1">
                      {formData.zipCode}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
              
              <Typography variant="subtitle1" gutterBottom>
                Documentos Verificados
              </Typography>
              
              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2}>
                  {formData.documents.map((doc, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Box sx={{ 
                        p: 2, 
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                        <Box>
                          <Typography variant="subtitle2">
                            {documentTypes.find(t => t.value === doc.type)?.label}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" noWrap>
                            {doc.description}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
              
              <Typography variant="subtitle1" gutterBottom>
                Termos e Condições
              </Typography>
              
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl error={!!errors.termsAccepted} required>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <input
                          type="checkbox"
                          name="termsAccepted"
                          checked={formData.termsAccepted}
                          onChange={handleCheckboxChange}
                          style={{ marginTop: 4, marginRight: 8 }}
                        />
                        <Typography variant="body2">
                          Eu li e aceito os <Box component="span" sx={{ color: 'primary.main', cursor: 'pointer' }}>Termos e Condições</Box> da plataforma AGROISYNC.
                        </Typography>
                      </Box>
                      {errors.termsAccepted && <FormHelperText>{errors.termsAccepted}</FormHelperText>}
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl error={!!errors.privacyAccepted} required>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <input
                          type="checkbox"
                          name="privacyAccepted"
                          checked={formData.privacyAccepted}
                          onChange={handleCheckboxChange}
                          style={{ marginTop: 4, marginRight: 8 }}
                        />
                        <Typography variant="body2">
                          Eu li e aceito a <Box component="span" sx={{ color: 'primary.main', cursor: 'pointer' }}>Política de Privacidade</Box> da plataforma AGROISYNC.
                        </Typography>
                      </Box>
                      {errors.privacyAccepted && <FormHelperText>{errors.privacyAccepted}</FormHelperText>}
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>
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
              disabled={loading || verificationStatus !== 'approved'}
            >
              {loading ? 'Enviando...' : 'Enviar Verificação'}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={loading}
            >
              {activeStep === 1 ? 'Enviar Documentos' : 'Próximo'}
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
    if (!loading || overallProgress === 0) return null;
    
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <Typography variant="body2" color="textSecondary" align="center">
          {overallProgress < 100 ? 'Enviando documentos...' : 'Concluído!'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress variant="determinate" value={overallProgress} />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography variant="body2" color="textSecondary">
              {`${Math.round(overallProgress)}%`}
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
        Verificação KYC/AML
      </Typography>
      
      <Typography variant="body1" color="textSecondary" paragraph>
        Complete o processo de verificação Know Your Customer (KYC) e Anti-Money Laundering (AML) para acessar todos os recursos da plataforma AGROISYNC.
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

export default KYCUpload;