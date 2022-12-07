const User = require('../models/user');
const {
  DEFAULT_ERROR_CODE, NOT_FOUND_ERROR_CODE, BAD_REQUEST_ERROR_CODE, OK_CODE,
} = require('../constants');

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(OK_CODE).json(users);
  } catch (error) {
    res.status(DEFAULT_ERROR_CODE).json({ message: 'Unknown error' });
  }
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await User.findById(userId);
    if (result === null) {
      res.status(NOT_FOUND_ERROR_CODE).json({ message: 'user not found' });
    } else {
      res.status(OK_CODE).json(result);
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR_CODE).json({ message: 'card id is not vallid' });
    } else { res.status(DEFAULT_ERROR_CODE).json(error); }
  }
};

const createUser = async (req, res) => {
  try {
    const { body } = req;
    const { name, about, avatar } = body;
    const newUser = new User({ name, about, avatar });
    await newUser.save();
    res.status(OK_CODE).json(newUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(BAD_REQUEST_ERROR_CODE).json({ message: 'Name, about or avatar are not vallid' });
    } else {
      res.status(DEFAULT_ERROR_CODE).json({ message: 'Unknown error' });
    }
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    const result = await User.findOneAndUpdate(
      { _id: req.user._id },
      { name, about },
      { new: true, runValidators: true },
    );
    if (result === null) {
      res.status(NOT_FOUND_ERROR_CODE).json({ message: 'user not found' });
    } else {
      res.status(OK_CODE).json(result);
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(BAD_REQUEST_ERROR_CODE).json({ message: 'Name or about are not vallid' });
    } else if (error.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR_CODE).json({ message: 'Invalid id' });
    } else {
      res.status(DEFAULT_ERROR_CODE).json({ message: 'Unknown error' });
    }
  }
};

const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const result = await User.findOneAndUpdate(
      { _id: req.user._id },
      { avatar },
      { new: true, runValidators: true },
    );
    if (result === null) {
      res.status(NOT_FOUND_ERROR_CODE).json({ message: 'user not found' });
    } else {
      res.status(OK_CODE).json(result);
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(BAD_REQUEST_ERROR_CODE).json({ message: 'Name or about are not vallid' });
    } else if (error.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR_CODE).json({ message: 'Invalid id' });
    } else {
      res.status(DEFAULT_ERROR_CODE).json({ message: 'Unknown error' });
    }
  }
};

module.exports = {
  getUsers, getUser, createUser, updateUser, updateAvatar,
};
