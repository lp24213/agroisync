// Sistema de Rastreamento em Tempo Real - AgroSync

import { getDb } from './cloudflare-worker.js';

// Registrar localização GPS do frete
export async function handleTrackingLocation(request, env, user) {
  try {
    const { freight_order_id, latitude, longitude, address, city, state, speed, heading, accuracy } = await request.json();
    
    if (!freight_order_id || !latitude || !longitude) {
      return Response.json({ success: false, error: 'Dados incompletos' }, { status: 400 });
    }
    
    const db = getDb(env);
    const locationId = crypto.randomUUID();
    const timestamp = Date.now();
    
    await db.prepare(
      `INSERT INTO freight_tracking_locations (id, freight_order_id, latitude, longitude, address, city, state, timestamp, speed, heading, accuracy, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, strftime('%s', 'now'))`
    ).bind(
      locationId,
      freight_order_id,
      latitude,
      longitude,
      address,
      city,
      state,
      timestamp,
      speed || null,
      heading || null,
      accuracy || null
    ).run();
    
    // Enviar notificação se mudou de cidade
    await sendLocationUpdateEmail(env, freight_order_id, city, state);
    
    return Response.json({
      success: true,
      data: { id: locationId, timestamp }
    });
  } catch (error) {
    console.error('Tracking location error:', error);
    return Response.json({ success: false, error: 'Erro ao registrar localização' }, { status: 500 });
  }
}

// Atualizar status do frete
export async function handleTrackingUpdate(request, env, user) {
  try {
    const { freight_order_id, status, description, location_id } = await request.json();
    
    if (!freight_order_id || !status) {
      return Response.json({ success: false, error: 'Dados incompletos' }, { status: 400 });
    }
    
    const db = getDb(env);
    const updateId = crypto.randomUUID();
    const timestamp = Date.now();
    
    await db.prepare(
      `INSERT INTO freight_tracking_updates (id, freight_order_id, status, description, location_id, timestamp, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, strftime('%s', 'now'))`
    ).bind(
      updateId,
      freight_order_id,
      status,
      description || null,
      location_id || null,
      timestamp
    ).run();
    
    // Atualizar status do pedido
    await db.prepare(
      `UPDATE freight_orders SET status = ?, updated_at = strftime('%s', 'now') WHERE id = ?`
    ).bind(status, freight_order_id).run();
    
    // Enviar email de atualização
    await sendStatusUpdateEmail(env, freight_order_id, status, description);
    
    return Response.json({
      success: true,
      data: { id: updateId, timestamp }
    });
  } catch (error) {
    console.error('Tracking update error:', error);
    return Response.json({ success: false, error: 'Erro ao atualizar status' }, { status: 500 });
  }
}

// Buscar histórico de rastreamento
export async function handleTrackingHistory(request, env) {
  try {
    const url = new URL(request.url);
    const freight_order_id = url.pathname.split('/').pop();
    
    if (!freight_order_id) {
      return Response.json({ success: false, error: 'ID do pedido não fornecido' }, { status: 400 });
    }
    
    const db = getDb(env);
    
    // Buscar localizações
    const locations = await db.prepare(
      `SELECT * FROM freight_tracking_locations WHERE freight_order_id = ? ORDER BY timestamp DESC LIMIT 100`
    ).bind(freight_order_id).all();
    
    // Buscar atualizações
    const updates = await db.prepare(
      `SELECT * FROM freight_tracking_updates WHERE freight_order_id = ? ORDER BY timestamp DESC LIMIT 50`
    ).bind(freight_order_id).all();
    
    // Buscar última localização
    const currentLocation = locations.results && locations.results.length > 0 
      ? locations.results[0] 
      : null;
    
    return Response.json({
      success: true,
      data: {
        freight_order_id,
        current_location: currentLocation,
        locations: locations.results || [],
        updates: updates.results || []
      }
    });
  } catch (error) {
    console.error('Tracking history error:', error);
    return Response.json({ success: false, error: 'Erro ao buscar histórico' }, { status: 500 });
  }
}

// Enviar email de atualização de localização
async function sendLocationUpdateEmail(env, freight_order_id, city, state) {
  try {
    const db = getDb(env);
    
    // Buscar email do cliente que contratou o frete
    const order = await db.prepare(
      `SELECT fo.id, fo.user_id, u.email, u.name 
       FROM freight_orders fo 
       JOIN users u ON fo.user_id = u.id 
       WHERE fo.id = ?`
    ).bind(freight_order_id).first();
    
    if (!order || !order.email) {
      return;
    }
    
    const notificationId = crypto.randomUUID();
    
    // Salvar notificação
    await db.prepare(
      `INSERT INTO freight_tracking_notifications (id, freight_order_id, recipient_email, notification_type, status, created_at) 
       VALUES (?, ?, ?, 'location_update', 'pending', strftime('%s', 'now'))`
    ).bind(notificationId, freight_order_id, order.email).run();
    
    // Enviar email via Resend
    if (env.RESEND_API_KEY && env.RESEND_ENABLED === 'true') {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: env.RESEND_FROM_EMAIL || 'AgroSync <contato@agroisync.com>',
          to: order.email,
          subject: `🚛 Atualização de Rastreamento - Frete #${freight_order_id.substring(0, 8)}`,
          html: `
            <h2>Olá ${order.name},</h2>
            <p>Seu frete foi atualizado!</p>
            <p><strong>Localização Atual:</strong> ${city}, ${state}</p>
            <p><strong>Código de Rastreamento:</strong> ${freight_order_id}</p>
            <p>Acompanhe em tempo real em: <a href="https://agroisync.com/frete/tracking?code=${freight_order_id}">https://agroisync.com/frete/tracking?code=${freight_order_id}</a></p>
            <br>
            <p>Atenciosamente,<br>Equipe AgroSync</p>
          `
        })
      });
      
      if (response.ok) {
        await db.prepare(
          `UPDATE freight_tracking_notifications SET status = 'sent', sent_at = strftime('%s', 'now') WHERE id = ?`
        ).bind(notificationId).run();
      } else {
        const error = await response.text();
        await db.prepare(
          `UPDATE freight_tracking_notifications SET status = 'error', error_message = ? WHERE id = ?`
        ).bind(error, notificationId).run();
      }
    }
  } catch (error) {
    console.error('Send location email error:', error);
  }
}

// Enviar email de atualização de status
async function sendStatusUpdateEmail(env, freight_order_id, status, description) {
  try {
    const db = getDb(env);
    
    const order = await db.prepare(
      `SELECT fo.id, fo.user_id, u.email, u.name 
       FROM freight_orders fo 
       JOIN users u ON fo.user_id = u.id 
       WHERE fo.id = ?`
    ).bind(freight_order_id).first();
    
    if (!order || !order.email) {
      return;
    }
    
    const statusLabels = {
      'pending': 'Pendente',
      'confirmed': 'Confirmado',
      'in_transit': 'Em Trânsito',
      'delivered': 'Entregue',
      'cancelled': 'Cancelado'
    };
    
    const notificationId = crypto.randomUUID();
    
    await db.prepare(
      `INSERT INTO freight_tracking_notifications (id, freight_order_id, recipient_email, notification_type, status, created_at) 
       VALUES (?, ?, ?, 'status_update', 'pending', strftime('%s', 'now'))`
    ).bind(notificationId, freight_order_id, order.email).run();
    
    if (env.RESEND_API_KEY && env.RESEND_ENABLED === 'true') {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: env.RESEND_FROM_EMAIL || 'AgroSync <contato@agroisync.com>',
          to: order.email,
          subject: `📦 Status Atualizado - ${statusLabels[status] || status}`,
          html: `
            <h2>Olá ${order.name},</h2>
            <p>O status do seu frete foi atualizado!</p>
            <p><strong>Novo Status:</strong> ${statusLabels[status] || status}</p>
            ${description ? `<p><strong>Descrição:</strong> ${description}</p>` : ''}
            <p><strong>Código de Rastreamento:</strong> ${freight_order_id}</p>
            <p>Acompanhe em tempo real em: <a href="https://agroisync.com/frete/tracking?code=${freight_order_id}">Rastrear Pedido</a></p>
            <br>
            <p>Atenciosamente,<br>Equipe AgroSync</p>
          `
        })
      });
      
      if (response.ok) {
        await db.prepare(
          `UPDATE freight_tracking_notifications SET status = 'sent', sent_at = strftime('%s', 'now') WHERE id = ?`
        ).bind(notificationId).run();
      }
    }
  } catch (error) {
    console.error('Send status email error:', error);
  }
}

export { sendLocationUpdateEmail, sendStatusUpdateEmail };

