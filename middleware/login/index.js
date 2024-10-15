
const {getUserIdFromToken, readToken, readUserPsw,readDMMobileToken} = require("../../service/redis");
const {dmLogin,dmMobileLogin} = require('../../service/login')
const checkAuth = async(ctx,next)=> {
    try {
        const authorization = ctx.headers.token;
        if (!authorization) {
            console.log('no header')
            ctx.status = 401;
            ctx.body = {status: 'fail', msg: 'auth error'}
            return ;
        };
        try {
            const userId = await getUserIdFromToken(authorization);
            //pc DMD
            try {
                await readToken(userId);
            } catch (e) {
                await dmLogin(userId, await readUserPsw(userId));
            }
            //mobile DMD
            try {
               await readDMMobileToken(userId);
            }catch (e) {
                await  dmMobileLogin(userId,await readUserPsw(userId));
            }
            ctx.state.userId = userId;
            ctx.state.DMDToken = await readToken(userId);
            await next();
        }catch (e) {
            console.log(112,e);
            ctx.status = 401;
            ctx.body = { status: 'fail', msg: 'token is not available' };
        }

    } catch (e) {
        ctx.status = 401;
        ctx.body = { status: 'fail', msg: e};
    }
}
module.exports = {
    checkAuth
}
