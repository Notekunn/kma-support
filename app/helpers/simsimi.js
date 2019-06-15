const request = require("request-promise");
const { SIMSIMI_KEY } = require("@configFile");
module.exports = function(text, filterBadword) {
    return request({
        url: 'http://api.simsimi.com/request.p',
        qs: {
            key: SIMSIMI_KEY,
            text,
            lc: 'vn',
            ft: filterBadword ? '1.0' : '0.0'
        },
        json: true
    })
    .then(({response}) => response)
    .catch(() => Promise.resolve(undefined))
}
