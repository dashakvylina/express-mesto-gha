const Card = require('../models/card');
const {
  OK_CODE,
} = require('../constants');
const {
  BadRequestError,
  DefaultError,
  NotFoundError,
  ForbiddenError
} = require('../errors');

const getCards = async (req, res, next) => {
  try {
    const result = await Card.find().populate(['owner likes']);
    res.status(OK_CODE).json(result);
  } catch (error) {
    next(new BadRequestError('Unknown error'));
  }
};

const createCard = async (req, res, next) => {
  try {
    const { body, user } = req;
    const { name, link } = body;
    const newCard = new Card({ name, link, owner: user._id });
    await newCard.save();
    res.status(OK_CODE).json(newCard);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Name or link are not valid'));
    } else {
      next(new DefaultError('Unknown error'));
    }
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;

    const { user } = req;
    const result = await Card.findOneAndRemove({ _id: cardId, owner: user._id });
    if (result === null) {
      throw new ForbiddenError('Card not found');
    } else {
      res.status(OK_CODE).json(result);
    }
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError('Card id is not valid'));
    } else {
      next(error);
    }
  }
};

const createLike = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const result = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (result === null) {
      throw new NotFoundError('card not found');
    } else {
      res.status(OK_CODE).json(result);
    }
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError('card id is not vallid'));
    } else {
      next(new DefaultError('Unknown error'));
    }
  }
};

const deleteLike = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    if (cardId) {
      const result = await Card.findByIdAndUpdate(
        cardId,
        { $pull: { likes: req.user._id } },
        { new: true },
      );
      if (result === null) {
        throw new NotFoundError('card not found');
      } else {
        res.status(OK_CODE).json(result);
      }
    } else {
      throw new BadRequestError('card id is not vallid');
    }
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError('card id is not vallid'));
    } else {
      next(new DefaultError('card id is not vallid'));
    }
  }
};

module.exports = {
  getCards, createCard, deleteCard, createLike, deleteLike,
};
