const validated = require("@helpers/handleValidate");
const Chatfuel = require("chatfuel-helper");
const ScheduleHandler = require("@handlers/schedule");
const AccountHandler = require("@handlers/account");
const buildUrl = require("build-url");
const { HTTPS } = require("@configFile");
module.exports = function ({ models: { Schedule, Account } }) {
    const scheduleHandler = new ScheduleHandler(Schedule);
    const accountHandler = new AccountHandler(Account);
    const download = async function (req, res, next) {
        if (!validated(req, res)) return;
        const { chatfuel_user_id, gender, first_name, last_name, profile_pic_url, url_server } = req.query;
        const account = await accountHandler.getByUID(chatfuel_user_id);
        if (!account) return res.send((new Chatfuel()).sendText("Bạn chưa kết nối với tài khoản sinh viên!\nVui lòng kết nối!").render());
        scheduleHandler
            .getSemester(account.studentCode, account.password)
            .then(semesters => {
                let chatfuel = new Chatfuel();

                if (semesters.length < 0) return Promise.reject("Không tìm thấy học kỳ")
                let elements = new Array();

                semesters.splice(0, 4).forEach(function (semester) {
                    let [number, start, end] = semester.name.split('_');
                    let buttons = [chatfuel.createButtonPostBack({
                        url: buildUrl(`${HTTPS ? 'https' : 'http'}://${url_server}/api/chatfuel/schedule/save/`, {
                            queryParams: {
                                chatfuel_user_id,
                                gender,
                                first_name,
                                last_name,
                                profile_pic_url,
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
            .catch(e => res.send((new Chatfuel()).sendText("Có lỗi xảy ra:\n" + e.stack || e).render()))

    }

    const saveSchedule = async function (req, res, next) {
        if (!validated(req, res)) return;
        let { chatfuel_user_id, semester } = req.query;
        const account = await accountHandler.getByUID(chatfuel_user_id);
        if (!account) return res.send((new Chatfuel()).sendText("Bạn chưa kết nối với tài khoản sinh viên!\nVui lòng kết nối!").render());
        scheduleHandler
            .save(account.studentCode, account.password, semester)
            .then(() => res.send((new Chatfuel()).sendText("Đang tiến hành tải thời khóa biểu về!\nVui lòng chờ trong giây lát!").render()))
            .catch((e) => res.send((new Chatfuel()).sendText("Không thể tải thời khóa biểu:\n" + e.stack || e).render()))
    }

    const search = async function (req, res, next) {
        if (!validated(req, res)) return;
        let { chatfuel_user_id, inputSearch, typeSearch } = req.query;
        const account = await accountHandler.getByUID(chatfuel_user_id);
        if (!account) return res.send((new Chatfuel()).sendText("Bạn chưa kết nối với tài khoản sinh viên!\nVui lòng kết nối!").render());
        typeSearch = `${typeSearch}`.toLowerCase();
        if (["hôm nay", "ngày mai", "ngày khác"].includes(typeSearch)) {
            if (typeSearch == "hôm nay") inputSearch = undefined;
            else if (typeSearch == "ngày mai") inputSearch = scheduleHandler.getNextDay();
            scheduleHandler
                .searchOne(account.studentCode, inputSearch)
                .then(text => (new Chatfuel).sendText(text).render())
                .then(json => res.send(json))
                .catch(e => res.send((new Chatfuel).sendText(`Có lỗi xảy ra:\n${e.stack || e}`).render()));
        }
        else if (["tuần này", "tuần khác"].includes(typeSearch)) {
            scheduleHandler
                .searchMulti(account.studentCode, inputSearch)
                .then(texts => {
                    const chatfuel = new Chatfuel();
                    texts.forEach(text => chatfuel.sendText(text));
                    return chatfuel.render();
                })
                .then(json => res.send(json))
                .catch(e => res.send((new Chatfuel).sendText(`Có lỗi xảy ra:\n${e.stack || e}`).render()));
        }
        else res.send((new Chatfuel).sendText(`Có lỗi xảy ra:\nKhông thể tìm kiếm theo phương thức này`).render())


    }

    const broadcast = async function (req, res, next) {
        if (!validated(req, res)) return;
        let { chatfuel_user_id } = req.query;
        const account = await accountHandler.getByUID(chatfuel_user_id);
        if (!account) return res.send((new Chatfuel()).sendText("Bạn chưa kết nối với tài khoản sinh viên!\nVui lòng kết nối!").render());
        scheduleHandler
            .searchOne(account.studentCode, scheduleHandler.getNextDay())
            .then(text => (new Chatfuel).sendText(text).render())
            .then(json => res.send(json))
            .catch(e => res.send((new Chatfuel).sendText(`Có lỗi xảy ra:\n${e.stack || e}`).render()));
    }

    return {
        download,
        saveSchedule,
        search,
        broadcast
    };
}
