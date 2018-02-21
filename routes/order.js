var express = require('express');
var router = express.Router();

const OrderGetMethod = require('../controllers/order/get_controller');
const OrderModifyMethod = require('../controllers/order/modify_controller');

let orderGetMethod = new OrderGetMethod()
let orderModifyMethod = new OrderModifyMethod();

router.get('/order', orderGetMethod.getAllOrder);// 取得全部訂單資料

router.get('/order/member', orderGetMethod.getOneOrder);// 取得該會員的訂單資料

router.post('/order', orderModifyMethod.postOrderAllProduct);// 訂多筆

router.put('/order', orderModifyMethod.updateOrderProduct);// 更改單筆訂單資料

router.delete('/order', orderModifyMethod.deleteOrderProduct);// 刪除訂單資料

router.post('/order/addoneproduct', orderModifyMethod.postOrderOneProduct); // 訂單筆

router.put('/order/complete', orderModifyMethod.putProductComplete); // 確認訂單

module.exports = router;
