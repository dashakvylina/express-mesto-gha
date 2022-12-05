const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const CardRouter = require('./routes/cards');
const UserRouter = require('./routes/users');
const { NOT_FOUND_ERROR_CODE } = require('./constants');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '638e5d07bcebfe0ec332dba0',
  };
  next();
});

app.use('/', CardRouter);
app.use('/', UserRouter);

app.use((req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).json({
    message: 'Такой страницы не существует!',
  });
});

app.listen(PORT, () => {
  console.log('Server is running');
});
