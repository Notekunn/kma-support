const validated = require("@helpers/handleValidate");
const Chatfuel = require("chatfuel-helper");
const ScheduleHandler = require("@handlers/schedule");
const AccountHandler = require("@handlers/account");
const buildUrl = require("build-url");
const { HTTPS } = require("@configFile");
module.exports = function({ models: { Schedule, Account } }) {
    const scheduleHandler = new ScheduleHandler(Schedule);
    const accountHandler = new AccountHandler(Account);
    const getDownload = async function(req, res, next) {
        if (!validated(req, res)) return;
        let { chatfuel_user_id, gender, first_name, last_name, profile_pic_url, url_server } = req.query;
        let account = await accountHandler.get(chatfuel_user_id);
        console.log(account)
        if (!account) return res.send((new Chatfuel()).sendText("Bạn chưa kết nối với tài khoản sinh viên!\nVui lòng kết nối!").render());
        scheduleHandler
            .getSemester(account.studentCode, account.password)
            .then(semesters => {
                let chatfuel = new Chatfuel();

                if (semesters.length < 0) return Promise.reject("Không tìm thấy học kỳ")
                let elements = new Array();

                semesters.splice(0, 4).forEach(function(semester) {
                    let [number, start, end] = semester.name.split('_');
                    let buttons = [chatfuel.createButtonPostBack({
                        url: buildUrl(`${HTTPS ? 'https': 'http' }://${url_server}/api/chatfuel/schedule/download/`, {
                            queryParams: {
                                chatfuel_user_id,
                                gender,
                                first_name,
                                last_name,
                                profile_pic_url,
                                studentCode: account.studentCode,
                                password: account.password,
                                semester: semester.value,
                            }
                        }),
                        title: "Chọn học kỳ này"

                    })];
                    elements.push(chatfuel.createElement({ title: semester.name, image_url: undefined, subtitle: `Học kỳ ${number} năm học ${start}-${end}.`, buttons }))
                });

                chatfuel.sendLists({ elements });
                res.send(chatfuel.render());

            })
            .catch(e => res.send((new Chatfuel()).sendText("Có lỗi xảy ra:\n" + e).render()))

    }

    const postDownload = async function(req, res, next) {
        if (!validated(req, res)) return;
        let { chatfuel_user_id, semester } = req.query;
        let account = await accountHandler.get(chatfuel_user_id);
        if (!account) return res.send((new Chatfuel()).sendText("Bạn chưa kết nối với tài khoản sinh viên!\nVui lòng kết nối!").render());
        scheduleHandler
            .save(account.studentCode, account.password, semester)
            .then(() => res.send((new Chatfuel()).sendText("Đang tiến hành tải thời khóa biểu về!Vui lòng chờ trong giây lát!").render()))
            .catch((e) => res.send((new Chatfuel()).sendText("Không thể tải thời khóa biểu:\n" + e).render()))
    }

    const search = async function(req, res, next) {
        if (!validated(req, res)) return;
        let { chatfuel_user_id, gender, first_name, last_name, profile_pic_url, studentCode, password } = req.query;

    }

    const broadcast = async function(req, res, next) {
        if (!validated(req, res)) return;
        let { chatfuel_user_id, gender, first_name, last_name, profile_pic_url, studentCode, password } = req.query;

    }

    return {
        getDownload,
        postDownload,
        search,
        broadcast
    };
}
