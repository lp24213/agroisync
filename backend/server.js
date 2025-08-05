const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;

app.get("/health", (req, res) => {
  res.status(200).send("✅ Backend AGROTM funcionando com sucesso!");
});

app.get("/", (req, res) => {
  res.send("Backend AGROTM online e operando.");
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
}); 