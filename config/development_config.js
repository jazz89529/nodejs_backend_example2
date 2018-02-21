require('dotenv').config({path: '../.env'})

module.exports = {
    mysql: {
        host: process.env.HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE
    },
    secret: process.env.MY_SECRET,
    senderMail: {
        user: process.env.SEND_MAIL_USER,
        password: process.env.SEND_MAIL_PASSWORD
    }
}


