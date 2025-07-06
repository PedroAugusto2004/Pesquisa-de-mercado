const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
// A porta pode ser definida por uma variável de ambiente (para produção) ou 3001 por padrão
const port = process.env.PORT || 3001;

// URL do seu script do Google Apps que você me forneceu
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwu9JnbN3uXlldbk7wNX6qOxpjDBKil87EiSayVMlSxoZMyR6uovzvLPLt2REBjJ0SGzQ/exec';

// === Middlewares ===
// Habilita o CORS para que seu frontend React possa fazer requisições


// === Middlewares ===
// Habilita o CORS para que seu frontend React possa fazer requisições
app.use(cors());
// Habilita o parse do corpo da requisição como JSON
app.use(express.json());

// === Rotas ===

// Rota principal para receber os dados da pesquisa do frontend
app.post('/api/survey', async (req, res) => {
  try {
    console.log('Recebendo dados da pesquisa:', req.body);

    // Encaminha a requisição POST com os dados para o Google Apps Script
    const response = await axios.post(GOOGLE_SCRIPT_URL, req.body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Resposta do Google Script:', response.data);

    // Retorna a resposta do Google Script para o frontend
    res.status(200).json(response.data);

  } catch (error) {
    console.error('Erro ao encaminhar para o Google Script:', error.message);
    res.status(500).json({ result: 'error', message: 'Falha ao comunicar com o Google Sheets.' });
  }
});

// Rota de "health check" para verificar se o servidor está no ar
app.get('/', (req, res) => {
  res.send('Servidor da Pesquisa de Mercado está funcionando!');
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor backend rodando em http://localhost:${port}`);
});
