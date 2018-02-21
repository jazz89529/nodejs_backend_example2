const Check = require('../../service/member_check');
const verify = require('../../models/member/verification_model');
const orderProductListData = require('../../models/order/order_all_product_model');
const updateOrderData = require('../../models/order/update_model');
const deleteOrderData = require('../../models/order/delete_model');
const orderOneProductData = require('../../models/order/order_one_product_model');
const orderComplete = require('../../models/order/complete_model');

let check = new Check();

module.exports = class ModifyOrder {
    postOrderAllProduct(req, res, next) {
        const token = req.headers['token'];
        if(check.checkNull(token) === true) {
            res.json({
                err: '請輸入token。'
            })
        } else if(check.checkNull(token) === false) {
            verify(token).then(tokenResult => {
                if(tokenResult === false) {
                    res.json({
                        result: {
                            status: 'token錯誤。',
                            err: '請重新登入。'
                        }
                    })
                } else {
                    const memberID = tokenResult;
                    const orderList = {
                        memberID: memberID,
                        productID: req.body.productID,
                        quantity: req.body.quantity,
                        orderDate: onTime()
                    }
                    orderProductListData(orderList).then(result => {
                        res.json({
                            result: result
                        })
                    }, (err) => {
                        res.json({
                            result: err
                        })
                    })
                }
            })
        }
    }
    //更新訂單資料
    updateOrderProduct(req, res, next) {
        const token = req.headers['token'];
        if(check.checkNull(token) === true) {
            res.json({
                err: '請輸入token!'
            })
        } else if(check.checkNull(token) === false) {
            verify(token).then(tokenResult => {
                if(tokenResult === false) {
                    res.json({
                        result: {
                            status: 'token錯誤。',
                            err: '請重新登入。'
                        }
                    })
                } else {
                    //取得更新的資料
                    const updateList = {
                        memberID: tokenResult,
                        productID: req.body.productID,
                        orderID: req.body.orderID,
                        quantity: req.body.quantity,
                        updateDate: onTime()
                    }

                    updateOrderData(updateList).then(result => {
                        res.json({
                            result: result
                        })
                    }, (err) => {
                        res.json({
                            result: err
                        })
                    })
                }
            })
        }
    }
    //刪除單筆以及多筆資料
    deleteOrderProduct(req, res, next) {
        const token = req.headers['token'];

        if(check.checkNull(token) === true) {
            res.json({
                status: 'token為空。',
                err: '請輸入token'
            })
        } else if (check.checkNull(token) === false) {
            verify(token).then(tokenResult => {
                if(tokenResult === false) {
                    res.json({
                        result: {
                            status: 'token錯誤。',
                            err: '請重新登入。'
                        }
                    })
                } else {
                    // 取得欲刪除的資料
                    const orderID = req.body.orderID;
                    const memberID = tokenResult;

                    // 防呆處理
                    const productID = req.body.productID.replace(" ","");
                    const splitProductID = productID.split(',');

                    let deleteList = [];

                    for(let i = 0; i < splitProductID.length; i++)
                        deleteList.push({orderID: orderID, memberID: memberID, productID: splitProductID[i]})

                    deleteOrderData(deleteList).then(result => {
                        res.json({
                            result: result
                        })
                    }, (err) => {
                        res.json({
                            result: err
                        })
                    })
                }
            })
        }
    }
    //新增單筆訂單
    postOrderOneProduct(req, res, next) {
        const token = req.headers['token'];

        if(check.checkNull(token) === true) {
            res.json({
                err: '請輸入token'
            })
        } else if(check.checkNull(token) === false) {
            verify(token).then(tokenResult => {
                if(tokenResult === false) {
                    res.json({
                        result: {
                            status: 'token錯誤。',
                            err: '請重新登入。'
                        }
                    })
                } else {
                    const memberID = tokenResult;
                    const orderOneList = {
                        orderID: req.body.orderID,
                        memberID: memberID,
                        productID: req.body.productID,
                        quantity: req.body.quantity,
                        createDate: onTime()
                    }
                    orderOneProductData(orderOneList).then(result => {
                        res.json({
                            result: result
                        })
                    }, (err) => {
                        res.json({
                            result: err
                        })
                    })
                }
            })
        }
    }
    putProductComplete(req, res, next) {
        const token = req.headers['token'];
        if(check.checkNull(token) === true){
            res.json({
                err: '請輸入token。'
            })
        } else if (check.checkNull(token) === false){
            verify(token).then(tokenResult => {
                if(tokenResult === false) {
                    res.json({
                        result: {
                            status: 'token錯誤。',
                            err: '請重新登入。'
                        }
                    })
                } else {
                    const memberID = tokenResult;
                    const orderID = req.body.orderID;

                    orderComplete(orderID, memberID).then(result => {
                        res.json({
                            result: result
                        })
                    }, (err) => {
                        res.json({
                            result: err
                        })
                    })
                }
            })
        }
    }
}

const onTime = () => {
    const date = new Date();
    const mm = date.getMonth()+1;
    const dd = date.getDate();
    const hh = date.getHours();
    const mi = date.getMinutes();
    const ss = date.getSeconds();

    return [date.getFullYear(), '-' +
    (mm > 9 ? '' : '0') + mm, '-' +
    (dd > 9 ? '' : '0') + dd, '-' +
    (hh > 9 ? '' : '0') + hh, '-' +
    (mi > 9 ? '' : '0') + mi, '-' +
    (ss > 9 ? '' : '0') + ss
    ].join('');
}