# Backend for Mesto front

db url - `mongodb://localhost:27017/mestodb`

Start project:

1. `git clone`
2. `cd project`
3. `npm i`
4. `npm run dev` or `npm run start`

## Routes

- GET /users — возвращает всех пользователей
- GET /users/:userId - возвращает пользователя по _id
- POST /users — создаёт пользователя
- GET /cards — возвращает все карточки
- POST /cards — создаёт карточку
- DELETE /cards/:cardId — удаляет карточку по идентификатору
- PATCH /users/me — обновляет профиль
- PATCH /users/me/avatar — обновляет аватар
- PUT /cards/:cardId/likes — поставить лайк карточке
- DELETE /cards/:cardId/likes — убрать лайк с карточки


https://github.com/dashakvylina/express-mesto-gha
