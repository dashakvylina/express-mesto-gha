const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const CardRouter = require('./routes/cards');
const UserRouter = require('./routes/users');
const { NOT_FOUND_ERROR_CODE } = require('./routes/codes');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '63779f810ee7424c22d179fa'
  };
  next();
});

app.use('/', CardRouter);
app.use('/', UserRouter);

app.get('*', function (req, res) {
  res.status(NOT_FOUND_ERROR_CODE).json({ message: "Такой страницы не существует!" });
});

app.listen(PORT, () => {
  console.log('Server is running');
});
