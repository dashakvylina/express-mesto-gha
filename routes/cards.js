const router = require('express').Router();
const card = require('../models/card');
const {
  OK_CODE, DEFAULT_ERROR_CODE, BAD_REQUEST_ERROR_CODE, NOT_FOUND_ERROR_CODE,
} = require('./codes');

router.get('/cards', async (req, res) => {
  try {
    const result = await card.find();
    res.status(OK_CODE).json(result);
  } catch (error) {
    res.status(DEFAULT_ERROR_CODE).json({ message: 'Unknown error' });
  }
});

router.post('/cards', async (req, res) => {
  try {
    const { body, user } = req;
    const { name, link } = body;
    // eslint-disable-next-line new-cap
    const newCard = new card({ name, link, owner: user._id });
    await newCard.save();
    res.status(OK_CODE).json(newCard);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(BAD_REQUEST_ERROR_CODE).json({ message: 'name or link are not valid' });
    } else {
      res.status(DEFAULT_ERROR_CODE).json({ message: 'Unknown error' });
    }
  }
});

router.delete('/cards/:cardId', async (req, res) => {
  try {
    const { cardId } = req.params;
    const result = await card.findByIdAndDelete({ _id: cardId });
    if (result === null) {
      res.status(NOT_FOUND_ERROR_CODE).json({ message: 'card not found' });
    } else {
      res.status(OK_CODE).json(result);
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR_CODE).json({ message: 'card id is not valid' });
    } else {
      res.status(DEFAULT_ERROR_CODE).json({ message: 'Unknown error' });
    }
  }
});

router.put('/cards/:cardId/likes', async (req, res) => {
  try {
    const { cardId } = req.params;
    if (cardId) {
      const result = await card.findByIdAndUpdate(
        cardId,
        { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
        { new: true },
      );
      if (result === null) {
        res.status(NOT_FOUND_ERROR_CODE).json({ message: 'card not found' });
      } else {
        res.status(OK_CODE).json(result);
      }
    } else {
      res.status(BAD_REQUEST_ERROR_CODE).json({ message: 'card id is not vallid' });
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR_CODE).json({ message: 'card id is not vallid' });
    } else {
      res.status(DEFAULT_ERROR_CODE).json({ message: 'Unknown error' });
    }
  }
});

router.delete('/cards/:cardId/likes', async (req, res) => {
  try {
    const { cardId } = req.params;
    if (cardId) {
      const result = await card.findByIdAndUpdate(
        cardId,
        { $pull: { likes: req.user._id } },
        { new: true },
      );
      if (result === null) {
        res.status(NOT_FOUND_ERROR_CODE).json({ message: 'card not found' });
      } else {
        res.status(OK_CODE).json(result);
      }
    } else {
      res.status(BAD_REQUEST_ERROR_CODE).json({ message: 'card id is not vallid' });
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR_CODE).json({ message: 'card id is not vallid' });
    } else {
      res.status(DEFAULT_ERROR_CODE).json({ message: 'Unknown error' });
    }
  }
});

module.exports = router;
