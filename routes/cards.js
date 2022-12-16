const router = require('express').Router();
const { Joi, celebrate, Segments } = require('celebrate');
const {
  getCards, createCard, deleteCard, createLike, deleteLike,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.post('/cards', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().regex(/https?:\/\/([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/i).required(),
  }),

}), createCard);

router.delete('/cards/:cardId', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), deleteCard);

router.put('/cards/:cardId/likes', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), createLike);

router.delete('/cards/:cardId/likes', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), deleteLike);

module.exports = router;
