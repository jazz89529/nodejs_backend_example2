const db = require('../connection_db');

module.exports = function orderProductListData(orderList) {
    //訂購整筆商品
    let result = {};

    return new Promise(async (resolve, reject) => {

        let orderID = await getOrderID() + 1;
        const products = orderList.productID;
        console.log('products: ', products);
        const productArray = products.split(',');
        console.log('productArray: ', productArray);
        const quantitys = orderList.quantity;
        console.log('quantitys: ', quantitys);
        const quantityArray = quantitys.split(',');
        console.log('quantityArray: ', quantityArray);

        //productID與quantity合併成新object
        //array1 [3, 2, 1]
        //array2 [1, 2, 3]
        //merge為object:{
        //  3: 1,
        //  2: 2,
        //  1, 3
        //}

        let productQuantity = {};
        for (let i in productArray) {
            let index = productArray.indexOf(productArray[i]);
            for (let j in quantityArray) {
                productQuantity[productArray[i]] = quantityArray[index];
            }
        }
        console.log('productQuantity', productQuantity);

        let orderAllData = [];
        console.log('這裡是測試: ', productQuantity);
        for (let key in productQuantity) {
            const price = await (getProductPrice(key));
            const orderData = {
                order_id: orderID,
                member_id: orderList.memberID,
                product_id: key,
                order_quantity: parseInt(productQuantity[key]),
                order_price: parseInt(price) * parseInt(productQuantity[key]),
                order_date: orderList.orderDate,
                is_complete: 0
            }

            db.query('insert into order_list set ?', orderData, function(err, rows) {
                if(err) {
                    console.log(err);
                    result.err = '伺服器錯誤，請稍候在試試。';
                    reject(result);
                    return;
                }
            })
            orderAllData.push(orderData);
        }
        result.state = '訂單建立成功。';
        result.orderData = orderAllData;
        resolve(result);
    })
}

const getOrderID = () => {
    return new Promise((resolve, reject) => {
        db.query('select max(order_id) as id from order_list', function(err, rows, fields) {
            if(err) {
                console.log(err);
                reject(err);
                return;
            }
            resolve(rows[0].id);
        })
    })
}

const getProductPrice = (productID) => {
    return new Promise((resolve, reject) => {
        db.query('select price from product where id = ?', productID, function(err, rows) {
            if(err) {
                console.log(err);
                reject(err);
                return;
            }
            resolve(rows[0].price);
        })
    })
}