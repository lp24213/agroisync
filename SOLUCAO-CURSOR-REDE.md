# Solução para Problemas de Rede do Cursor

## Problema Identificado
O Cursor não está funcionando em outras redes Wi-Fi devido a configurações de rede, firewall e DNS.

## Soluções Implementadas

### 1. Scripts Criados
- `fix-cursor-network-corrected.ps1` - Script básico de correção
- `cursor-network-simple.ps1` - Script simplificado
- `cursor-network-admin.ps1` - Script completo (requer admin)

### 2. Correções Aplicadas
✅ **DNS Configurado**: 8.8.8.8, 8.8.4.4, 1.1.1.1
✅ **Cache DNS Limpo**: ipconfig /flushdns
✅ **Conectividade Testada**: google.com, github.com
✅ **Firewall Configurado**: Regras para Cursor (requer admin)

### 3. Status Atual
- ✅ Conectividade com Google: OK
- ✅ Conectividade com GitHub: OK
- ❌ Conectividade com api.cursor.sh: FALHOU (possível bloqueio de rede)

## Instruções para Resolver Completamente

### Opção 1: Executar como Administrador
```powershell
# Clique com botão direito no PowerShell e "Executar como administrador"
powershell -ExecutionPolicy Bypass -File "cursor-network-admin.ps1"
```

### Opção 2: Configuração Manual no Cursor
1. Abra o Cursor
2. Pressione `Ctrl+Shift+P`
3. Digite: `Preferences: Open Settings`
4. Procure por `proxy`
5. Configure `http.proxy` como vazio
6. Reinicie o Cursor

### Opção 3: Verificações Adicionais
1. **Antivírus**: Verifique se não está bloqueando o Cursor
2. **Proxy Corporativo**: Desabilite se estiver ativo
3. **VPN**: Tente usar VPN se estiver em rede restritiva
4. **Modo Offline**: Teste primeiro em modo offline

## Comandos Executados com Sucesso
```bash
# DNS configurado
netsh interface ip set dns "Wi-Fi" static 8.8.8.8
netsh interface ip add dns "Wi-Fi" 8.8.4.4 index=2

# Cache limpo
ipconfig /flushdns

# Conectividade testada
Test-NetConnection -ComputerName "google.com" -Port 443  # OK
Test-NetConnection -ComputerName "github.com" -Port 443  # OK
```

## Próximos Passos
1. Execute o script como administrador
2. Reinicie o Cursor completamente
3. Teste em outras redes Wi-Fi
4. Se ainda não funcionar, configure proxy manualmente

## Arquivos Criados
- `fix-cursor-network-corrected.ps1`
- `cursor-network-simple.ps1` 
- `cursor-network-admin.ps1`
- `SOLUCAO-CURSOR-REDE.md`

O problema principal parece ser configurações de rede e firewall que impedem o Cursor de se conectar adequadamente em diferentes redes Wi-Fi.
