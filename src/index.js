const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const generatedToken = require('./utils/createToken');
const validateLogin = require('./middlewares/validateLogin');
const validatePassword = require('./middlewares/validatePassword'); 
const authorization = require('./middlewares/auth');
const validateName = require('./middlewares/validateName');
const validateAge = require('./middlewares/validateAge');
const validateTalk = require('./middlewares/validateTalk');
const validateWatchedAt = require('./middlewares/validateWatchedAt');
const validateRate = require('./middlewares/validateRate');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const HTTP_CREATED_STATUS = 201;
const HTTP_BAD_REQUEST = 404;
const HTTP_DELETE = 204;
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

// Req. 8
app.get('/talker/search', authorization, async (req, res) => {
  const { q } = req.query;
  const talkersData = await fs.readFile(TALKER_PATH, 'utf-8');
  const talkers = JSON.parse(talkersData);
  const talkersF = talkers.filter((talker) => talker.name.includes(q));
  if (!q) {
    return res.status(HTTP_OK_STATUS).json(talkers);
  }
  if (talkersF === 0) {
    return res.status(HTTP_OK_STATUS).json([]);
  }
  res.status(HTTP_OK_STATUS).json(talkersF);
});

// Req. 2
app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkersData = await fs.readFile(TALKER_PATH, 'utf-8');
  const talkers = JSON.parse(talkersData);
  const talkerF = talkers.find((talker) => talker.id === parseInt(id, 10));
  if (!talkerF) {
    return res.status(HTTP_BAD_REQUEST).send({ message: 'Pessoa palestrante não encontrada' });
  }
  res.status(HTTP_OK_STATUS).json(talkerF);
});

// Req. 3 e 4
app.post('/login', validateLogin, validatePassword, (_req, res) => {
  const token = generatedToken();
  res.status(HTTP_OK_STATUS).json({ token });
});

// Req. 5
app.post('/talker',
  authorization,
  validateName,
  validateAge,
  validateTalk,
  validateRate,
  validateWatchedAt, async (req, res) => {
    const talkersData = await fs.readFile(TALKER_PATH, 'utf-8');
    const talkersList = JSON.parse(talkersData);
    const { name, age, talk } = req.body;
    const newTalker = { id: talkersList.length + 1, name, age, talk };
    talkersList.push(newTalker);
    await fs.writeFile(TALKER_PATH, JSON.stringify(talkersList));
    res.status(HTTP_CREATED_STATUS).json(newTalker);
  });

// Req. 6
app.put('/talker/:id',
  authorization,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate,
  async (req, res) => {
    const { id } = req.params;
    const { name, age, talk } = req.body;
    const talkersData = await fs.readFile(TALKER_PATH, 'utf-8');
    const talkersList = JSON.parse(talkersData);
    const talkerUpdate = talkersList.find((talker) => talker.id === +id);
    if (!talkerUpdate) {
      return res.status(HTTP_BAD_REQUEST).json({ message: 'Pessoa palestrante não encontrada' });
    }
    talkerUpdate.name = name;
    talkerUpdate.age = age; 
    talkerUpdate.talk = talk;
    const newTalker = JSON.stringify(talkersList);
    await fs.writeFile(TALKER_PATH, newTalker);
    res.status(HTTP_OK_STATUS).json(talkerUpdate);
  });

// Req. 7
app.delete('/talker/:id', authorization, async (req, res) => {
  const { id } = req.params;
  const talkersData = await fs.readFile(TALKER_PATH, 'utf-8');
  const talkerPosition = JSON.parse(talkersData);
  talkerPosition.findIndex((talker) => talker.id === +id);
  talkerPosition.splice(talkerPosition, 1);
  const restOfTalkers = JSON.stringify(talkersData);
  await fs.writeFile(TALKER_PATH, restOfTalkers);
  res.status(HTTP_DELETE).end();
});

app.listen(PORT, () => {
  console.log('Online');
});
