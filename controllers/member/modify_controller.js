const jwt = require('jsonwebtoken');
const formidable = require('formidable');
const fs = require('fs');
const registerAction = require('../../models/member/register_model');
const Check = require('../../service/member_check');
const encryption = require('../../models/member/encryption');
const loginAction = require('../../models/member/login_model');
const verify = require('../../models/member/verification_model');
const updateAction = require('../../models/member/update_model');

let check = new Check();

module.exports = class Member {
    postRegister(req, res, next){

        const password = encryption(req.body.password);

        //get client's data
        const memberData = {
            name: req.body.name,
            email: req.body.email,
            password: password,
            create_date: onTime()
        }

        const checkEmail = check.checkEmail(memberData.email);
        if(checkEmail == false) {
            res.json({
                result: {
                    status: '註冊失敗。',
                    err: '請輸入正確的Email格式'
                }
            })
        } else if (checkEmail == true) {
            //store data into DB
            registerAction(memberData).then(result => {
                // if successful
                res.json({
                    status: '註冊成功',
                    result: result
                })
            }, (err) => {
                // if error
                res.json({
                    result: err
                })
            })
        }
    }

    postLogin(req, res, next) {

        const password = encryption(req.body.password);

        //get client's data
        const memberData = {
            email: req.body.email,
            password: password,
        }

        loginAction(memberData).then(rows => {
            if(check.checkNull(rows) === true) {
                res.json({
                    result: {
                        status: '登入失敗。',
                        err: '請輸入正確的帳號或密碼。'
                    }
                })
            }else if(check.checkNull(rows) === false) {
                //產生Token
                const token = jwt.sign({
                    algorithm: 'HS256',
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),//Token設為一個小時
                    data: rows[0].id
                }, 'secret');

                res.setHeader('token', token);
                res.json({
                    result: {
                        status: '登入成功。',
                        loginMember: '歡迎' + rows[0].name + ' 的登入'
                    }
                })
            }
        })
    }

    putUpdate(req, res, next) {
        const token = req.headers['token'];
        //確定token是否有輸入
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
                    const id = tokenResult;
                    //進行加密
                    const password = encryption(req.body.password);
                    const memberUpdateData = {
                        name: req.body.name,
                        password: password,
                        update_date: onTime()
                    }
                    updateAction(id, memberUpdateData).then(result => {
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

    putUpdateImg(req, res, next) {
        const form = new formidable.IncomingForm();

        const token = req.headers['token'];
        if(check.checkNull(token) === true) {
            res.json({
                err: '請輸入token。'
            })
        } else if (check.checkNull(token) === false) {
            verify(token).then(tokenResult => {
                if(tokenResult === false) {
                    res.json({
                        result: {
                            status: 'token錯誤。',
                            err: '請重新登入'
                        }
                    })
                } else {
                    form.parse(req, async function(err, fields, files) {
                        if(check.checkFileSize(files.file.size) === true) {
                            res.json({
                                result: {
                                    status: "上傳檔案失敗。",
                                    err: '請上傳小於1MB的檔案。'
                                }
                            })
                            return;
                        }
                        if(check.checkFileType(files.file.type) === true) {
                            const image = await fileToBase64(files.file.path);
                            const id = tokenResult;
                            const password = encryption(fields.password);

                            const memberUpdateData = {
                                img: image,
                                name: fields.name,
                                password: password,
                                update_date: onTime()
                            }

                            updateAction(id, memberUpdateData).then(result => {
                                res.json({
                                    result: result,
                                })
                            }, (err) => {
                                res.json({
                                    result: err
                                })
                            })

                        } else {
                            res.json({
                                result: {
                                    status: "上傳檔案失敗。",
                                    err: '請選擇正確的檔案格式，例如jpg, jpeg, png等。'
                                }
                            })
                            return;
                        }
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

const fileToBase64 = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'base64', function(err, data) {
            resolve(data);
        })
    })
}