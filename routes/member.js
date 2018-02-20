var express = require('express');
var router = express.Router();

const MemberModifyMethod = require('../controllers/member/modify_controller');

let memberModifyMethod = new MemberModifyMethod();

/* GET home page. */
router.post('/member', memberModifyMethod.postRegister); //註冊新會員

router.post('/member/login', memberModifyMethod.postLogin); //會員登入

router.put('/member', memberModifyMethod.putUpdate); //更新會員資料

router.put('/updateimg', memberModifyMethod.putUpdateImg); //更新會員資料(e.g. image)


module.exports = router;
