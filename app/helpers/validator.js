const { buildCheckFunction, query } = require('express-validator/check');
const checkBodyAndQuery = buildCheckFunction(['body', 'query']);

const chatfuelValidator = [
    query('chatfuel_user_id')
    .custom((value) => !!value && (parseInt(value, 10) > 0))
    .withMessage('Trường chatfuel_user_id không hợp lệ'),
    query('gender', "Trường gender không tồn tại")
    .exists({
        checkNull: true,
        checkFalsy: true
    }),
    query('first_name', 'Trường first_name không hợp lệ')
    .exists({
        checkNull: true,
        checkFalsy: true
    }),
    query('last_name', 'Trường last_name không hợp lệ')
    .exists({
        checkNull: true,
        checkFalsy: true
    })
];

module.exports = {
    chatfuelValidator
}
