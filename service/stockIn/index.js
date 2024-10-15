const requests = require('../../db/request/index');
// const fs = require('fs');
// const path = require('path');
const cheerio = require('cheerio');
const axios = require('axios');
const {DMD_MOBILE_URL} = require("../../src/config");
class StockInService{
    searchPurchasesOrder = async (cookie,obj) => {
        try {
            // Destructure the input object and assign default values if fields are not provided
            const {
                beginDate = "",
                endDate = "",
                purchaseID = "",
                deliveryNo = "",
                vessel = "",
                shipName = "",
                companyName = "",
                isTaxPoint = "",
                remark = "",
                state1 = "",
                checker = "",
                operator = "",
                state = "",
                approveStatus = ""
            } = obj;

            // Make the request with the provided or default values
            const response = await requests.post('/control/browsePurchaseNote', {
                "_REMEMBER_REQUEST_": true,
                "command": "query",
                "beginDate": beginDate,
                "endDate": endDate,
                "purchaseID": purchaseID,
                "deliveryNo": deliveryNo,
                "vessel": vessel,
                "shipName": shipName,
                "companyName": companyName,
                "isTaxPoint": isTaxPoint,
                "remark": remark,
                "state1": state1,
                "checker": checker,
                "operator": operator,
                "state": state,
                "approveStatus": approveStatus
            },{
                headers: {
                    Cookie: cookie
                }
            });

            return response.data;

        } catch (error) {
            console.error("Error fetching purchase order:", error);
            return Promise.reject('Error fetching purchase order');
        }
    };
    searchPurchaseSetPage = async (cookie,page)=>{
        try {
            const response = await requests.get('/control/browsePurchaseNote', {
                params: {
                    page_current: page,  // 传递查询参数
                    command: 'setpage'
                },
                headers:{
                    Cookie: cookie
                }

            });
            return response.data;
        }catch (e) {
            console.error("Error fetching purchase order:", e);
            return Promise.reject('Error setting page');
        }
    }
    parseInfo = async(html)=>{
        const $ = cheerio.load(html);

        const rows = $('#table_1 > tbody > tr');
        const data = {
            totalNumber:0,
            totalPage:0,
            purchaseOrderList:[]
        }
        data.totalNumber = $('#mainId > form > div > div > div > div:nth-child(2) > div > table > tbody > tr:nth-child(3) > td > div > div.pageLabel > span:nth-child(2)').text();
        data.totalPage = $('#mainId > form > div > div > div > div:nth-child(2) > div > table > tbody > tr:nth-child(3) > td > div > div.pageLabel > span:nth-child(1)').text();
        rows.each((index, element) => {
            const rowSelector = $(element);
            const rowData = {
                index: rowSelector.find('td:nth-child(2) > div > label').text().trim(),
                purchaseOrderNumber: rowSelector.find('td:nth-child(3) > div > a').text().trim(),
                orderNumber: rowSelector.find('td:nth-child(4) > div > a').text().trim(),
                accountingNumber: rowSelector.find('td:nth-child(5) > div > label').text().trim(),
                shipName: rowSelector.find('td:nth-child(6) > div > label').text().trim(),
                creator: rowSelector.find('td:nth-child(7) > div > label').text().trim(),
                customerShortName: rowSelector.find('td:nth-child(8) > div > label').text().trim(),
                supplierShortName: rowSelector.find('td:nth-child(9) > div > a').text().trim(),
                supplierFullName: rowSelector.find('td:nth-child(10) > div > label').text().trim(),
                settlementAmount: rowSelector.find('td:nth-child(11) > div').text().trim(),
                shipped: rowSelector.find('td:nth-child(12) > div > label').text().trim(),
                received: rowSelector.find('td:nth-child(13) > div').text().trim(),
                status: rowSelector.find('td:nth-child(14) > div > label').text().trim(),
                approvalStatus: rowSelector.find('td:nth-child(15) > div > label').text().trim(),
                creationDate: rowSelector.find('td:nth-child(16) > div > label').text().trim(),
                reviewer: rowSelector.find('td:nth-child(17) > div > label').text().trim(),
                reviewDate: rowSelector.find('td:nth-child(18) > div > label').text().trim(),
                remark: rowSelector.find('td:nth-child(19) > div > label').text().trim(),
                purpose: rowSelector.find('td:nth-child(20) > div').text().trim(),
                contactPhone: rowSelector.find('td:nth-child(21) > div > label').text().trim(),
                contactPerson: rowSelector.find('td:nth-child(22) > div > label').text().trim(),
                lastModifiedBy: rowSelector.find('td:nth-child(23) > div > label').text().trim(),
                lastModifiedDate: rowSelector.find('td:nth-child(24) > div > label').text().trim(),
            };

            // 把这一行的数据添加到数组中
            data.purchaseOrderList.push(rowData);
        });
        return data;
    }
    /***
     *
     * json
     * **/
    getPurchaseOrderDetailGoodList = async (cookie,purchaseID)=>{
        try {
            const response = await requests.post('/control/findByPurchaseDetailByCheckExtEvent', {
                purchaseID:purchaseID,
                start:0
            },{
                headers: {
                    Cookie: cookie
                }
            });

            return response.data;

        } catch (error) {
            console.error("Error fetching purchase order:", error);
            return Promise.reject('Error fetching purchase order');
        }
    }

    /**
     *
     * detailGoodArray 自定义的id，采购单收获细则里面可以看到
     * 设定数量需要先清空一次，取消收获，不然他后台会计算出错
     * const { token, userId, purchaseID, detailGoodArrayId, receivedAmount, restAmount } = obj;
     * **/
    receivedDetailedGood = async (obj) => {
        try {
            // // axios.interceptors.request.use(async request => {
            // //     request.headers['Authorization'] = `Bearer ${token}`
            // // })
            const { token, userId, purchaseID, detailGoodArrayId, receivedAmount, restAmount } = obj;
            // // 打印 token 以确保它正确传递
            // console.log('Token being sent:', token);
            //
            console.log(token, userId, purchaseID, detailGoodArrayId, receivedAmount, restAmount)
            const response = await axios.post(`${DMD_MOBILE_URL}/api/open/biz/purchaseNote/receivePurchaseNoteDetail.json`, {
                "purchaseID": purchaseID,
                "doDetailNoList": [
                    {
                        "doDetailNo": detailGoodArrayId,
                        "amountUnReceive": restAmount,
                        "amountReceive": receivedAmount,
                        "purchaseID": purchaseID,
                    }
                ],
                "bizCode": "suriti",
                "userID": userId,
                "partyID": userId,
                "dataFrom": "app"
            },
                {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                }
                );
            //{ code: '-1', msg: '登录状态已失效，请重新登录！' }
            return response.data;


        } catch (error) {
            console.error('Error setting received good number:', error);
            return Promise.reject('Error setting received good number');
        }
    };


    cancelDetailedGood = async (cookie,purchaseID,detailGoodArrayId)=>{
        try {
            const response = await requests.post('/control/findByPurchaseDetailByCheckExtEvent', {
                purchaseID:purchaseID,
                start:0
            },{
                headers: {
                    Cookie: cookie
                }
            });

            return response.data;

        } catch (error) {
            console.error("Error fetching purchase order:", error);
            return Promise.reject('Error fetching purchase order');
        }
    }

    stockInGood = async (cookie,purchaseID)=>{
        try {
            const response = await requests.post('/control/createGoodsDeposit', {
                purchaseID:purchaseID
            },{
                headers: {
                    Cookie: cookie
                }
            });
            const parser = await this.stockInGoodStatusParser(response.data);
            if(parser)return Promise.reject(parser);
            return 'OK';
        } catch (error) {
            console.error("Error fetching purchase order:", error);
            return Promise.reject('Error fetching purchase order');
        }
    }

    //stock in return info
    stockInGoodStatusParser = async (html) => {
        const $ = cheerio.load(html);
        const alertText = $('div.alert.alert-error').text();
        return alertText.trim();
    };

    checkIfStockIn = async (cookies,purchaseID)=>{

    }

}
module.exports = new StockInService();

// async function test (){
//     const instance = new StockInService();
//     try {
//         // const result = await instance.searchPurchasesOrder('JSESSIONID=F48768A8A6571B94BF44F21B884BBBCE; root.autoUserLoginId=097',{
//         //     purchaseID:'2428'
//         // });
//         // searchPurchaseSetPage
//
//         // const result = await instance.searchPurchaseSetPage('remember=true; root.autoUserLoginId="097 "; JSESSIONID=604F557EE4DA215F16506D99E019D38C',9);
//         // return await instance.parseInfo(result);
//         // const filePath = path.join(__dirname, 'stock.html'); // 获取 stock.html 文件的路径
//         // const fileContent = await fs.promises.readFile(filePath, 'utf-8'); // 异步读取文件内容，指定编码为 utf-8
//         // return await instance.parseInfo(fileContent);
//
//         //const result = await instance.getPurchaseOrderDetailGoodList("remember=true; root.autoUserLoginId=097; JSESSIONID=604F557EE4DA215F16506D99E019D38C","SUP-2428669")
//
//         // const result = await instance.receivedDetailedGood(
//         //     {
//         //         token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyQ05hbWUiOiLlj7blu7rpmYciLCJiaXpDb2RlIjoic3VyaXRpIwiZGVwdElEIjoiMjIyMiIsInVzZXJJRCI6IjA5NyIsImlhdCI6MTcyODkxNTQ0Nn0.jOjtFF057etLuXG7DyukK3hTge5ORHVMMgq6UGjH1n8',
//         //         "purchaseID": "SUP-2428669",
//         //         detailGoodArrayId:"PO00009493",
//         //         receivedAmount:7,
//         //         restAmount:3,
//         //         bizCode: "suriti",
//         //         userId: "097",
//         //         partyId: "097",
//         //         dataFrom: "app"
//         //     });
//
//         const result = await instance.stockInGood('JSESSIONID=7E7DAE2F5C90816D26441014557B5116; root.autoUserLoginId=097','SUP-2428669');
//         return result;
//     } catch (error) {
//         console.error('Error reading stock.html:', error);
//     }
//
//     // return await instance.searchPurchasesOrder('JSESSIONID=44857429101090E41A49EB9D5E0EABCC; root.autoUserLoginId=097',{
//     //     purchaseID:'123'
//     // });
// }
// test().then(r=>console.log(r));
