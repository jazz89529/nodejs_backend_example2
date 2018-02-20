const db = require('../connection_db');

module.exports = function customerEdit(id, memberUpdateData) {
    let result = {};
    return new Promise((resolve, reject) => {
        db.query('update member set ? where id = ?', [memberUpdateData, id], function(err, rows) {
            if(err) {
                console.log('這是錯誤', err);
                console.log('這是id', id);
                console.log('這是memberUpdateData', memberUpdateData);
                result.status = '會員資料更新失敗。';
                result.err = '伺服器錯誤，請稍後再試。';
                reject(result);
                return;
            }
            result.status = '會員資料更新成功。';
            result.memberUpdateData = memberUpdateData;
            resolve(result);
        })
    })
}