const requests = require('../../db/request')
const {saveToken,createToken,saveMyToken,saveUserAndPsw,deleteMyToken,getUserIdFromToken,readToken,readUserPsw,saveDMMobileToken} = require('../../service/redis')
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const {DMD_MOBILE_URL} = require('../../src/config');
class LoginService{
    /***
     * 多麦德
     *
     * ***/

    dmLogin = async (userId,psw)=>{
        try {
            const response = await requests.post('/control/login', null, {
                params: {
                    type: 'user',
                    USERNAME: userId,
                    PASSWORD: psw,
                    remember: 'on'
                }
            });
            //console.log(response)
            const setCookie = response.headers['set-cookie'];
            if (setCookie) {
                const cookie = setCookie.map(c => c.split(';')[0]).join('; ');
                const match = cookie.match(/root\.autoUserLoginId=(\d+)/);
                if (match && match[1]) {
                    const extractedNumber = match[1];
                    const userObj = {
                        userId:extractedNumber,
                        cookies:cookie
                    };
                    await saveToken(userObj);
                    return userObj;
                } else {
                    //fail
                    return Promise.reject(new Error('wrong password'))
                }

            } else {
                return Promise.reject(new Error('No cookies'))
            }

        } catch (error) {
            return Promise.reject(new Error(error))
        }
    }

    /**
     *
     * return userId, userName
     * **/
    dmMobileLogin = async (userId, psw) => {
        try {
            // 发送 POST 请求
            const response = await axios.post(`${DMD_MOBILE_URL}/api/open/biz/oauth/userLogin.json`, {
                bizCode: 'suriti',
                companyCode: 'suriti',
                userID: userId,     // 用户ID
                password: psw,      // 密码
                deptID: '',         // 其它参数留空
                partyID: '',
                partyCName: '',
                dataFrom: 'app'     // 数据来源为'app'
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(response.data.code === '-1')return Promise.reject('wrong psw');
            console.log(response.data.data.token)
            //save data.userMap.userCName
            await saveDMMobileToken({
                userId:userId,
                token:response.data.data.token
            })
            return {
                userId,
                userName:response.data.data.userMap.userCName
            }


        } catch (error) {
            console.error('Error during login:', error);
            return Promise.reject('wrong psw');
        }
    };
    login = async (userId,psw) =>{
        try {
            await this.dmLogin(userId,psw);
            const result = await this.dmMobileLogin(userId,psw);
            await saveUserAndPsw(userId,psw);
            const token = await createToken();
            await saveMyToken(userId,token);
            return {
                ...result,
                token
            };
        }catch (e) {
            console.log(e)
            return Promise.reject('wrong password');
        }
    }
    //check my token then check DMD token,if expired then login DMD automatic

    logout = async (token)=> {
        try {
            await deleteMyToken(token);
            return 'OK'
        }catch (e) {
            return Promise.reject(e);
        }
    }

}

module.exports = new LoginService();
// async function testLogin() {
//     const loginInstance = new LoginService(); // Create an instance of the Login class
//     return await loginInstance.dmMobileLogin("097",'5ABF');       // Call the login method
// }
// //
// // // Call the function to test it
// testLogin().then(r => console.log(r)).catch((e)=>{
//     console.log(e);
// });