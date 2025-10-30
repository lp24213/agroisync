"""
🔐 AGROISYNC IA - Autenticação e Segurança
Módulo responsável por validar tokens e IPs autorizados
"""

import os
from typing import Optional
from fastapi import Request, HTTPException
from dotenv import load_dotenv

load_dotenv()

# Configurações de segurança
IA_SECRET_TOKEN = os.getenv('IA_SECRET_TOKEN', '')
ALLOWED_IPS = os.getenv('ALLOWED_IPS', '').split(',')

def verify_token(request: Request) -> bool:
    """
    Verifica se o token de autorização é válido
    
    Args:
        request: Request do FastAPI
        
    Returns:
        bool: True se válido
        
    Raises:
        HTTPException: 401 se token inválido
    """
    auth_header = request.headers.get('Authorization')
    
    if not auth_header:
        raise HTTPException(
            status_code=401,
            detail={"error": "unauthorized", "message": "Token de autorização não fornecido"}
        )
    
    # Formato: "Bearer <token>"
    parts = auth_header.split(' ')
    if len(parts) != 2 or parts[0].lower() != 'bearer':
        raise HTTPException(
            status_code=401,
            detail={"error": "unauthorized", "message": "Formato de token inválido"}
        )
    
    token = parts[1]
    
    if not IA_SECRET_TOKEN:
        raise HTTPException(
            status_code=500,
            detail={"error": "server_error", "message": "Token secreto não configurado no servidor"}
        )
    
    if token != IA_SECRET_TOKEN:
        raise HTTPException(
            status_code=401,
            detail={"error": "unauthorized", "message": "Token inválido"}
        )
    
    return True


def verify_ip(request: Request) -> bool:
    """
    Verifica se o IP do cliente está na lista de IPs autorizados
    
    Args:
        request: Request do FastAPI
        
    Returns:
        bool: True se permitido
        
    Raises:
        HTTPException: 403 se IP bloqueado
    """
    # Tentar obter IP real (considerando proxies e Cloudflare)
    client_ip = (
        request.headers.get('CF-Connecting-IP') or  # Cloudflare
        request.headers.get('X-Forwarded-For', '').split(',')[0].strip() or  # Proxy
        request.headers.get('X-Real-IP') or  # Nginx
        request.client.host if request.client else None
    )
    
    if not client_ip:
        raise HTTPException(
            status_code=403,
            detail={"error": "forbidden", "message": "Não foi possível identificar o IP"}
        )
    
    # Verificar se lista de IPs está configurada
    if not ALLOWED_IPS or ALLOWED_IPS == ['']:
        # Modo desenvolvimento - permite qualquer IP se não configurado
        if os.getenv('ENVIRONMENT') == 'development':
            return True
        raise HTTPException(
            status_code=500,
            detail={"error": "server_error", "message": "Lista de IPs autorizados não configurada"}
        )
    
    # Verificar se IP está na lista
    if client_ip not in ALLOWED_IPS:
        raise HTTPException(
            status_code=403,
            detail={
                "error": "forbidden", 
                "message": f"IP {client_ip} não autorizado",
                "ip": client_ip
            }
        )
    
    return True


def get_client_ip(request: Request) -> str:
    """
    Obtém o IP real do cliente (considerando proxies)
    
    Args:
        request: Request do FastAPI
        
    Returns:
        str: IP do cliente
    """
    return (
        request.headers.get('CF-Connecting-IP') or
        request.headers.get('X-Forwarded-For', '').split(',')[0].strip() or
        request.headers.get('X-Real-IP') or
        request.client.host if request.client else 'unknown'
    )


def verify_admin_access(request: Request) -> bool:
    """
    Verifica se o usuário tem acesso de administrador
    (pode ser expandido para verificar JWT do Agroisync)
    
    Args:
        request: Request do FastAPI
        
    Returns:
        bool: True se admin
    """
    # Verificar token da IA (admin tem acesso via token secreto)
    verify_token(request)
    verify_ip(request)
    
    return True

