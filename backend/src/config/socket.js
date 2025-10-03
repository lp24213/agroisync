import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { createSecurityLog } from '../utils/securityLogger.js';

import logger from '../utils/logger.js';
export const configureSocket = server => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  // Middleware de autenticaÃ§Ã£o para WebSocket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization;

      if (!token) {
        return next(new Error('Token de autenticaÃ§Ã£o nÃ£o fornecido'));
      }

      // Remover 'Bearer ' se presente
      const cleanToken = token.replace('Bearer ', '');

      const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select(
        '_id name email company.name isAdmin'
      );

      if (!user) {
        return next(new Error('UsuÃ¡rio nÃ£o encontrado'));
      }

      socket.userId = user._id.toString();
      socket.user = user;

      // Log de conexÃ£o
      await createSecurityLog({
        eventType: 'websocket_connection',
        severity: 'info',
        userId: user._id,
        ipAddress: socket.handshake.address,
        userAgent: socket.handshake.headers['user-agent'],
        description: `WebSocket conectado para usuÃ¡rio ${user.email}`,
        details: {
          socketId: socket.id,
          transport: socket.conn.transport.name
        }
      });

      next();
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Erro na autenticaÃ§Ã£o WebSocket:', error.message);
      }
      next(new Error('AutenticaÃ§Ã£o falhou'));
    }
  });

  // Gerenciamento de conexÃµes
  const connectedUsers = new Map();

  io.on('connection', socket => {
    if (process.env.NODE_ENV !== 'production') {
      // Console log removido`);
    }
    // Adicionar usuÃ¡rio Ã  lista de conectados
    connectedUsers.set(socket.userId, {
      socketId: socket.id,
      user: socket.user,
      connectedAt: new Date()
    });

    // Juntar usuÃ¡rio Ã  sala pessoal
    socket.join(`user_${socket.userId}`);

    // Juntar usuÃ¡rio Ã  sala de notificaÃ§Ãµes se for admin
    if (socket.user.isAdmin) {
      socket.join('admin_notifications');
    }

    // Evento de mensagem privada
    socket.on('send_private_message', async data => {
      try {
        const { receiverId, content, subject, messageType, relatedProduct, relatedFreight } = data;

        // Validar dados
        if (!receiverId || !content || !subject) {
          socket.emit('message_error', { message: 'Dados invÃ¡lidos para mensagem' });
          return;
        }

        // Verificar se o destinatÃ¡rio estÃ¡ online
        const receiverSocket = connectedUsers.get(receiverId);

        // Emitir mensagem para o destinatÃ¡rio se estiver online
        if (receiverSocket) {
          io.to(receiverSocket.socketId).emit('new_private_message', {
            senderId: socket.userId,
            senderName: socket.user.name,
            senderCompany: socket.user.company?.name,
            content,
            subject,
            messageType,
            relatedProduct,
            relatedFreight,
            timestamp: new Date()
          });
        }

        // Confirmar envio para o remetente
        socket.emit('message_sent', {
          success: true,
          message: 'Mensagem enviada com sucesso',
          timestamp: new Date()
        });

        // Log de mensagem enviada
        await createSecurityLog({
          eventType: 'websocket_message_sent',
          severity: 'info',
          userId: socket.userId,
          ipAddress: socket.handshake.address,
          description: 'Mensagem privada enviada via WebSocket',
          details: {
            receiverId,
            messageType,
            socketId: socket.id
          }
        });
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          logger.error('Erro ao enviar mensagem via WebSocket:', error);
        }
        socket.emit('message_error', { message: 'Erro interno do servidor' });
      }
    });

    // Evento de digitaÃ§Ã£o
    socket.on('typing_start', data => {
      const { receiverId } = data;
      const receiverSocket = connectedUsers.get(receiverId);

      if (receiverSocket) {
        io.to(receiverSocket.socketId).emit('user_typing', {
          userId: socket.userId,
          userName: socket.user.name
        });
      }
    });

    socket.on('typing_stop', data => {
      const { receiverId } = data;
      const receiverSocket = connectedUsers.get(receiverId);

      if (receiverSocket) {
        io.to(receiverSocket.socketId).emit('user_stopped_typing', {
          userId: socket.userId
        });
      }
    });

    // Evento de leitura de mensagem
    socket.on('mark_message_read', async data => {
      try {
        const { messageId, senderId } = data;

        // Notificar o remetente que a mensagem foi lida
        const senderSocket = connectedUsers.get(senderId);
        if (senderSocket) {
          io.to(senderSocket.socketId).emit('message_read', {
            messageId,
            readBy: socket.userId,
            readAt: new Date()
          });
        }

        // Log de leitura
        await createSecurityLog({
          eventType: 'websocket_message_read',
          severity: 'info',
          userId: socket.userId,
          description: 'Mensagem marcada como lida via WebSocket',
          details: {
            messageId,
            senderId
          }
        });
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          logger.error('Erro ao marcar mensagem como lida:', error);
        }
      }
    });

    // Evento de presenÃ§a online
    socket.on('update_presence', data => {
      const { status, customStatus } = data;

      if (connectedUsers.has(socket.userId)) {
        const userData = connectedUsers.get(socket.userId);
        userData.status = status;
        userData.customStatus = customStatus;
        userData.lastSeen = new Date();

        // Notificar outros usuÃ¡rios sobre mudanÃ§a de status
        socket.broadcast.emit('user_presence_changed', {
          userId: socket.userId,
          status,
          customStatus,
          lastSeen: new Date()
        });
      }
    });

    // Evento de desconexÃ£o
    socket.on('disconnect', async () => {
      if (process.env.NODE_ENV !== 'production') {
        // Console log removido`);
      }
      // Remover usuÃ¡rio da lista de conectados
      connectedUsers.delete(socket.userId);

      // Notificar outros usuÃ¡rios sobre a desconexÃ£o
      socket.broadcast.emit('user_disconnected', {
        userId: socket.userId,
        userName: socket.user.name,
        disconnectedAt: new Date()
      });

      // Log de desconexÃ£o
      await createSecurityLog({
        eventType: 'websocket_disconnection',
        severity: 'info',
        userId: socket.userId,
        ipAddress: socket.handshake.address,
        description: 'WebSocket desconectado',
        details: {
          socketId: socket.id,
          connectedUsersCount: connectedUsers.size
        }
      });
    });

    // Evento de erro
    socket.on('error', async error => {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Erro no WebSocket:', error);
      }
      await createSecurityLog({
        eventType: 'websocket_error',
        severity: 'error',
        userId: socket.userId,
        ipAddress: socket.handshake.address,
        description: 'Erro no WebSocket',
        details: {
          error: error.message,
          socketId: socket.id
        }
      });
    });
  });

  // FunÃ§Ãµes auxiliares para uso em outras partes da aplicaÃ§Ã£o
  const socketService = {
    // Enviar notificaÃ§Ã£o para usuÃ¡rio especÃ­fico
    sendToUser: (userId, event, data) => {
      const userSocket = connectedUsers.get(userId);
      if (userSocket) {
        io.to(userSocket.socketId).emit(event, data);
        return true;
      }
      return false;
    },

    // Enviar notificaÃ§Ã£o para todos os usuÃ¡rios
    sendToAll: (event, data) => {
      io.emit(event, data);
    },

    // Enviar notificaÃ§Ã£o para admins
    sendToAdmins: (event, data) => {
      io.to('admin_notifications').emit(event, data);
    },

    // Verificar se usuÃ¡rio estÃ¡ online
    isUserOnline: userId => {
      return connectedUsers.has(userId);
    },

    // Obter informaÃ§Ãµes de usuÃ¡rios conectados
    getConnectedUsers: () => {
      return Array.from(connectedUsers.values());
    },

    // Obter contagem de usuÃ¡rios conectados
    getConnectedUsersCount: () => {
      return connectedUsers.size;
    }
  };

  return { io, socketService };
};
