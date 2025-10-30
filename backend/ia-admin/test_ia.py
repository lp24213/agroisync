"""
🧪 AGROISYNC IA - Script de Teste
Teste das funcionalidades do backend de IA
"""

import requests
import os
from dotenv import load_dotenv

load_dotenv()

# Configurações
BASE_URL = "http://localhost:8000"
TOKEN = os.getenv('IA_SECRET_TOKEN', 'super_chave_aleatoria_grande_e_segura_aqui')

headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}


def test_health():
    """Teste de health check (público)"""
    print("\n🏥 Testando Health Check...")
    response = requests.get(f"{BASE_URL}/api/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")


def test_update_news():
    """Teste de atualização de notícias"""
    print("\n📰 Testando Atualização de Notícias...")
    
    data = {
        "title": "Safra de Soja Recorde em 2025",
        "content": "A safra de soja brasileira deve atingir números recordes...",
        "category": "mercado",
        "plan_level": "publico"
    }
    
    response = requests.post(
        f"{BASE_URL}/api/update-news",
        headers=headers,
        json=data
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")


def test_update_weather():
    """Teste de atualização de clima"""
    print("\n🌤️ Testando Atualização de Clima...")
    
    data = {
        "location": "São Paulo - SP",
        "temperature": 28.5,
        "humidity": 65,
        "description": "Parcialmente nublado",
        "forecast": "Chuva à tarde",
        "plan_level": "publico"
    }
    
    response = requests.post(
        f"{BASE_URL}/api/update-weather",
        headers=headers,
        json=data
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")


def test_update_cotation():
    """Teste de atualização de cotações"""
    print("\n💰 Testando Atualização de Cotações...")
    
    data = {
        "product": "Soja",
        "price": 145.50,
        "currency": "BRL",
        "market": "B3",
        "variation": 2.3,
        "plan_level": "privado"
    }
    
    response = requests.post(
        f"{BASE_URL}/api/update-cotation",
        headers=headers,
        json=data
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")


def test_get_logs():
    """Teste de consulta de logs"""
    print("\n📋 Testando Consulta de Logs...")
    
    response = requests.get(
        f"{BASE_URL}/api/logs?limit=10",
        headers=headers
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")


def test_get_logs_stats():
    """Teste de estatísticas de logs"""
    print("\n📊 Testando Estatísticas de Logs...")
    
    response = requests.get(
        f"{BASE_URL}/api/logs/stats",
        headers=headers
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")


def test_unauthorized():
    """Teste de acesso não autorizado"""
    print("\n🚫 Testando Acesso Não Autorizado...")
    
    bad_headers = {
        "Authorization": "Bearer token_invalido",
        "Content-Type": "application/json"
    }
    
    response = requests.post(
        f"{BASE_URL}/api/update-news",
        headers=bad_headers,
        json={"title": "teste", "content": "teste"}
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")


if __name__ == "__main__":
    print("=" * 60)
    print("🧪 AGROISYNC IA - TESTES AUTOMATIZADOS")
    print("=" * 60)
    
    try:
        test_health()
        test_update_news()
        test_update_weather()
        test_update_cotation()
        test_get_logs()
        test_get_logs_stats()
        test_unauthorized()
        
        print("\n" + "=" * 60)
        print("✅ TODOS OS TESTES CONCLUÍDOS!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Erro nos testes: {e}")

