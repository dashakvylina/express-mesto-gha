const jwt = require('jsonwebtoken');
const {
  UnauthorizedError,
} = require('../errors');

function auth(req, res, next) {
  const { authorization } = req.headers;

  try {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedError('Необходима авторизация,');
    }
    const token = authorization.replace('Bearer ', '');
    let payload;
    try {
      payload = jwt.verify(token, 'some-secret-key');
    } catch (err) {
      next(new UnauthorizedError('Необходима авторизация'));
    }

    req.user = payload; // {_id: '...'}

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  auth,
};
