const db = require('../connection_db');

module.exports = function orderEdit(updateList){
    let result = {};

    return new Promise(async (resolve, reject) => {
        // 判斷有無該筆訂單資料
        const hasData = await checkOrderData(updateList.orderID, updateList.memberID, updateList.productID);
        // 判斷該筆訂單資料是否已完成交易
        const hasComplete = await checkOrderComplete(updateList.orderID, updateList.memberID, updateList.productID);

        if(hasData === false) {
            result.status = '更新訂單資料失敗。';
            result.err = '沒有該筆資料。';
            reject(resolve);
        } else if(hasComplete === false) {
            result.status = '更新訂單資料失敗。';
            result.err = '該筆資料已完成。';
            reject(result);
        } else if(hasData === true && hasComplete === true) {
            // 取得商品價錢
            const price = await getProductPrice(updateList.productID);
            // 計算商品總價格
            const orderPrice = updateList.quantity * price;
            // 更新該筆訂單資料(DB)
            await db.query('update order_list set order_quantity = ?, order_price = ?, update_date = ? where order_id = ? and member_id = ? and product_id = ?', [updateList.quantity, orderPrice, updateList.updateDate, updateList.orderID, updateList.memberID, updateList.productID], function(err, rows) {
                if(err) {
                    console.log(err);
                    result.status = '更新訂單資料失敗。';
                    result.err = '伺服器錯誤，請稍後再試。';
                    return;
                }
                result.status = '更新訂單資料成功。';
                result.updateList = updateList;
                resolve(result);
            })
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

const getProductPrice = (productID) => {
    return new Promise((resolve, reject) => {
        db.query('select price from product where id = ?', productID, function(err, rows) {
            if(err) {
                console.log(err);
                reject(err);
                return;
            }
            resolve(rows[0].price);
        })
    })
}