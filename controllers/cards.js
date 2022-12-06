const Card = require('../models/card');
const {
  DEFAULT_ERROR_CODE, NOT_FOUND_ERROR_CODE, BAD_REQUEST_ERROR_CODE, OK_CODE,
} = require('../constants');

const getCards = async (req, res) => {
  try {
    const result = await Card.find().populate(['owner likes']);
    res.status(OK_CODE).json(result);
  } catch (error) {
    res.status(DEFAULT_ERROR_CODE).json({ error });
  }
};

const createCard = async (req, res) => {
  try {
    const { body, user } = req;
    const { name, link } = body;
    const newCard = new Card({ name, link, owner: user._id });
    await newCard.save();
    res.status(OK_CODE).json(newCard);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(BAD_REQUEST_ERROR_CODE).json({ message: 'name or link are not valid' });
    } else {
      res.status(DEFAULT_ERROR_CODE).json({ message: 'Unknown error' });
    }
  }
};

const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const result = await Card.findByIdAndDelete({ _id: cardId });
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
};

const createLike = async (req, res) => {
  try {
    const { cardId } = req.params;
    const result = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (result === null) {
      res.status(NOT_FOUND_ERROR_CODE).json({ message: 'card not found' });
    } else {
      res.status(OK_CODE).json(result);
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR_CODE).json({ message: 'card id is not vallid' });
    } else {
      res.status(DEFAULT_ERROR_CODE).json({ message: 'Unknown error' });
    }
  }
};

const deleteLike = async (req, res) => {
  try {
    const { cardId } = req.params;
    if (cardId) {
      const result = await Card.findByIdAndUpdate(
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
};

module.exports = {
  getCards, createCard, deleteCard, createLike, deleteLike,
};
