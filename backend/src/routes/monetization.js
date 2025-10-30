// 💰 ROTAS DE MONETIZAÇÃO - AGROISYNC
// Sistema de anúncios, patrocínios, taxas e métricas

/**
 * Registrar rotas de monetização no Cloudflare Worker
 */

// ================================================================
// HANDLERS DE ANÚNCIOS
// ================================================================

async function handleCreateAd(request, env) {
  try {
    const MonetizationService = require('../services/monetizationService');
    const monetization = new MonetizationService(env.DB);
    
    const data = await request.json();
    
    // Validação
    if (!data.title || !data.placement || !data.start_date || !data.end_date || !data.price) {
      return jsonResponse({ 
        success: false, 
        error: 'Campos obrigatórios: title, placement, start_date, end_date, price' 
      }, 400);
    }
    
    const result = await monetization.createAdvertisement(data);
    return jsonResponse(result);
  } catch (error) {
    console.error('Error creating ad:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

async function handleGetAds(request, env) {
  try {
    const MonetizationService = require('../services/monetizationService');
    const monetization = new MonetizationService(env.DB);
    
    const url = new URL(request.url);
    const placement = url.searchParams.get('placement');
    
    const ads = await monetization.getActiveAdvertisements(placement);
    return jsonResponse({ success: true, data: ads, count: ads.length });
  } catch (error) {
    console.error('Error fetching ads:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

async function handleTrackImpression(request, env) {
  try {
    const MonetizationService = require('../services/monetizationService');
    const monetization = new MonetizationService(env.DB);
    
    const { adId } = await request.json();
    
    if (!adId) {
      return jsonResponse({ success: false, error: 'adId é obrigatório' }, 400);
    }
    
    await monetization.trackImpression(adId);
    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Error tracking impression:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

async function handleTrackClick(request, env) {
  try {
    const MonetizationService = require('../services/monetizationService');
    const monetization = new MonetizationService(env.DB);
    
    const { adId } = await request.json();
    
    if (!adId) {
      return jsonResponse({ success: false, error: 'adId é obrigatório' }, 400);
    }
    
    await monetization.trackClick(adId);
    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Error tracking click:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

// ================================================================
// HANDLERS DE PATROCÍNIOS
// ================================================================

async function handleSponsorItem(request, env) {
  try {
    const MonetizationService = require('../services/monetizationService');
    const monetization = new MonetizationService(env.DB);
    
    const data = await request.json();
    
    // Validação
    if (!data.item_id || !data.item_type || !data.user_id || !data.start_date || !data.end_date || !data.price) {
      return jsonResponse({ 
        success: false, 
        error: 'Campos obrigatórios: item_id, item_type, user_id, start_date, end_date, price' 
      }, 400);
    }
    
    const result = await monetization.sponsorItem(data);
    return jsonResponse(result);
  } catch (error) {
    console.error('Error sponsoring item:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

async function handleGetSponsoredItems(request, env) {
  try {
    const MonetizationService = require('../services/monetizationService');
    const monetization = new MonetizationService(env.DB);
    
    const url = new URL(request.url);
    const itemType = url.searchParams.get('type');
    
    const items = await monetization.getSponsoredItems(itemType);
    return jsonResponse({ success: true, data: items, count: items.length });
  } catch (error) {
    console.error('Error fetching sponsored items:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

// ================================================================
// HANDLERS DE TRANSAÇÕES E COMISSÕES
// ================================================================

async function handleCreateTransaction(request, env) {
  try {
    const MonetizationService = require('../services/monetizationService');
    const monetization = new MonetizationService(env.DB);
    
    const data = await request.json();
    
    // Validação
    if (!data.user_id || !data.amount) {
      return jsonResponse({ 
        success: false, 
        error: 'Campos obrigatórios: user_id, amount' 
      }, 400);
    }
    
    const result = await monetization.createTransaction(data);
    return jsonResponse(result);
  } catch (error) {
    console.error('Error creating transaction:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

async function handleUpdatePaymentStatus(request, env, transactionId) {
  try {
    const MonetizationService = require('../services/monetizationService');
    const monetization = new MonetizationService(env.DB);
    
    const { status, payment_gateway_id } = await request.json();
    
    if (!status) {
      return jsonResponse({ success: false, error: 'status é obrigatório' }, 400);
    }
    
    const result = await monetization.updatePaymentStatus(transactionId, status, payment_gateway_id);
    return jsonResponse(result);
  } catch (error) {
    console.error('Error updating payment status:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

// ================================================================
// HANDLERS DE MÉTRICAS E DASHBOARD
// ================================================================

async function handleGetMonetizationDashboard(request, env) {
  try {
    const MonetizationService = require('../services/monetizationService');
    const monetization = new MonetizationService(env.DB);
    
    const dashboard = await monetization.getMonetizationDashboard();
    return jsonResponse({ success: true, data: dashboard });
  } catch (error) {
    console.error('Error fetching monetization dashboard:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

async function handleGetUserMetrics(request, env, userId) {
  try {
    const MonetizationService = require('../services/monetizationService');
    const monetization = new MonetizationService(env.DB);
    
    const metrics = await monetization.getUserMonetizationMetrics(userId);
    return jsonResponse({ success: true, data: metrics });
  } catch (error) {
    console.error('Error fetching user metrics:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

async function handleGetRevenueSummary(request, env) {
  try {
    const MonetizationService = require('../services/monetizationService');
    const monetization = new MonetizationService(env.DB);
    
    const url = new URL(request.url);
    const startDate = url.searchParams.get('start_date');
    const endDate = url.searchParams.get('end_date');
    
    const summary = await monetization.getRevenueSummary(startDate, endDate);
    return jsonResponse({ success: true, data: summary, count: summary.length });
  } catch (error) {
    console.error('Error fetching revenue summary:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

async function handleGetSettings(request, env) {
  try {
    const MonetizationService = require('../services/monetizationService');
    const monetization = new MonetizationService(env.DB);
    
    const settings = await monetization.getSettings();
    return jsonResponse({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

async function handleUpdateSetting(request, env) {
  try {
    const MonetizationService = require('../services/monetizationService');
    const monetization = new MonetizationService(env.DB);
    
    const { key, value } = await request.json();
    
    if (!key || value === undefined) {
      return jsonResponse({ success: false, error: 'key e value são obrigatórios' }, 400);
    }
    
    const result = await monetization.updateSetting(key, value, request.userId || 'system');
    return jsonResponse(result);
  } catch (error) {
    console.error('Error updating setting:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

// Helper para responses JSON
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Exportar handlers
module.exports = {
  handleCreateAd,
  handleGetAds,
  handleTrackImpression,
  handleTrackClick,
  handleSponsorItem,
  handleGetSponsoredItems,
  handleCreateTransaction,
  handleUpdatePaymentStatus,
  handleGetMonetizationDashboard,
  handleGetUserMetrics,
  handleGetRevenueSummary,
  handleGetSettings,
  handleUpdateSetting
};

