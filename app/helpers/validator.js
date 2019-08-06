const { buildCheckFunction, query , header, body} = require('express-validator/check');
const checkBodyAndQuery = buildCheckFunction(['body', 'query']);
const jwt = require('jsonwebtoken');
const chatfuelValidator = [
    query('chatfuel_user_id')
    .custom((value) => !!value && (parseInt(value, 10) > 0))
    .withMessage('Trường chatfuel_user_id không hợp lệ'),
    query('gender', "Trường gender không tồn tại")
    .exists(),
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
const apiValidator = [
    
];

const loginValidator = [
    body("user", "User bạn nhập không hợp lệ")
    .exists(),
    body("pass", "Password bạn nhập không hợp lệ")
    .exists()
]
module.exports = {
    chatfuelValidator,
    loginValidator
}
