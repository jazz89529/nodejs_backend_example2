const db = require('../connection_db');
const config = require('../../config/development_config');
const transporter = require('../connection_mail');

module.exports = function orderComplete(orderID, memberID) {
    let result = {};

    return new Promise(async (resolve, reject) => {
        const hasData = await checkOrderData(orderID, memberID);
        const hasComplete = await checkOrderComplete(orderID);

        if(hasData === false) {
            result.status = '訂單完成失敗。';
            result.err = '沒有該訂單的資料。';
            reject(result);
        } else if(hasComplete === false) {
            result.status = '訂單完成失敗。';
            result.err = '該訂單已經完成。';
            reject(result);
        } else if(hasData === true && hasComplete === true) {
            // 取得order_list的table資料
            const orderData = await getOrderData(orderID, memberID)
            // 取得商品ID
            const productID = await orderData[0].product_id;

            for(let key in orderData) {
                const hasStock = await checkOrderStock(orderData[key].product_id, orderData[key].order_quantity)

                if(hasStock !== true) {
                    result.status = '訂單完成失敗。';
                    result.err = hasStock;
                    reject(result);
                    return;
                }
            }
            // 將商品庫存扣除
            await db.query('update product, order_list set product.quantity = product.quantity - order_list.order_quantity where order_list.product_id = product.id and order_list.order_id = ?', orderID, function(err, rows) {
                if(err) {
                    console.log(err);
                    result.status = '訂單完成失敗。';
                    result.err = '伺服器錯誤，請稍後再試。';
                    reject(result);
                    return;
                }
            })
            // 將is_complete的訂單狀態改為1
            await db.query('update order_list set is_complete = 1 where order_id = ?', orderID, function(err, rows) {
                if(err) {
                    console.log(err);
                    result.status = '訂單完成失敗。';
                    result.err = '伺服器錯誤，請稍後再試';
                    reject(result);
                    return;
                }
            })
            //寄送Email通知
            const memberData = await getMemberData(memberID);

            const mailOptions = {
                from: `"企鵝購物網" <${config.senderMail.user}>`, // 寄信
                to: memberData.email, // 收信
                subject: memberData.name + '您好，您所下的訂單已經完成。', // 主旨
                html: `<p>Hi, ${memberData.name} </p>` + `<br>` + `<br>` + `<span>感謝您訂購<b>企鵝購物網</b>的商品，歡迎下次再來！</span>` // 內文
            }

            transporter.sendMail(mailOptions, (err, info) => {
                if(err) {
                    console.log(err);
                    return;
                }
                console.log('Message %s sent: %s', info.messageId, info.response)
            })
            result.status = '訂單編號： ' + orderID + ' 付款已完成，謝謝您使用該服務！詳細的訂單資訊已寄送至 ' + memberData.email;
            resolve(result);
        }
    })
}


const checkOrderData = function (orderID, memberID) {
    return new Promise((resolve, reject) => {
        db.query('select * from order_list where order_id = ? and member_id = ?', [orderID, memberID], function(err, rows) {
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
            if(rows[0].is_complete === 1) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
    })
}

const getOrderData = function (orderID, memberID) {
    return new Promise((resolve, reject) => {
        db.query('select * from order_list where order_id = ? and member_id = ?', [orderID, memberID], function(err, rows) {
            if(err) {
                console.log(err);
                reject(err);
                return;
            }
            resolve(rows);
        })
    })
}

const checkOrderStock = function (orderProductID, orderQuantity) {
    return new Promise((resolve, reject) => {
        db.query('select * from product where id = ?', orderProductID, function(err, rows) {
            if(rows[0].quantity >= orderQuantity && rows[0].quantity!== 0) {
                resolve(true);
            } else {
                resolve(rows[0].name + " 庫存不足");
            }
        })
    })
}

const getMemberData = function (memberID) {
    memberID = 1;
    let memberData = {};

    return new Promise((resolve, reject) => {
        db.query('select * from member where id = ?', memberID, function(err, rows) {
            memberData.email = rows[0].email;
            memberData.name = rows[0].name;
            resolve(memberData);
        })
    })
}

