const db = require('../connection_db');

module.exports = function orderDelete(deleteList) {
    let result = {};

    return new Promise(async (resolve, reject) => {
        for(let key in deleteList) {
            // 判斷有無該筆訂單資料
            const hasData = await checkOrderData(deleteList[key].orderID, deleteList[key].memberID, deleteList[key].productID);
            // 判斷該筆訂單資料是否已完成交易
            const hasComplete = await checkOrderComplete(deleteList[key].orderID, deleteList[key].memberID, deleteList[key].productID);

            if(hasData === false) {
                result.status = '刪除訂單資料失敗。';
                result.err = '沒有該筆資料。';
                reject(result);
            } else if(hasComplete === false) {
                result.status = '刪除訂單資料失敗。';
                result.err = '該筆資料已完成。';
                reject(result);
            } else if(hasData === true && hasComplete === true) {
                await db.query('delete from order_list where order_id = ? and member_id = ? and product_id = ?', [deleteList[key].orderID, deleteList[key].memberID, deleteList[key].productID], function(err, rows) {
                    if(err) {
                        console.log(err);
                        result.status = '刪除訂單資料失敗。';
                        result.err = '伺服器錯誤，請稍後再試。';
                        reject(result);
                        return;
                    }
                    result.status = '刪除訂單資料成功。';
                    result.deleteList = deleteList;
                    resolve(result);
                })
            }

        }
    })
}


const checkOrderData = function (orderID, memberID, productID) {
    return new Promise((resolve, reject) => {
        db.query('select * from order_list where order_id = ? and member_id = ? and product_id = ?', [orderID, memberID, productID], function(err, rows) {
            if(rows[0] === undefined) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
    })
}

const checkOrderComplete = function (orderID, memberID, productID) {
    return new Promise((resolve, reject) => {
        db.query('select * from order_list where order_id = ? and member_id = ? and product_id = ? and is_complete = 0', [orderID, memberID, productID], function(err, rows) {
            if(rows[0] === undefined) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
    })
}