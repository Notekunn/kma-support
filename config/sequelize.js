const Sequelize = require("sequelize");
const {database} = require("@configFile");
module.exports = new Sequelize({
    ...database,
    pool: {
        max: 20,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: process.env.NODE_ENV == 'development' ? console.log : false,

    define: {
        underscored: false,
        freezeTableName: true,
        charset: 'utf8',
        dialectOptions: {
            collate: 'utf8_general_ci'
        },
        timestamps: true
    },
    sync: { force: process.env.NODE_ENV == 'build' },
    transactionType: 'IMMEDIATE'
})
