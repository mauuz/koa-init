const requests = require('../../db/request');
const {saveToken,createToken,saveMyToken,saveUserAndPsw,deleteMyToken,getUserIdFromToken,readToken,readUserPsw} = require('../../service/redis');
const moment = require('moment');

class Print {
    /**
     * 库存管理打印
     * goodAmount和采购订单数量挂钩，和请求的printAmountArr无关
     * **/
    printStorageGoods = async (goodId,cookie,printNum,goodNum,remarks="")=>{
        try {
            const requestData = {
                goodsID: goodId ,
            };
            const goodsPost = await requests.post('/control/findByGoodsStorageExtEvent', requestData,{
                headers: {
                    Cookie: cookie
                }
            });

            if(goodsPost.data.success === 'false')return Promise.reject('wrong goood ID');
            const goodDetail = goodsPost.data.rs[0];
            //first check
            const buyOrderListRes = await requests.post('/control/findByPurchaseDetailByCheckExtEvent', {
                purchaseID:'SUP-2428529',
                start:0
            },{
                headers: {
                    Cookie: cookie
                }
            });
            const buyOrderList = buyOrderListRes.data.rs;
            const matchingOrder = buyOrderList.find(order => order.GOODSID === goodDetail.GOODSID);

            if (matchingOrder) {
                //delete
                const deleteOrder = await requests.post('/control/removeGoodsPurchaseExtEvent', {
                        purchaseID:'SUP-2428529',
                        poDetailNo:matchingOrder.DODETAILNO
                    }
                    ,{
                        headers: {
                            Cookie: cookie
                        }
                    });
                if(deleteOrder.data.success === 'false')return Promise.reject('fail to delete order list');

            }
            //create
            const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
            const addOrderList = await requests.post('/control/createGoodsPurchaseExtEvent', {
                    "seq": 1,
                    "goodsID": goodDetail.GOODSID,
                    "description": goodDetail.DESCRIPTION,
                    "edescription": goodDetail.EDESCRIPTION,
                    "amount": goodNum,
                    "unitformid-inputEl": 1,
                    "unit": goodDetail.UNIT,
                    "sellPrice": goodDetail.AVERAGEPRICE,
                    "remark": `${remarks} ${currentDate}`,
                    "purchaseID": "SUP-2428529",
                    "language": "中文"
                }
                ,{
                    headers: {
                        Cookie: cookie
                    }
                });
            if(addOrderList.data.success === 'false')return Promise.reject('fail to create order list');

            //get order list
            const newBuyOrderListRes = await requests.post('/control/findByPurchaseDetailByCheckExtEvent', {
                purchaseID:'SUP-2428529',
                start:0
            },{
                headers: {
                    Cookie: cookie
                }
            });
            const newBuyOrderList = newBuyOrderListRes.data.rs;
            const newMatchingOrder = newBuyOrderList.find(order => order.GOODSID === goodId);
            //console.log(newMatchingOrder.DODETAILNO);

            for (let i = 0; i < printNum;i++){
                await this.printFromDMDPurchase(newMatchingOrder.DODETAILNO,goodNum,cookie);
            }
            return 'OK';

        } catch (error) {
            console.error('打印失败');
            return Promise.reject('打印失败')
        }

    }

    printFromDMDPurchase = async (doDetailNo,goodAmount,cookie)=>{
        try {
            const printResponse = await requests.post('control/printPurchaseNoteDetailExtEvent', {
                purchaseIDArr:'SUP-2428529',
                doDetailNoArr:doDetailNo,
                printAmountArr:goodAmount,
                printPageArr:1
            },{
                headers: {
                    Cookie: cookie
                }
            });
            if(printResponse.data.success !== "true")return Promise.reject('fail to print');
            return 'OK';
        }catch (e) {
            return Promise.reject('fail to print:'+e);
        }
    }


}
module.exports = new Print();
// async function test(){
//     const instance = new Print();
//     return await instance.printStorageGoods('110902','JSESSIONID=825E3D037A7EF1751BAD5065ED733924; root.autoUserLoginId=097; root.autoUserLoginId=097',1,1010,'test');
// }
// test().then(r=>{
//     console.log(r);
// })