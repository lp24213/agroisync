const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Manter até 10 conexões
      serverSelectionTimeoutMS: 5000, // Manter tentando enviar operações por 5 segundos
      socketTimeoutMS: 45000, // Fechar sockets após 45 segundos de inatividade
      bufferMaxEntries: 0, // Desabilitar mongoose buffering
      bufferCommands: false, // Desabilitar mongoose buffering
    });

    logger.info(`MongoDB conectado: ${conn.connection.host}`);

    // Eventos de conexão
    mongoose.connection.on('connected', () => {
      logger.info('Mongoose conectado ao MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('Erro na conexão MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose desconectado do MongoDB');
    });

    // Fechar conexão quando a aplicação for encerrada
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('Conexão MongoDB fechada devido ao encerramento da aplicação');
      process.exit(0);
    });

  } catch (error) {
    logger.error('Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;