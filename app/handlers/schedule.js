const loginKMA = require("tin-chi-kma")({});
const parseSchedule = require("parse-schedule-kma");
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

    async save(studentCode, password, semester) {
        try {

            const scheduleData = await this.download(studentCode, password, semester);
            return Promise.all(scheduleData.map(schedule => this.Schedule.findOrCreate({
                where: {
                    studentCode,
                    ...schedule
                },
                defaults: {}
            })));

        }
        catch (e) {
            return Promise.reject(e)
        }
    }
}
