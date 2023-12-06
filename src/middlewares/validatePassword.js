module.exports = (req, res, next) => {
  const { password } = req.body;
  const regexPassword = /^[\w]{6,}$/;
  if (!password) {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
  if (!regexPassword.test(password)) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  next();
};