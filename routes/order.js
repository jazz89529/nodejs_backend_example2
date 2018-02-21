var express = require('express');
var router = express.Router();

const OrderGetMethod = require('../controllers/order/get_controller');
const OrderModifyMethod = require('../controllers/order/modify_controller');

let orderGetMethod = new OrderGetMethod()
let orderModifyMethod = new OrderModifyMethod();

router.get('/order', orderGetMethod.getAllOrder);

router.get('/order/member', orderGetMethod.getOneOrder);

router.post('/order', orderModifyMethod.postOrderAllProduct);

router.put('/order', orderModifyMethod.updateOrderProduct);

module.exports = router;
