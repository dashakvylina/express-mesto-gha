const router = require('express').Router();
const Card = require('../models/card');
const { OK_CODE, DEFAULT_ERROR_CODE, BAD_REQUEST_ERROR_CODE, NOT_FOUND_ERROR_CODE } = require('./codes');

router.get('/cards', async (req, res) => {
  try {
    const result = await Card.find();
    res.status(OK_CODE).json(result);
  } catch (error) {
    res.status(DEFAULT_ERROR_CODE).json({ message: error.message });
  }
});

router.post('/cards', async (req, res) => {
  try {
    const { body, user } = req;
    const { name, link } = body;
    if (name && name.length >= 2 && name.length <= 30 && /https?:\/\/[^\s]/gi.test(link)) {
      const newCard = new Card({ name, link, owner: user._id });
      await newCard.save();
      res.status(OK_CODE).json(newCard);
    } else {
      res.status(BAD_REQUEST_ERROR_CODE).json({ message: 'Name or link are not vallid' });
    }
  } catch (error) {
    res.status(DEFAULT_ERROR_CODE).json({ message: error.message });
  }
});

router.delete('/cards/:cardId', async (req, res) => {
  try {
    const { cardId } = req.params;
    const result = await Card.deleteOne({ _id: cardId });
    if (result === null) {
      res.status(NOT_FOUND_ERROR_CODE).json({ message: 'card not found' });
    } else {
      res.status(OK_CODE).json(result);
    }
  } catch (error) {
    res.status(DEFAULT_ERROR_CODE).json({ message: error.message });
  }
});

router.put('/cards/:cardId/likes', async (req, res) => {
  try {
    const { cardId } = req.params;
    if (cardId) {
      const result = await Card.findByIdAndUpdate(
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
    res.status(DEFAULT_ERROR_CODE).json({ message: error.message });
  }
});

router.delete('/cards/:cardId/likes', async (req, res) => {
  try {
    const { cardId } = req.params;
    if (cardId) {
      const result = await Card.findByIdAndUpdate(
        cardId,
        { $pull: { likes: req.user._id } }, // убрать _id из массива
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
    res.status(DEFAULT_ERROR_CODE).json({ message: error.message });
  }
});

module.exports = router;
