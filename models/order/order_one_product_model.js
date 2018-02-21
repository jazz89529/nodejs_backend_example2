const db = require('../connection_db');

module.exports = function postOneOrderData(orderOneList) {
    let result = {};

    return new Promise(async (resolve, reject) =>{
        const hasData = await checkOrderData(orderOneList.orderID, orderOneList.memberID, orderOneList.productID);
        const hasComplete = await checkOrderComplete(orderOneList.orderID);

        if(hasData === true) {
            result.status = '新增單筆資料失敗。';
            result.err = '已有該筆訂單資料;';
            reject(result);
        } else if(hasComplete === false) {
            result.status = '新增單筆資料失敗。';
            result.err = '該筆訂單已經完成。';
            reject(result);
        } else if(hasData === false) {
            const price = await getProductPrice(orderOneList.productID);

            const orderList = {
                order_id: orderOneList.orderID,
                member_id: orderOneList.memberID,
                product_id: orderOneList.productID,
                order_quantity: orderOneList.quantity,
                order_price: orderOneList.quantity * price,
                is_complete: 0,
                order_date: orderOneList.createDate
            }

            db.query('insert into order_list SET ?', orderList, function(err, rows) {
                if(err) {
                    console.log(err);
                    result.status = '新增單筆資料失敗。';
                    result.err = '伺服器錯誤，請稍後再試。';
                    reject(err);
                    return;
                }
                result.status = '新增單筆資料成功。';
                result.orderList = orderList;
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

const checkOrderComplete = function (orderID) {
    return new Promise((resolve, reject) => {
        db.query('select is_complete from order_list where order_id = ?', orderID, function(err, rows) {
            if(rows[0] === undefined) {
                resolve(true);
                return;
            }
            if(rows[0].is_complete === 1) {
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