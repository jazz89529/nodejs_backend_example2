const jwt = require('jsonwebtoken');
const config = require('../../config/development_config');

//進行token 認證
module.exports = function verifyToken(token) {
    let tokenResult = '';
    const time = Math.floor(Date.now() / 1000);
    return new Promise((resolve, reject) => {
        //判斷token 是否正確
        jwt.verify(token, 'secret', function(err, decoded) {
            if(err) {
                tokenResult = false;
                resolve(tokenResult);
            } else if(decoded.exp <= time) { //token過期判斷
                tokenResult = false;
                resolve(tokenResult);
            } else {
                tokenResult = decoded.data;
                resolve(tokenResult);
            }
        })
    });
}