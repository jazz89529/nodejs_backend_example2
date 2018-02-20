const db = require('../connection_db');

module.exports = function register(memberData) {
    let result = {};

    return new Promise((resolve, reject) => {
        //尋找是否有重複的email
        db.query('select email from member where email = ?', memberData.email, function(err, rows) {
            if(err) {
                console.log(err);
                result.status = '註冊失敗。';
                result.err = '伺服器錯誤，請稍後再試！';
                reject(result);
                return;
            }
            //如果有重複的email
            if(rows.length >= 1) {
                result.status = '註冊失敗。';
                result.err = '已經有重複的email!';
                reject(result);
            } else {
                db.query('INSERT INTO member SET ?', memberData, function(err, rows) {
                    if(err) {
                        console.log(err);
                        result.status = '註冊失敗。';
                        result.err = '伺服器錯誤，請稍候在試！';
                        reject(result);
                        return;
                    }
                    result.registerMember = memberData;
                    resolve(result);
                })
            }
        })
    })
}