const {login,logout} = require('../../service/login')
const {createResponse} = require("../../response");
class LoginController{
    async myLogin(ctx,next){
        try {
            const {userId,psw} = ctx.request.body;
            ctx.body = createResponse('success',await login(userId,psw));

        }catch (e) {
            console.log(e)

            ctx.body = createResponse('fail',e)
        }
    }

    async logout(ctx,next){
        try {
            const {authorization} = ctx.headers;
            await logout(authorization);
            ctx.body = {status:'success',msg:'success'};
        }catch (e) {
            ctx.body = {status:'fail',msg:e};
        }

    }
}

module.exports = new LoginController();