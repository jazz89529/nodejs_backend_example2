const db = require('../connection_db');

module.exports = function getOneOrderData(memberID) {
    let result ={};

    return new Promise((resolve, reject) => {
        db.query('select * from order_list where member_id = ?', memberID, function(err, rows) {
            if(err) {
                console.log(err);
                result.status = '取得全部訂單資料失敗。';
                result.err = '伺服器錯誤，請稍後再試。';
                return;
            }
            resolve(rows);
        })
    })
}