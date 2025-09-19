import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Globe,
  Search,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AddressValidation = ({ 
  onAddressValidated, 
  initialCountry = 'BR',
  showCountrySelector = true,
  className = ''
}) => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [addressFormat, setAddressFormat] = useState(null);
  const [addressData, setAddressData] = useState({
    zipCode: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    province: '',
    address: ''
  });
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [isValid, setIsValid] = useState(false);

  // Carregar países suportados
  useEffect(() => {
    loadSupportedCountries();
  }, []);

  // Carregar formato de endereço quando país mudar
  useEffect(() => {
    if (selectedCountry) {
      loadAddressFormat(selectedCountry);
    }
  }, [selectedCountry]);

  const loadSupportedCountries = async () => {
    try {
      const response = await axios.get('/api/address/countries');
      if (response.data.success) {
        setCountries(response.data.data.countries);
      }
    } catch (error) {
      console.error('Erro ao carregar países:', error);
      toast.error('Erro ao carregar países suportados');
    }
  };

  const loadAddressFormat = async (country) => {
    try {
      const response = await axios.get(`/api/address/format/${country}`);
      if (response.data.success) {
        setAddressFormat(response.data.data.format);
        // Limpar dados quando mudar país
        setAddressData({
          zipCode: '',
          street: '',
          number: '',
          neighborhood: '',
          city: '',
          state: '',
          province: '',
          address: ''
        });
        setValidationResult(null);
        setIsValid(false);
      }
    } catch (error) {
      console.error('Erro ao carregar formato:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setAddressData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar validação anterior
    if (validationResult) {
      setValidationResult(null);
      setIsValid(false);
    }
  };

  const validateAddress = async () => {
    if (!addressFormat) return;

    // Verificar campos obrigatórios
    const requiredFields = addressFormat.required;
    const missingFields = requiredFields.filter(field => !addressData[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Preencha os campos obrigatórios: ${missingFields.join(', ')}`);
      return;
    }

    setIsValidating(true);
    
    try {
      const validationData = {
        country: selectedCountry,
        ...addressData
      };

      const response = await axios.post('/api/address/validate', validationData);
      
      if (response.data.success) {
        const result = response.data.data;
        setValidationResult(result);
        setIsValid(result.isValid);
        
        if (result.isValid) {
          toast.success('Endereço validado com sucesso!');
          if (onAddressValidated) {
            onAddressValidated(result.address);
          }
        } else {
          toast.error(`Endereço inválido: ${result.error}`);
        }
      }
    } catch (error) {
      console.error('Erro na validação:', error);
      toast.error('Erro ao validar endereço');
    } finally {
      setIsValidating(false);
    }
  };

  const renderAddressField = (field) => {
    if (!addressFormat.fields.includes(field)) return null;

    const label = addressFormat.labels[field];
    const isRequired = addressFormat.required.includes(field);
    const value = addressData[field] || '';

    return (
      <div key={field} className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
            isRequired && !value ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder={`Digite ${label.toLowerCase()}`}
        />
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Seletor de País */}
      {showCountrySelector && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            País <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="">Selecione um país</option>
            {countries.map(country => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Campos de Endereço */}
      {addressFormat && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {addressFormat.fields.map(field => renderAddressField(field))}
        </motion.div>
      )}

      {/* Botão de Validação */}
      {addressFormat && (
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={validateAddress}
            disabled={isValidating}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isValidating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Validando...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Validar Endereço</span>
              </>
            )}
          </motion.button>
        </div>
      )}

      {/* Resultado da Validação */}
      {validationResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border ${
            isValid 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}
        >
          <div className="flex items-start space-x-3">
            {isValid ? (
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
            )}
            <div className="flex-1">
              <h4 className={`font-medium ${
                isValid ? 'text-green-800' : 'text-red-800'
              }`}>
                {isValid ? 'Endereço Válido' : 'Endereço Inválido'}
              </h4>
              <p className={`text-sm mt-1 ${
                isValid ? 'text-green-700' : 'text-red-700'
              }`}>
                {isValid 
                  ? `Endereço validado via ${validationResult.source}`
                  : validationResult.error
                }
              </p>
              
              {isValid && validationResult.address && (
                <div className="mt-2 p-2 bg-white rounded border">
                  <p className="text-sm text-gray-600">
                    <strong>Endereço formatado:</strong><br />
                    {Object.values(validationResult.address)
                      .filter(value => value && value !== 'Unknown')
                      .join(', ')
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Informações Adicionais */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800">Sobre a Validação</h4>
            <p className="text-sm text-blue-700 mt-1">
              • Brasil: Validação via API dos Correios (ViaCEP)<br />
              • China: Validação via Baidu Maps API<br />
              • Outros países: Validação via Google Places API<br />
              • Campos marcados com * são obrigatórios
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressValidation;
