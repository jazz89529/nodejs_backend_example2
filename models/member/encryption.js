const crypto = require('crypto');

module.exports = function getRePassword(password) {
    //加密password，不要讓他以明碼存入資料庫
    let hashPassword = crypto.createHash('sha1');
    hashPassword.update(password);
    const rePassword = hashPassword.digest('hex');
    return rePassword;
}