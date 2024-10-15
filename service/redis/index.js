const {redisAuthClient} = require("../../db/redis");
const { v4: uuidv4 } = require('uuid');
class Redis {
    /***
     * 多麦德
     * ***/
    async saveToken(obj){
        const {userId, cookies} = obj;
        try {
            // Create a key for Redis
            const key = `DMDuser:${userId}`; // For example, key format could be user:097

            await redisAuthClient.setex(key, 600, cookies);
            return 'OK'
        } catch (error) {
            return Promise.reject("Fail to save in db")
        }
    }
    async readToken(userId){
        try {
            // Create the key based on the userId
            const key = `DMDuser:${userId}`; // Example key format could be user:097

            const cookies = await redisAuthClient.get(key);

            if (cookies) {
                return cookies; // Return the cookies if found
            } else {
                return Promise.reject('User not found');
            }
        } catch (error) {
            return Promise.reject('Fail to get db')
        }
    }
    // async deleteToken(userId) {
    //     try {
    //         const key = `user:${userId}`;
    //         await redisAuthClient.del(key);
    //         return 'OK';
    //     } catch (error) {
    //         console.error("Failed to delete token from db", error);
    //         throw error;
    //     }
    // }

    /***
     *
     *   //my login
     * ***/
    async saveUserAndPsw(userId,psw){
        try {
            const key = `user:${userId}`;
            await redisAuthClient.set(key,psw);
            return 'OK'
        } catch (error) {
            return Promise.reject("Fail to save in db")
        }
    }
    async readUserPsw(userId){
        try {
            const key = `user:${userId}`;
            return  await redisAuthClient.get(key);
        } catch (error) {
            return Promise.reject("Fail to get user psw")
        }
    }

    //create token
    async createToken() {
        return uuidv4();
    }

    //my token
    async saveMyToken(userId,token){
        try {
            const key = `userToken:${userId}`;

            //delete previous token
            const preToken = await redisAuthClient.get(key);
            await redisAuthClient.del(preToken);
            await redisAuthClient.set(key,token);
            await redisAuthClient.set(token,key);
            return 'OK'
        } catch (error) {
            return Promise.reject("Fail to save in db")
        }
    }

    async getMyToken(userId){
        try {
            const key = `userToken:${userId}`;
            return await redisAuthClient.get(key);
        } catch (error) {
            return Promise.reject("Fail to save in db")
        }
    }

    //token to userId
    async getUserIdFromToken(token){
        try {
            const user = await redisAuthClient.get(token);
            console.log(token,user);
            if(!user)return Promise.reject('token not available');
            return user.split(':')[1]
        } catch (error) {
            return Promise.reject("Fail to get userId")
        }
    }

    async deleteMyToken (token){
        try {
            const key = await redisAuthClient.get(token);
            await redisAuthClient.del(token);
            await redisAuthClient.del(key);
            return 'OK'
        } catch (error) {
            return Promise.reject("Fail to delete token in db")
        }
    }

    /**
     * mobile login
     *
     *
     * **/
    async saveDMMobileToken (obj){
        const {userId, token} = obj;
        try {
            // Create a key for Redis
            const key = `DMDMobileUser:${userId}`;
            await redisAuthClient.setex(key, 600, token);
            return 'OK'
        } catch (error) {
            return Promise.reject("Fail to save in db")
        }
    }

    async readDMMobileToken (userId){
        try {
            // Create the key based on the userId
            const key = `DMDMobileUser:${userId}`; // Example key format could be user:097

            const cookies = await redisAuthClient.get(key);

            if (cookies) {
                return cookies; // Return the cookies if found
            } else {
                return Promise.reject('User not found');
            }
        } catch (error) {
            return Promise.reject('Fail to get db')
        }
    }
    async deleteDMToken(userId) {
        try {
            const key = `DMDMobileUser:${userId}`;
            await redisAuthClient.del(key);
            return 'OK';
        } catch (error) {
            console.error("Failed to delete token from db", error);
            throw error;
        }
    }
}
module.exports = new Redis()
// async function test(){
//     const instance = new Redis();
//     return await instance.readDMMobileToken('097');
// }
// test().then((r)=>{
//     console.log(r)
// })