const router = require('express').Router();
const user = require('../models/user');
const {
  DEFAULT_ERROR_CODE, NOT_FOUND_ERROR_CODE, BAD_REQUEST_ERROR_CODE, OK_CODE,
} = require('./codes');

router.get('/users', async (req, res) => {
  try {
    const users = await user.find();
    res.status(OK_CODE).json(users);
  } catch (error) {
    res.status(DEFAULT_ERROR_CODE).json({ message: 'Unknown error' });
  }
});

router.get('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await user.findById(userId);
    if (result === null) {
      res.status(NOT_FOUND_ERROR_CODE).json({ message: 'user not found' });
    } else {
      res.status(OK_CODE).json(result);
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR_CODE).json({ message: 'card id is not vallid' });
      res.status(DEFAULT_ERROR_CODE).json(error);
    }
  }
});

router.post('/users', async (req, res) => {
  try {
    const { body } = req;
    const { name, about, avatar } = body;
    // eslint-disable-next-line new-cap
    const newUser = new user({ name, about, avatar });
    await newUser.save();
    res.status(OK_CODE).json(newUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(BAD_REQUEST_ERROR_CODE).json({ message: 'Name, about or avatar are not vallid' });
    } else {
      res.status(DEFAULT_ERROR_CODE).json({ message: 'Unknown error' });
    }
  }
});

router.patch('/users/me', async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const result = await user.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { name, about, avatar } },
      { new: true },
    );

    if (result === null) {
      res.status(BAD_REQUEST_ERROR_CODE).json({ message: 'user data not valid' });
    } else {
      res.status(OK_CODE).json(result);
    }
  } catch (error) {
    res.status(DEFAULT_ERROR_CODE).json({ message: 'Unknown error' });
  }
});

router.patch('/users/me/avatar', async (req, res) => {
  try {
    const { avatar } = req.body;
    if (/https?:\/\/[^\s]/gi.test(avatar)) {
      const result = await user.findOneAndUpdate(
        { _id: req.user._id },
        { $set: { avatar } },
        { new: true },
      );
      if (result === null) {
        res.status(NOT_FOUND_ERROR_CODE).json({ message: 'user not found' });
      } else {
        res.status(OK_CODE).json(result);
      }
    } else {
      res.status(BAD_REQUEST_ERROR_CODE).json({ message: 'Avatar is not vallid' });
    }
  } catch (error) {
    res.status(DEFAULT_ERROR_CODE).json({ message: 'Unknown error' });
  }
});

module.exports = router;
