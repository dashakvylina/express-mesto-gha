const router = require('express').Router();
const { Joi, celebrate, Segments } = require('celebrate');
const {
  getUsers, updateUser, updateAvatar, getMe, getUserById
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/me', getMe);

router.get('/users/:userId', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().alphanum().length(24).required(),
  })
}), getUserById);

router.patch('/users/me', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().regex(/([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif|bmp|svg|webp))/i),
  })
}), updateUser);

router.patch('/users/me/avatar', celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().regex(/([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif|bmp|svg|webp))/i).required(),
  }),
}), updateAvatar);

module.exports = router;
