import { json } from 'itty-router-extras';

export function errorHandler(error) {
  return json({ 
    error: error.message || 'Erro interno do servidor'
  }, { 
    status: error.status || 500 
  });
}