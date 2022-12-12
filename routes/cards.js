const router = require('express').Router();
const { Joi, celebrate, Segments } = require('celebrate');
const {
  getCards, createCard, deleteCard, createLike, deleteLike,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.post('/cards', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().regex(/([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif|bmp|svg|webp))/i).required(),
  }),

}), createCard);

router.delete('/cards/:cardId', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).required(),
  }),
}), deleteCard);

router.put('/cards/:cardId/likes', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).required(),
  }),
}), createLike);

router.delete('/cards/:cardId/likes', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).required(),
  }),
}), deleteLike);

module.exports = router;
