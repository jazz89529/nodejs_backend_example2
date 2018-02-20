const Check = require('../../service/member_check');
const verify = require('../../models/member/verification_model');
const orderData = require('../../models/order/all_order_model');

let check = new Check();

module.exports = class GetOrder {
    getAllOrder(req, res, next) {
        const token = req.headers['token'];
        if(check.checkNull(token) === true) {
            res.json({
                err: '請輸入token。'
            })
        } else if(check.checkNull(token) === false) {
            verify(token).then(tokenResult => {
                if(tokenResult === false) {
                    res.json({
                        status: 'token錯誤。',
                        err: '請重新登入。'
                    })
                } else {
                    orderData().then(result => {
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