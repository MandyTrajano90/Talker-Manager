const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const HTTP_BAD_REQUEST = 404;
const PORT = process.env.PORT || '3001';
const TALKER_PATH = path.join(__dirname, 'talker.json');

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});


// Req. 1
app.get('/talker', async (_req, res) => {
  const talkersData = await fs.readFile(TALKER_PATH, 'utf-8');
  const talkers = JSON.parse(talkersData);
  if (!talkers) {
    return res.status(200).send([]);
  }
  res.status(HTTP_OK_STATUS).send(talkers);
});

// Req. 2
app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkersData = await fs.readFile(TALKER_PATH, 'utf-8');
  const talkers = JSON.parse(talkersData);
  const talker = talkers.find((talker) => talker.id === parseInt(id, 10));
  if (!talker) {
    return res.status(HTTP_BAD_REQUEST).send({ message: 'Pessoa palestrante não encontrada' });
  }
  res.status(HTTP_OK_STATUS).send(talker);
});

app.listen(PORT, () => {
  console.log('Online');
});
