const readlineSync = require('readline-sync');
const path = require('path');
const fs = require('fs');
const dialects = ['mysql', 'mariadb', 'postgres', 'mssql', 'sqlite'];

const pathSqlite = path.resolve(__dirname, './data.sqlite');
const pathConfig = path.resolve(__dirname, '../config/config.json');
if(fs.existsSync(pathConfig)) return;
let keyDialect;
const config = new Object({
    database: new Object()
});

do {
    keyDialect = readlineSync.keyInSelect(dialects, 'Which database u use?');
} while (keyDialect == -1);
try {
    fs.writeFileSync(pathSqlite, "");
    console.log("Tạo file `data.sqlite` thành công.");
} catch (error) {

    console.log("Vui lòng tạo file `data.sqlite` thủ công trong thư mục bin");
    console.log(error.stack);
    return;
}
const dialect = dialects[keyDialect];
config.database = initDatabase(dialect);
config.HTTPS = readlineSync.keyInYN('Is https server api?', { defaultInput: 'N' });
config.SIMSIMI_KEY = readlineSync.question('Any key simsimi?(skip) ', { defaultInput: 'DEFAULT_KEY' });
config.SECRET_KEY_JWT = readlineSync.question('json web token secret key?(skip) ', { defaultInput: 'DEFAULT_SECRET' });
createConfig();

function createDataBase() {
    try {
        fs.writeFileSync(pathSqlite, "");
        console.log("Tạo file `data.sqlite` thành công.");
    } catch (error) {

        console.log("Vui lòng tạo file `data.sqlite` thủ công trong thư mục bin");
        console.log(error.stack);
        return;
    }
}
function initDatabase(dialect) {
    if (dialect == 'sqlite') {
        const exists = fs.existsSync(pathSqlite);
        const config = {
            dialect,
            storage: pathSqlite
        }
        if (!exists) {
            createDataBase();
            return config;
        }
        const dropDatabase = readlineSync.keyInYN("Do you want to drop old database?", { defaultInput: 'N' })
        if (!dropDatabase) return config;
        const confirmDrop = readlineSync.keyInYN("Are you sure?", { defaultInput: 'N' });
        if (!confirmDrop) return config;
        createDataBase();
        return config;


    }
    else {
        const host = readlineSync.question('Which is db_host? ', {
            defaultInput: 'localhost'
        });
        const username = readlineSync.question('Which is username? ');
        const password = readlineSync.question('Which is password? ');
        const database = readlineSync.question('Which is database? ');
        const config = { dialect, host, username, password, database };
        return config;
    }
}
function createConfig() {
    try {
        fs.writeFileSync(pathConfig, JSON.stringify(config, null, '\t'));
        console.log("Tạo file `config.json` thành công.");
    } catch (error) {

        console.log("Vui lòng tạo file `config.json` thủ công trong thư mục config");
        console.log(error.stack);
        return;
    }
}