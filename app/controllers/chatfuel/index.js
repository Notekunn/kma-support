const validated = require("@helpers/handleValidate");
const Chatfuel = require("chatfuel-helper");
const UserHandler = require("@handlers/user");
const AccountHandler = require("@handlers/account");
const URL = require("url");
const simsimi = require("@helpers/simsimi");
const regexUrl = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
const indexRouterController = function({ models: { User, Account } }) {
    const userHandler = new UserHandler(User);
    const accountHandler = new AccountHandler(Account);
    return async function(req, res, next) {

        if (!validated(req, res)) return;
        let { chatfuel_user_id, gender, first_name, last_name, profile_pic_url, message } = req.query;

        let [{ filterBadword, voiceChat }, created] = await userHandler.add({ chatfuel_user_id, gender, first_name, last_name, profile_pic_url });
        const chatfuel = new Chatfuel();
        if (regexUrl.test(message)) {
            //
            let url = URL.parse(message);
            switch (url.hostname) {
                case 'video.xx.fbcdn.net':
                    //Xu ly file
                    break;
                case 'scontent.xx.fbcdn.net':
                    //Xu ly hinh anh
                    break;
                case 'cdn.fbsbx.com':
                    // code
                    break;

                default:
                    break;

            }

        }

        if (message == "test") {
            console.log("testing");
            return res.json({
                "messages": [{
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "list",
                            "top_element_style": "compact",
                            "elements": [{
                                    "title": "Chatfuel Rockets Jersey",
                                    "default_action": {
                                        "messenger_extensions": false
                                    },
                                    "buttons": [{
                                        "type": "web_url",
                                        "url": "https://rockets.chatfuel.com/store",
                                        "title": "View Item"
                                    }]
                                },
                                {
                                    "title": "Chatfuel Rockets Jersey",
                                    "default_action": {
                                        "messenger_extensions": false
                                    },
                                    "buttons": [{
                                        "type": "web_url",
                                        "url": "https://rockets.chatfuel.com/store",
                                        "title": "View Item"
                                    }]
                                }
                            ]
                        }
                    }
                }]
            })
        }

        if (message == "help") {

            return res.send((new Chatfuel()).redirectToBlock(['help']));
        }
        if (message == "tkb") {

            return res.send((new Chatfuel()).redirectToBlock(['search_schedule']));
        }
        if (message == "connect") {

            return res.send((new Chatfuel()).redirectToBlock(['connect_account']));
        }
        if (message == "download") {

            return res.send((new Chatfuel()).redirectToBlock(['download_schedule']));
        }



        // if (/^tinchi/.test(message)) {

        //     let account = await accountHandler.getByUID(chatfuel_user_id);
        //     if (!account) return res.end();
        //     return res.send((new Chatfuel()).redirectToBlock(['tin_chi']));
        // }

        simsimi(message, filterBadword)
            .then(function(response) {
                if (!response) return res.send((new Chatfuel()).sendText(message).render())
                if (voiceChat) return res.send((new Chatfuel()).sendAudio(`http://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=${encodeURI(response)}`).render());
                res.send((new Chatfuel()).sendText(response).render())
            }).catch(error => {
                res.send((new Chatfuel()).sendText("Có lỗi xảy ra:\n" + e.stack || e).render());
            })
    }
}

module.exports = indexRouterController
