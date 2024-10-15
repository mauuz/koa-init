const requests = require('../../db/request/index')
class SearchService{
    async searchInStorage(queryObj,cookie) {
        const {
            goodsID,
            sortID,
            description,
            storageLocation,
            page,
            start
        } = queryObj;

        try {
            const requestData = {
                goodsID: goodsID || '',
                sortID: sortID || '',
                description: description || '',
                storageLocation: storageLocation || '',
                page: page || 1,
                start: start || 0
            };
            // 使用 POST 请求，requestData 会作为请求体发送
            const response = await requests.post('/control/findByGoodsStorageExtEvent', requestData,{
                headers: {
                    Cookie: cookie// 在这里添加 Cookie
                }
            });
            return response.data;
        } catch (error) {
            console.error('搜索错误:', error);
            return Promise.reject(error)
        }
    }

}

module.exports = new SearchService()
// async function test (){
//     const instance = new SearchService();
//     return await instance.searchInStorage({
//         description:'苍蝇',
//     })
// }
// test().then((r)=>{
//     console.log(r);
// })