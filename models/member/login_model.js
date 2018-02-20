const db = require('../connection_db');

module.exports = function memberLogin(memberData) {
    let result = {};

    return new Promise((resolve, reject) => {
        db.query('select * from member where email = ? and password = ?', [memberData.email, memberData.password], function(err, rows) {
            if(err) {
                result.status = '登入失敗。';
                result.err = '伺服器錯誤，請稍後再試。';
                reject(result);
                return;
            }
            resolve(rows);

        })
    })
}