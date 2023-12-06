const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => {
  const talkersData = await fs.readFile(path.join(__dirname, 'talker.json'), 'utf-8');
  const talkers = JSON.parse(talkersData);
  if (!talkers) {
    return res.status(200).send([]);
  }
  res.status(200).send(talkers);
});

app.listen(PORT, () => {
  console.log('Online');
});
