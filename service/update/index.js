const requests = require('../../db/request')
class UpdateService{
    async updateStorage(queryObj,cookie) {
        const {
            goodsID,
            goodsIDHidden,
            unit,
            description,
            edescription,
            sellPrice,
            minStorage,
            storageLocation,
            deliveryTime,
        } = queryObj;

        try {
            // 创建一个新的请求对象，并检查每个字段是否为空
            const requestData = {
                goodsID: goodsID || '',
                goodsIDHidden: goodsIDHidden || '',
                unit: unit || '',
                description: description || '',
                edescription: edescription || '',
                sellPrice: sellPrice || '',
                minStorage: minStorage || '',
                storageLocation: storageLocation || '',
                deliveryTime: deliveryTime || '',
            };

            // 发送 POST 请求
            const response = await requests.post('/control/updateGoodsStorageExtEvent', requestData, {
                headers: {
                    Cookie: cookie// 在这里添加 Cookie
                }
            });

            // 返回服务器的响应数据
            return response.data;
        } catch (error) {
            console.error('搜索存储错误:', error);
            throw error;
        }
    }



}

module.exports = new UpdateService()
// async function test(){
//     const intstance = new UpdateService();
//     return await intstance.updateStorage({
//             "goodsID": "011619",
//             "goodsIDHidden": "011619",
//             "unit": "袋",
//             "description": "苍蝇贴纸 10张/袋",
//             "edescription": "10 fly stickers per bag",
//             "sellPrice": "",
//             "minStorage": 10.00,
//             "storageLocation": "A23",
//             "deliveryTime": ""
//         }
//     )
// }
// test().then(r=>{
//     console.log(r)
// });