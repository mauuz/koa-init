const {redisAuthClient} = require("../../db/redis");
class Redis {
    async saveToken(obj){
        const {userId, cookies} = obj;
        try {
            // Create a key for Redis
            const key = `user:${userId}`; // For example, key format could be user:097

            await redisAuthClient.setex(key, 600, cookies);
            return 'OK'
        } catch (error) {
            return Promise.reject("Fail to save in db")
        }
    }
    async readToken(userId){
        try {
            // Create the key based on the userId
            const key = `user:${userId}`; // Example key format could be user:097

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

    async deleteToken(userId) {
        try {
            const key = `user:${userId}`;
            await redisAuthClient.del(key); // 删除 Redis 中的 token
            return 'OK';
        } catch (error) {
            console.error("Failed to delete token from db", error);
            throw error;
        }
    }

}
module.exports = new Redis()
