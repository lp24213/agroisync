"""
📝 AGROISYNC IA - Sistema de Logs
Módulo responsável por registrar todas as ações da IA
"""

import os
from datetime import datetime
from typing import List, Dict
from pathlib import Path

# Lista global de logs em memória (últimos 100)
_logs_memory: List[Dict] = []
MAX_LOGS_IN_MEMORY = 100

# Arquivo de logs
LOG_FILE = Path(__file__).parent.parent / 'ia_actions.log'


def log_action(action: str, status: str = "OK", ip: str = "unknown", details: str = "") -> None:
    """
    Registra uma ação da IA nos logs
    
    Args:
        action: Descrição da ação (ex: "Atualizou Clima")
        status: Status da ação (OK, ERROR, BLOCKED, WARNING)
        ip: IP do cliente
        details: Detalhes adicionais (opcional)
    """
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    # Formatar log
    log_entry = f"{timestamp} | {ip:15} | {action:40} | {status:10}"
    if details:
        log_entry += f" | {details}"
    
    # Adicionar à memória
    log_dict = {
        "timestamp": timestamp,
        "ip": ip,
        "action": action,
        "status": status,
        "details": details
    }
    _logs_memory.append(log_dict)
    
    # Manter apenas últimos 100 em memória
    if len(_logs_memory) > MAX_LOGS_IN_MEMORY:
        _logs_memory.pop(0)
    
    # Salvar no arquivo
    try:
        # Criar diretório se não existir
        LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
        
        with open(LOG_FILE, 'a', encoding='utf-8') as f:
            f.write(log_entry + '\n')
    except Exception as e:
        print(f"❌ Erro ao salvar log em arquivo: {e}")


def get_logs(limit: int = 100) -> List[Dict]:
    """
    Retorna os logs mais recentes da memória
    
    Args:
        limit: Número máximo de logs a retornar
        
    Returns:
        Lista de dicionários com logs
    """
    return _logs_memory[-limit:]


def get_logs_from_file(limit: int = 100) -> List[str]:
    """
    Lê os logs do arquivo (últimas N linhas)
    
    Args:
        limit: Número de linhas a retornar
        
    Returns:
        Lista de strings com logs
    """
    try:
        if not LOG_FILE.exists():
            return []
        
        with open(LOG_FILE, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            return [line.strip() for line in lines[-limit:]]
    except Exception as e:
        print(f"❌ Erro ao ler arquivo de log: {e}")
        return []


def clear_logs() -> bool:
    """
    Limpa todos os logs (memória e arquivo)
    ATENÇÃO: Apenas para administradores!
    
    Returns:
        bool: True se sucesso
    """
    global _logs_memory
    
    try:
        # Limpar memória
        _logs_memory = []
        
        # Limpar arquivo
        if LOG_FILE.exists():
            LOG_FILE.unlink()
        
        log_action("Logs limpos", "OK", "system", "Todos os logs foram removidos")
        return True
    except Exception as e:
        print(f"❌ Erro ao limpar logs: {e}")
        return False


def get_log_stats() -> Dict:
    """
    Retorna estatísticas dos logs
    
    Returns:
        Dict com estatísticas (total, OK, ERROR, BLOCKED)
    """
    total = len(_logs_memory)
    ok_count = sum(1 for log in _logs_memory if log['status'] == 'OK')
    error_count = sum(1 for log in _logs_memory if log['status'] == 'ERROR')
    blocked_count = sum(1 for log in _logs_memory if log['status'] == 'BLOCKED')
    
    return {
        "total": total,
        "ok": ok_count,
        "error": error_count,
        "blocked": blocked_count,
        "success_rate": round((ok_count / total * 100) if total > 0 else 0, 2)
    }

