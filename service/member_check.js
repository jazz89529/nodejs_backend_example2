module.exports = class CheckCustomer {
    //判斷email 格式
    checkEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const result = re.test(email);
        return result;
    }
    checkNull(data) {
        for(var key in data){
            //不為空
            return false;
        }
        //為空
        return true;
    }
    checkFileSize(fileSize) {
        let maxSize = 1 * 1024 * 1024; // 1MB
        if(fileSize > maxSize) {
            return true;
        }
        return false;
    }
    checkFileType(fileType) {
        if(fileType === 'image/png' || fileType === 'image/jpg' || fileType === 'image/jpeg') {
            return true;
        }
        return false;
    }
}