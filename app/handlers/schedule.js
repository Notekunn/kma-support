const loginKMA = require("tin-chi-kma")({});
const parseSchedule = require("parse-schedule-kma");
const moment = require("moment-timezone");
const { Op } = require("sequelize");
const TIME_ZONE = 'Asia/Ho_Chi_Minh';
const DATE_FORMAT = "DD/MM/YYYY";
module.exports = class Schedule {
    constructor(Schedule) {
        this.Schedule = Schedule;
    }

    getSemester(user, pass) {
        return new Promise(function(resolve, reject) {
            loginKMA({ user, pass }, function(error, api) {
                if (error) reject(error)
                else api.studentTimeTable.getSemester(resolve)
            })
        })
    }

    download(user, pass, semester) {
        return new Promise(function(resolve, reject) {
            loginKMA({ user, pass }, async function(error, api) {
                if (error) Promise.reject(error)
                else api.studentTimeTable.downloadTimeTable({ semester }, function(buffer) {
                    const { studentCode, studentName, scheduleData } = parseSchedule(buffer);
                    resolve(scheduleData);
                })
            })
        })
    }

    async save(studentCode, password, semester, callback) {
        try {

            const scheduleData = await this.download(studentCode, password, semester);
            callback(undefined, false);
            for(let i = 0; i < scheduleData.length; i++){
                const schedule = scheduleData[i];
                await this.Schedule.findOrCreate({
                    where: {
                        studentCode,
                        ...schedule
                    },
                    defaults: {}
                });
            }

        }
        catch (e) {
            callback(e);
        }
    }

    format(day, schedules) {
        const thisDay = moment.tz(day, DATE_FORMAT, TIME_ZONE);
        let string = `Thứ ${thisDay.day() + 1}, ${day}\n\`\`\`\n`;
        string += schedules.map(({ subjectName, teacher, lesson, room }) => {
            return `Tiết ${lesson}:\n${subjectName}\nĐịa điểm: ${room}${ teacher ? '\nGiáo viên: '+ teacher : ''}.`;
        }).join('\n' + '-'.repeat(15) + '\n').trim(/\-+||\n+/);
        string += `\n\`\`\``;
        return string;

    }

    diffDay(a, b) {
        return moment.tz(a.day, DATE_FORMAT, TIME_ZONE).unix() - moment.tz(b.day, DATE_FORMAT, TIME_ZONE).unix();
    }

    getDate(dateString) {
        const date = dateString ? moment.tz(dateString, DATE_FORMAT, TIME_ZONE) : moment.tz(TIME_ZONE);
        return date.format(DATE_FORMAT);
    }

    getDayOfWeek(date) {
        const dateOfWeek = moment.tz(this.getDate(date), DATE_FORMAT, TIME_ZONE);
        const result = [];
        for (let i = 0; i <= 6; i++) {
            result.push(dateOfWeek.day(i).format("DD/MM/YYYY"));
        }
        return result;
    }

    getNextDay() {
        return moment.tz(TIME_ZONE).add(1, 'days').format(DATE_FORMAT);
    }
    query(studentCode, day) {
        return this.Schedule
            .findAll({
                where: {
                    studentCode,
                    day
                }
            })
            .then(e => e.map(e => e.get({ plain: true })))
            .catch(e => Promise.resolve(undefined));
    }
    async searchOne(studentCode, date) {
        const scheduleQuery = await this.query(studentCode, this.getDate(date));
        if (!scheduleQuery || scheduleQuery.length == 0) return "Không có thời khóa biểu!";
        const scheduleResult = scheduleQuery
            .sort(function(a, b) {
                return parseInt(a.lesson) - parseInt(b.lesson) > 0
            })
        return this.format(scheduleResult[0].day, scheduleResult);
    }

    async searchMulti(studentCode, date) {
        const scheduleQuery = await this.query(studentCode, {
            [Op.in]: this.getDayOfWeek(date)
        })
        if (!scheduleQuery || scheduleQuery.length == 0) return ["Không có thời khóa biểu!"];
        const weekSchedule = new Object();
        scheduleQuery
            .sort(function(a, b) {
                return this.diffDay(a, b) > 0 || (this.diffDay(a, b) == 0 && parseInt(a.lesson) - parseInt(b.lesson) > 0)
            }.bind(this))
            .forEach(({ day, subjectName, teacher, lesson, room, /*subjectCode,className*/ }) => {
                if (!weekSchedule[day]) weekSchedule[day] = new Array();
                weekSchedule[day].push({
                    subjectName,
                    teacher,
                    lesson,
                    room,
                    // subjectCode,
                    // className
                })
            })
        return Object.keys(weekSchedule).map((day) => {
            return this.format(day, weekSchedule[day]);
        })
    }
}
