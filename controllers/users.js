const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { OK_CODE } = require('../constants');
const {
  BadRequestError,
  DefaultError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
} = require('../errors');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(OK_CODE).json(users);
  } catch (error) {
    next(new DefaultError('Unknown error'));
  }
};

const getMe = async (req, res, next) => {
  try {
    const { user } = req;
    const result = await User.findById(user._id);
    if (result === null) {
      throw new NotFoundError('user not found');
    } else {
      res.status(OK_CODE).json(result);
    }
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError('Unknown error'));
    } else {
      next(new DefaultError('Unknown error'));
    }
  }
};

const createUser = async (req, res, next) => {
  try {
    const { body } = req;
    const {
      email, name, about,
    } = body;
    const hash = await bcrypt.hash(body.password, 10);
    const newUser = new User({
      email, password: hash, name, about,
    });
    await newUser.save();

    const { password, ...data } = newUser._doc;
    res.status(OK_CODE).json(data);
  } catch (error) {
    if (error.code === 11000) {
      next(new ConflictError('Email exists'));
    } else if (error.name === 'ValidationError') {
      next(new BadRequestError('Email or password are not vallid'));
    } else {
      next(new DefaultError('Unknown error'));
    }
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const result = await User.findOneAndUpdate(
      { _id: req.user._id },
      { name, about },
      { new: true, runValidators: true },
    );
    if (result === null) {
      throw new NotFoundError('user not found');
    } else {
      res.status(OK_CODE).json(result);
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError(('Name or about are not vallid')));
    } else if (error.name === 'CastError') {
      next(new BadRequestError(('Invalid id')));
    } else {
      next(new DefaultError(('Unknown error')));
    }
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const result = await User.findById({ _id: userId });
    if (result === null) {
      throw new NotFoundError('user not found');
    } else {
      res.status(OK_CODE).json(result);
    }
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError('User id is not valid'));
    } else {
      next(error);
    }
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;

    const result = await User.findOneAndUpdate(
      { _id: req.user._id },
      { avatar },
      { new: true },
    );

    if (result === null) {
      throw new NotFoundError('user not found');
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError(('Avatar is  not vallid')));
    } else if (error.name === 'CastError') {
      next(new BadRequestError(('Invalid id')));
    } else {
      next(new DefaultError(('Unknown error')));
    }
  }
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token }); // аутентификация успешна! пользователь в переменной user
    })
    .catch(() => {
      next(new UnauthorizedError(('Auth error')));
    });
};

module.exports = {
  getUsers, getMe, createUser, updateUser, updateAvatar, login, getUserById,
};
