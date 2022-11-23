const router = require('express').Router();
const User = require('../models/user');
const { DEFAULT_ERROR_CODE, NOT_FOUND_ERROR_CODE, BAD_REQUEST_ERROR_CODE, OK_CODE } = require('./codes');

router.get('/users', async (req, res) => {
  try {
    const user = await User.find();
    res.status(OK_CODE).json(user);
  } catch (error) {
    res.status(DEFAULT_ERROR_CODE).json({ message: error.message });
  }
});

router.get('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await User.findById(userId);

    if (result === null) {
      res.status(NOT_FOUND_ERROR_CODE).json({ message: 'user not found' });
    } else {
      res.status(OK_CODE).json(result);
    }
  } catch (error) {
    res.status(DEFAULT_ERROR_CODE).json({ message: error.message });
  }
});

router.post('/users', async (req, res) => {
  try {
    const { body } = req;
    // throw new Error("hbdfsbhjksdfkjbsdf");
    const { name, about, avatar } = body;
    if (name && name.length >= 2 && name.length <= 30 && about && about.length >= 2 && about.length <= 30 && avatar && /https?:\/\/[^\s]/gi.test(avatar)) {
      const newUser = new User({ name, about, avatar });
      await newUser.save();
      res.status(OK_CODE).json(newUser);
    } else {
      res.status(BAD_REQUEST_ERROR_CODE).json({ message: 'Name or about are not vallid' });
    }
  } catch (error) {
    res.status(DEFAULT_ERROR_CODE).json({ message: error.message });
  }
});

router.patch('/users/me', async (req, res) => {
  try {
    const { name, about } = req.body;
    if (name && name.length >= 2 && name.length <= 30 && about && about.length >= 2 && about.length <= 30) {
      const result = await User.findOneAndUpdate(
        { _id: req.user._id },
        { $set: { name, about } },
        { new: true },
      );

      if (result === null) {
        res.status(NOT_FOUND_ERROR_CODE).json({ message: 'user not found' });
      } else {
        res.status(OK_CODE).json(result);
      }
    } else {
      res.status(BAD_REQUEST_ERROR_CODE).json({ message: 'Name or about are not vallid' });
    }
  } catch (error) {
    res.status(DEFAULT_ERROR_CODE).json({ message: error.message });
  }
});

router.patch('/users/me/avatar', async (req, res) => {
  try {
    const { avatar } = req.body;
    if (/https?:\/\/[^\s]/gi.test(avatar)) {
      const result = await User.findOneAndUpdate(
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
    res.status(DEFAULT_ERROR_CODE).json({ message: error.message });
  }
});

module.exports = router;
