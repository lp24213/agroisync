const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;

// Health check endpoint for Railway
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.get("/", (req, res) => {
  res.send("Backend AGROTM online e operando.");
});

// API endpoints
app.get("/api/contact", (req, res) => {
  res.json({
    email: "contato@agrotm.com.br",
    telefone: "+55 (66) 99236-2830",
    horario: "Seg-Sex 9h-18h"
  });
});

app.get("/api/v1/status", (req, res) => {
  res.json({
    status: "OK",
    message: "AGROTM Backend API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
  console.log(`📊 Health Check: http://localhost:${PORT}/health`);
}); 