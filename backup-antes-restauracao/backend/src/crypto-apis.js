// Sistema Completo de Corretora de Criptomoedas - AgroSync

// Carteira do dono para receber comissões
const OWNER_METAMASK_WALLET = '0x5Ea5C5970e8AE23A5336d631707CF31C5916E8b1';
const COMMISSION_PERCENTAGE = 10; // 10% de comissão

// Lista COMPLETA de criptomoedas disponíveis
export const SUPPORTED_CRYPTOS = [
  // Top 50 criptomoedas
  { symbol: 'BTC', name: 'Bitcoin', icon: '₿' },
  { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ' },
  { symbol: 'USDT', name: 'Tether', icon: '₮' },
  { symbol: 'BNB', name: 'Binance Coin', icon: 'BNB' },
  { symbol: 'SOL', name: 'Solana', icon: 'SOL' },
  { symbol: 'XRP', name: 'Ripple', icon: 'XRP' },
  { symbol: 'USDC', name: 'USD Coin', icon: 'USDC' },
  { symbol: 'ADA', name: 'Cardano', icon: 'ADA' },
  { symbol: 'AVAX', name: 'Avalanche', icon: 'AVAX' },
  { symbol: 'DOGE', name: 'Dogecoin', icon: 'Ð' },
  { symbol: 'TRX', name: 'TRON', icon: 'TRX' },
  { symbol: 'DOT', name: 'Polkadot', icon: 'DOT' },
  { symbol: 'MATIC', name: 'Polygon', icon: 'MATIC' },
  { symbol: 'LINK', name: 'Chainlink', icon: 'LINK' },
  { symbol: 'SHIB', name: 'Shiba Inu', icon: 'SHIB' },
  { symbol: 'DAI', name: 'Dai', icon: 'DAI' },
  { symbol: 'UNI', name: 'Uniswap', icon: 'UNI' },
  { symbol: 'LTC', name: 'Litecoin', icon: 'Ł' },
  { symbol: 'BCH', name: 'Bitcoin Cash', icon: 'BCH' },
  { symbol: 'ATOM', name: 'Cosmos', icon: 'ATOM' },
  { symbol: 'XMR', name: 'Monero', icon: 'XMR' },
  { symbol: 'ETC', name: 'Ethereum Classic', icon: 'ETC' },
  { symbol: 'XLM', name: 'Stellar', icon: 'XLM' },
  { symbol: 'FIL', name: 'Filecoin', icon: 'FIL' },
  { symbol: 'AAVE', name: 'Aave', icon: 'AAVE' },
  { symbol: 'ALGO', name: 'Algorand', icon: 'ALGO' },
  { symbol: 'VET', name: 'VeChain', icon: 'VET' },
  { symbol: 'ICP', name: 'Internet Computer', icon: 'ICP' },
  { symbol: 'APT', name: 'Aptos', icon: 'APT' },
  { symbol: 'NEAR', name: 'NEAR Protocol', icon: 'NEAR' }
];

// Cadastrar Carteira
export async function handleWalletRegister(request, env, user) {
  try {
    const { wallet_address, wallet_type } = await request.json();
    
    if (!wallet_address) {
      return Response.json({ success: false, error: 'Endereço da carteira obrigatório' }, { status: 400 });
    }
    
    const db = env.DB || env.AGROISYNC_DB;
    const walletId = crypto.randomUUID();
    
    // Verificar se carteira já existe
    const existing = await db.prepare(
      `SELECT id FROM crypto_wallets WHERE wallet_address = ?`
    ).bind(wallet_address).first();
    
    if (existing) {
      return Response.json({ success: false, error: 'Carteira já cadastrada' }, { status: 400 });
    }
    
    await db.prepare(
      `INSERT INTO crypto_wallets (id, user_id, wallet_address, wallet_type, is_verified, is_active, created_at) 
       VALUES (?, ?, ?, ?, 1, 1, strftime('%s', 'now'))`
    ).bind(walletId, user.userId, wallet_address, wallet_type || 'metamask').run();
    
    return Response.json({
      success: true,
      data: { id: walletId, wallet_address }
    });
  } catch (error) {
    console.error('Wallet register error:', error);
    return Response.json({ success: false, error: 'Erro ao cadastrar carteira' }, { status: 500 });
  }
}

// Comprar Criptomoeda
export async function handleCryptoBuy(request, env, user) {
  try {
    const { crypto_symbol, amount_brl } = await request.json();
    
    if (!crypto_symbol || !amount_brl || amount_brl <= 0) {
      return Response.json({ success: false, error: 'Dados inválidos' }, { status: 400 });
    }
    
    // Buscar preço atual (em produção, usar API real como CoinGecko)
    const currentPrice = await getCurrentCryptoPrice(crypto_symbol);
    
    if (!currentPrice) {
      return Response.json({ success: false, error: 'Criptomoeda não suportada' }, { status: 400 });
    }
    
    // Calcular comissão de 10%
    const totalWithCommission = amount_brl * (1 + COMMISSION_PERCENTAGE / 100);
    const commissionAmount = totalWithCommission - amount_brl;
    const cryptoAmount = amount_brl / currentPrice;
    
    const db = env.DB || env.AGROISYNC_DB;
    const transactionId = crypto.randomUUID();
    const paymentId = crypto.randomUUID();
    
    // Criar transação
    await db.prepare(
      `INSERT INTO crypto_transactions (id, user_id, transaction_type, crypto_symbol, amount, amount_usd, price_at_time, fee_percentage, fee_amount, status, created_at) 
       VALUES (?, ?, 'buy', ?, ?, ?, ?, ?, ?, 'pending', strftime('%s', 'now'))`
    ).bind(
      transactionId,
      user.userId,
      crypto_symbol,
      cryptoAmount,
      amount_brl / 5.5, // Converter BRL para USD (taxa aproximada)
      currentPrice,
      COMMISSION_PERCENTAGE,
      commissionAmount
    ).run();
    
    // Criar pagamento
    await db.prepare(
      `INSERT INTO crypto_payments (id, user_id, transaction_id, crypto_symbol, amount, amount_brl, commission_percentage, commission_amount_brl, net_amount_brl, owner_wallet, status, payment_for, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'crypto_purchase', strftime('%s', 'now'))`
    ).bind(
      paymentId,
      user.userId,
      transactionId,
      crypto_symbol,
      cryptoAmount,
      totalWithCommission,
      COMMISSION_PERCENTAGE,
      commissionAmount,
      amount_brl,
      OWNER_METAMASK_WALLET
    ).run();
    
    // Criar comissão
    const commissionId = crypto.randomUUID();
    await db.prepare(
      `INSERT INTO crypto_commissions (id, payment_id, amount_brl, crypto_symbol, transferred_to_owner, created_at) 
       VALUES (?, ?, ?, ?, 0, strftime('%s', 'now'))`
    ).bind(commissionId, paymentId, commissionAmount, crypto_symbol).run();
    
    return Response.json({
      success: true,
      data: {
        transaction_id: transactionId,
        payment_id: paymentId,
        crypto_amount: cryptoAmount,
        total_brl: totalWithCommission,
        commission_brl: commissionAmount,
        price: currentPrice
      }
    });
  } catch (error) {
    console.error('Crypto buy error:', error);
    return Response.json({ success: false, error: 'Erro ao comprar criptomoeda' }, { status: 500 });
  }
}

// Vender Criptomoeda
export async function handleCryptoSell(request, env, user) {
  try {
    const { crypto_symbol, crypto_amount } = await request.json();
    
    if (!crypto_symbol || !crypto_amount || crypto_amount <= 0) {
      return Response.json({ success: false, error: 'Dados inválidos' }, { status: 400 });
    }
    
    const db = env.DB || env.AGROISYNC_DB;
    
    // Verificar saldo
    const balance = await db.prepare(
      `SELECT balance FROM crypto_balances WHERE user_id = ? AND crypto_symbol = ?`
    ).bind(user.userId, crypto_symbol).first();
    
    if (!balance || balance.balance < crypto_amount) {
      return Response.json({ success: false, error: 'Saldo insuficiente' }, { status: 400 });
    }
    
    const currentPrice = await getCurrentCryptoPrice(crypto_symbol);
    const amountBrl = crypto_amount * currentPrice * 5.5; // Converter USD para BRL
    const commissionAmount = amountBrl * (COMMISSION_PERCENTAGE / 100);
    const netAmount = amountBrl - commissionAmount;
    
    const transactionId = crypto.randomUUID();
    
    await db.prepare(
      `INSERT INTO crypto_transactions (id, user_id, transaction_type, crypto_symbol, amount, amount_usd, price_at_time, fee_percentage, fee_amount, status, created_at) 
       VALUES (?, ?, 'sell', ?, ?, ?, ?, ?, ?, 'pending', strftime('%s', 'now'))`
    ).bind(
      transactionId,
      user.userId,
      crypto_symbol,
      crypto_amount,
      amountBrl / 5.5,
      currentPrice,
      COMMISSION_PERCENTAGE,
      commissionAmount
    ).run();
    
    // Atualizar saldo
    await db.prepare(
      `UPDATE crypto_balances SET balance = balance - ?, balance_usd = balance_usd - ?, last_updated = strftime('%s', 'now') WHERE user_id = ? AND crypto_symbol = ?`
    ).bind(crypto_amount, crypto_amount * currentPrice, user.userId, crypto_symbol).run();
    
    return Response.json({
      success: true,
      data: {
        transaction_id: transactionId,
        crypto_amount: crypto_amount,
        gross_brl: amountBrl,
        commission_brl: commissionAmount,
        net_brl: netAmount,
        price: currentPrice
      }
    });
  } catch (error) {
    console.error('Crypto sell error:', error);
    return Response.json({ success: false, error: 'Erro ao vender criptomoeda' }, { status: 500 });
  }
}

// Buscar Saldos do Usuário
export async function handleCryptoBalances(request, env, user) {
  try {
    const db = env.DB || env.AGROISYNC_DB;
    
    const balances = await db.prepare(
      `SELECT * FROM crypto_balances WHERE user_id = ? ORDER BY balance_usd DESC`
    ).bind(user.userId).all();
    
    return Response.json({
      success: true,
      data: balances.results || []
    });
  } catch (error) {
    console.error('Crypto balances error:', error);
    return Response.json({ success: false, error: 'Erro ao buscar saldos' }, { status: 500 });
  }
}

// Buscar Histórico de Transações
export async function handleCryptoTransactions(request, env, user) {
  try {
    const db = env.DB || env.AGROISYNC_DB;
    
    const transactions = await db.prepare(
      `SELECT * FROM crypto_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 100`
    ).bind(user.userId).all();
    
    return Response.json({
      success: true,
      data: transactions.results || []
    });
  } catch (error) {
    console.error('Crypto transactions error:', error);
    return Response.json({ success: false, error: 'Erro ao buscar transações' }, { status: 500 });
  }
}

// Buscar preço atual (mock - em produção usar CoinGecko ou CoinMarketCap)
async function getCurrentCryptoPrice(symbol) {
  // Preços mock (em produção, buscar de API real)
  const prices = {
    'BTC': 43250.50,
    'ETH': 2650.30,
    'USDT': 1.00,
    'BNB': 310.50,
    'SOL': 98.75,
    'XRP': 0.52,
    'USDC': 1.00,
    'ADA': 0.45,
    'AVAX': 35.20,
    'DOGE': 0.08,
    'TRX': 0.10,
    'DOT': 6.50,
    'MATIC': 0.85,
    'LINK': 14.30,
    'SHIB': 0.000009,
    'DAI': 1.00,
    'UNI': 6.20,
    'LTC': 72.50,
    'BCH': 245.80,
    'ATOM': 9.75,
    'XMR': 158.90,
    'ETC': 20.15,
    'XLM': 0.13,
    'FIL': 4.85,
    'AAVE': 95.40,
    'ALGO': 0.18,
    'VET': 0.025,
    'ICP': 4.50,
    'APT': 8.30,
    'NEAR': 2.15
  };
  
  return prices[symbol] || null;
}

export { OWNER_METAMASK_WALLET, COMMISSION_PERCENTAGE, getCurrentCryptoPrice };

