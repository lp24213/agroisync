import { json } from '../utils/respond.js';

export function errorHandler(error) {
  return json({ 
    error: error.message || 'Erro interno do servidor'
  }, { 
    status: error.status || 500 
  });
}