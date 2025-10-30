"""
🧠 AGROISYNC IA - Backend Administrador
Sistema de IA que gerencia e atualiza conteúdo do site automaticamente
Integrado com planos: Público, Privado, Loja, Admin
"""

from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any
import os
from datetime import datetime
from dotenv import load_dotenv

from utils.auth import verify_token, verify_ip, get_client_ip, verify_admin_access
from utils.logger import log_action, get_logs, get_logs_from_file, get_log_stats, clear_logs

# Carregar variáveis de ambiente
load_dotenv()

# Inicializar FastAPI
app = FastAPI(
    title="Agroisync IA Admin",
    description="Sistema de IA para gerenciamento automático do Agroisync",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv('CORS_ORIGINS', 'https://agroisync.com,https://www.agroisync.com').split(','),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================
# MIDDLEWARE DE SEGURANÇA
# ============================================

@app.middleware("http")
async def security_middleware(request: Request, call_next):
    """
    Middleware global que valida token e IP para rotas protegidas
    """
    path = request.url.path
    
    # Rotas públicas (não requerem autenticação)
    public_routes = ['/api/health', '/api/status', '/docs', '/openapi.json', '/redoc']
    
    if path in public_routes or not path.startswith('/api/'):
        return await call_next(request)
    
    # Rotas protegidas (começam com /api/update-* ou /api/logs)
    if path.startswith('/api/update-') or path.startswith('/api/logs'):
        client_ip = get_client_ip(request)
        
        try:
            # Verificar token
            verify_token(request)
            
            # Verificar IP
            verify_ip(request)
            
            # Prosseguir com a requisição
            response = await call_next(request)
            return response
            
        except HTTPException as e:
            # Logar tentativa bloqueada
            log_action(
                action=f"Tentativa de acesso a {path}",
                status="BLOCKED",
                ip=client_ip,
                details=str(e.detail)
            )
            
            return JSONResponse(
                status_code=e.status_code,
                content=e.detail
            )
    
    # Outras rotas
    return await call_next(request)


# ============================================
# MODELOS DE DADOS
# ============================================

class NewsUpdate(BaseModel):
    title: str
    content: str
    category: str = "geral"
    source: Optional[str] = "IA Agroisync"
    plan_level: str = "publico"  # publico, privado, loja, admin

class WeatherUpdate(BaseModel):
    location: str
    temperature: float
    humidity: float
    description: str
    forecast: Optional[str] = None
    plan_level: str = "publico"

class CotationUpdate(BaseModel):
    product: str
    price: float
    currency: str = "BRL"
    market: str
    variation: Optional[float] = None
    plan_level: str = "publico"

class LogQuery(BaseModel):
    limit: int = 100
    status_filter: Optional[str] = None


# ============================================
# ROTAS PÚBLICAS
# ============================================

@app.get("/api/health")
async def health_check():
    """
    🏥 Health check - rota pública
    """
    return {
        "status": "healthy",
        "service": "Agroisync IA Admin",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }


@app.get("/api/status")
async def status():
    """
    📊 Status do sistema - rota pública
    """
    return {
        "status": "online",
        "authenticated": False,
        "message": "Sistema operacional. Use token para acessar endpoints protegidos."
    }


# ============================================
# ROTAS PROTEGIDAS - ATUALIZAÇÕES
# ============================================

@app.post("/api/update-news")
async def update_news(news: NewsUpdate, request: Request):
    """
    📰 Atualizar notícias
    Requer: Token válido + IP autorizado
    """
    client_ip = get_client_ip(request)
    
    # Validar nível de acesso baseado no plano
    plan_levels = {
        "publico": 1,
        "privado": 2,
        "loja": 3,
        "admin": 4
    }
    
    required_level = plan_levels.get(news.plan_level, 1)
    
    # Logar ação
    log_action(
        action=f"Atualizou Notícia: {news.title[:30]}...",
        status="OK",
        ip=client_ip,
        details=f"Plano: {news.plan_level}, Categoria: {news.category}"
    )
    
    # Aqui você integraria com o banco de dados do Agroisync
    # Por enquanto, retorna sucesso
    
    return {
        "success": True,
        "message": "Notícia atualizada com sucesso",
        "data": {
            "title": news.title,
            "plan_level": news.plan_level,
            "category": news.category,
            "required_plan": required_level
        }
    }


@app.post("/api/update-weather")
async def update_weather(weather: WeatherUpdate, request: Request):
    """
    🌤️ Atualizar informações meteorológicas
    Requer: Token válido + IP autorizado
    """
    client_ip = get_client_ip(request)
    
    log_action(
        action=f"Atualizou Clima: {weather.location}",
        status="OK",
        ip=client_ip,
        details=f"Temp: {weather.temperature}°C, Plano: {weather.plan_level}"
    )
    
    return {
        "success": True,
        "message": "Clima atualizado com sucesso",
        "data": {
            "location": weather.location,
            "temperature": weather.temperature,
            "humidity": weather.humidity,
            "plan_level": weather.plan_level
        }
    }


@app.post("/api/update-cotation")
async def update_cotation(cotation: CotationUpdate, request: Request):
    """
    💰 Atualizar cotações de mercado
    Requer: Token válido + IP autorizado
    """
    client_ip = get_client_ip(request)
    
    log_action(
        action=f"Atualizou Cotação: {cotation.product}",
        status="OK",
        ip=client_ip,
        details=f"Preço: {cotation.currency} {cotation.price}, Mercado: {cotation.market}"
    )
    
    return {
        "success": True,
        "message": "Cotação atualizada com sucesso",
        "data": {
            "product": cotation.product,
            "price": cotation.price,
            "currency": cotation.currency,
            "market": cotation.market,
            "variation": cotation.variation
        }
    }


@app.post("/api/update-ai-insights")
async def update_ai_insights(request: Request, data: Dict[str, Any]):
    """
    🤖 Atualizar insights da IA
    Requer: Token válido + IP autorizado
    """
    client_ip = get_client_ip(request)
    
    log_action(
        action="Atualizou Insights da IA",
        status="OK",
        ip=client_ip,
        details=f"Tipo: {data.get('type', 'geral')}"
    )
    
    return {
        "success": True,
        "message": "Insights atualizados com sucesso",
        "data": data
    }


# ============================================
# ROTAS PROTEGIDAS - LOGS E MONITORAMENTO
# ============================================

@app.get("/api/logs")
async def get_system_logs(request: Request, limit: int = 100, source: str = "memory"):
    """
    📋 Consultar logs do sistema
    Requer: Token válido + IP autorizado
    
    Args:
        limit: Número de logs a retornar (padrão: 100)
        source: "memory" ou "file"
    """
    client_ip = get_client_ip(request)
    
    # Verificar acesso admin
    verify_admin_access(request)
    
    if source == "file":
        logs = get_logs_from_file(limit)
        log_format = "raw"
    else:
        logs = get_logs(limit)
        log_format = "json"
    
    log_action(
        action=f"Consultou Logs ({source})",
        status="OK",
        ip=client_ip,
        details=f"Limite: {limit}"
    )
    
    return {
        "success": True,
        "format": log_format,
        "count": len(logs),
        "logs": logs
    }


@app.get("/api/logs/stats")
async def get_logs_stats(request: Request):
    """
    📊 Estatísticas dos logs
    Requer: Token válido + IP autorizado
    """
    client_ip = get_client_ip(request)
    
    verify_admin_access(request)
    
    stats = get_log_stats()
    
    log_action(
        action="Consultou Estatísticas de Logs",
        status="OK",
        ip=client_ip
    )
    
    return {
        "success": True,
        "stats": stats
    }


@app.delete("/api/logs")
async def delete_logs(request: Request):
    """
    🗑️ Limpar todos os logs
    Requer: Token válido + IP autorizado + Admin
    ATENÇÃO: Ação irreversível!
    """
    client_ip = get_client_ip(request)
    
    verify_admin_access(request)
    
    success = clear_logs()
    
    if success:
        return {
            "success": True,
            "message": "Logs limpos com sucesso"
        }
    else:
        raise HTTPException(
            status_code=500,
            detail={"error": "server_error", "message": "Erro ao limpar logs"}
        )


# ============================================
# ROTAS DE GERENCIAMENTO DE PLANOS
# ============================================

@app.get("/api/plans/check")
async def check_plan_access(request: Request, user_id: str, feature: str):
    """
    🔍 Verificar acesso a feature baseado no plano do usuário
    """
    client_ip = get_client_ip(request)
    
    # Aqui você integraria com o banco de dados do Agroisync
    # para verificar o plano real do usuário
    
    # Mapeamento de features por plano
    plan_features = {
        "gratuito": ["basic_search", "view_products", "view_freights"],
        "pro": ["basic_search", "view_products", "view_freights", "unlimited_posts", "analytics", "api_access"],
        "loja": ["basic_search", "view_products", "view_freights", "unlimited_posts", "analytics", "store_dashboard"],
        "admin": ["all"]
    }
    
    # Simular verificação (substituir por query real ao DB)
    user_plan = "pro"  # Obter do DB
    
    has_access = feature in plan_features.get(user_plan, []) or "all" in plan_features.get(user_plan, [])
    
    log_action(
        action=f"Verificou Acesso: {feature}",
        status="OK" if has_access else "DENIED",
        ip=client_ip,
        details=f"User: {user_id}, Plano: {user_plan}, Feature: {feature}"
    )
    
    return {
        "success": True,
        "user_id": user_id,
        "plan": user_plan,
        "feature": feature,
        "has_access": has_access
    }


# ============================================
# INICIALIZAÇÃO
# ============================================

@app.on_event("startup")
async def startup_event():
    """
    Evento de inicialização do servidor
    """
    print("🚀 Agroisync IA Admin iniciado!")
    print(f"📁 Logs salvos em: {os.path.abspath('ia_actions.log')}")
    print(f"🔐 Token configurado: {'✅ Sim' if os.getenv('IA_SECRET_TOKEN') else '❌ Não'}")
    print(f"🌐 IPs autorizados: {os.getenv('ALLOWED_IPS', 'Nenhum')}")
    
    log_action(
        action="Sistema Iniciado",
        status="OK",
        ip="system",
        details="Backend IA Admin online"
    )


@app.on_event("shutdown")
async def shutdown_event():
    """
    Evento de encerramento do servidor
    """
    log_action(
        action="Sistema Encerrado",
        status="OK",
        ip="system",
        details="Backend IA Admin offline"
    )


# ============================================
# TRATAMENTO DE ERROS GLOBAL
# ============================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """
    Handler global para exceções HTTP
    """
    client_ip = get_client_ip(request)
    
    # Logar erro apenas se for relacionado a segurança
    if exc.status_code in [401, 403]:
        log_action(
            action=f"Acesso negado a {request.url.path}",
            status="BLOCKED",
            ip=client_ip,
            details=f"Status: {exc.status_code}"
        )
    
    return JSONResponse(
        status_code=exc.status_code,
        content=exc.detail if isinstance(exc.detail, dict) else {"error": str(exc.detail)}
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """
    Handler global para exceções gerais
    """
    client_ip = get_client_ip(request)
    
    log_action(
        action=f"Erro interno em {request.url.path}",
        status="ERROR",
        ip=client_ip,
        details=str(exc)
    )
    
    return JSONResponse(
        status_code=500,
        content={
            "error": "server_error",
            "message": "Erro interno do servidor",
            "details": str(exc) if os.getenv('ENVIRONMENT') == 'development' else None
        }
    )


# ============================================
# FUNÇÃO PRINCIPAL
# ============================================

if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv('PORT', 8000))
    host = os.getenv('HOST', '0.0.0.0')
    
    print(f"🚀 Iniciando servidor em http://{host}:{port}")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=os.getenv('ENVIRONMENT') == 'development',
        log_level="info"
    )

