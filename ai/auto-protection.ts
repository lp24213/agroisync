/** 
  * Proteção Inteligente para Transações Web3 - AgroTM 
  * - Valida endereço, valor, blacklist, padrões anômalos, gas price e loga tudo. 
  * - Modular, pronto para integração com plugins IA e logs externos (SIEM). 
  */ 
 
 import { isBlacklisted, logSecurityEvent } from "../services/security"; 
 import { getCurrentGasPrice } from "../services/web3-utils"; 
 import { getUserLimits } from "../services/user-profile"; 
 
 /** 
  * Analisa uma transação Web3 para bloquear ataques, scams ou fraude. 
  * @param tx Objeto da transação 
  * @param userAddress Endereço do usuário 
  * @returns boolean aprovado/bloqueado 
  */ 
 export async function isTransactionSafe(tx: any, userAddress: string): Promise<boolean> { 
   // 1. Endereço destino em blacklist 
   if (await isBlacklisted(tx.to)) { 
     await logSecurityEvent("block", "Endereço em blacklist", { tx, userAddress }); 
     return false; 
   } 
 
   // 2. Valor máximo dinâmico do usuário 
   const { maxTxValue } = await getUserLimits(userAddress); 
   if (tx.value > maxTxValue) { 
     await logSecurityEvent("block", "Acima do limite por usuário", { tx, userAddress }); 
     return false; 
   } 
 
   // 3. Horário atípico 
   const hour = new Date().getUTCHours(); 
   if (hour < 5 || hour > 23) { 
     await logSecurityEvent("warn", "Horário de operação fora do padrão", { tx, userAddress }); 
     // Não bloqueia, mas alerta para monitoramento 
   } 
 
   // 4. Gas Price 
   const chainGas = await getCurrentGasPrice(); 
   if (tx.gasPrice > chainGas * 2) { 
     await logSecurityEvent("block", "Gas Price anormal", { tx, userAddress }); 
     return false; 
   } 
 
   // 5. [Fácil acoplar plugin IA de scoring] 
   // Exemplo: if (!(await checkWithAIScorer(tx, userAddress))) return false; 
 
   await logSecurityEvent("allow", "Transação aprovada", { tx, userAddress }); 
   return true; 
 }