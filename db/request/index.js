const axios = require('axios');
// const { deleteMyToken } = require('../../service/redis');
const cheerio = require('cheerio');
// 创建 axios 实例
const request = axios.create({
    baseURL: 'http://suriti.duomaide.com/', // 基础 URL
    timeout: 5000,
    withCredentials: true // 允许携带 cookie
});

// 请求拦截器
request.interceptors.request.use(
    async (config) => {
        config.headers['Content-Type'] = "application/x-www-form-urlencoded; charset=UTF-8"
        // if(config.url !=='/control/login'){
        //     try {
        //         //const token = await readToken('097'); // 从 Redis 获取 token
        //         // if (!token) {
        //         //     throw new Error('No token found, please login'); // 没有 token 直接抛出错误
        //         // }
        //         //config.headers['Cookie'] = token;
        //     } catch (e) {
        //         console.error("Token error:", e.message || e);
        //         return Promise.reject(e); // 直接中断请求并抛出错误
        //     }
        //
        // }
        //console.log(config.headers)
        return config;
    },
    (error) => {
        console.error("请求错误", error);
        return Promise.reject(error);
    }
);


request.interceptors.response.use(
    async (response) => {
        try {
            const data = response.data;
            const ERROR_LOGIN_REQUIRED = 'Login required or failed';
            const ERROR_TOKEN_EXPIRED = 'Token expired';

            if (typeof data === 'object') return response;

            // 检查是否是登录页面，并判断是否需要输入登录信息
            if (response.config.url === '/control/login') {
                const $ = cheerio.load(data);
                const promptText = $('body > form > div > div > div.inputBox > div.prompt > span').text().trim();
                console.log('login'+promptText)
                if (promptText) {
                    return Promise.reject(new Error(`${ERROR_LOGIN_REQUIRED}: ${promptText}`));
                }
            }else {
                const $ = cheerio.load(data);
                if ($('#userName').length > 0) {
                    return Promise.reject(new Error(ERROR_TOKEN_EXPIRED));
                }
            }
            return response;

        } catch (error) {
            console.log('request error:'+error);
            return Promise.reject(new Error('Token expired, please login again'));
        }
    },
    (error) => {
        // Handle response errors
        console.error('Response error:', error.message || error);
        return Promise.reject(error);
    }
);


module.exports = request;
