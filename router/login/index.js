const Router = require('koa-router')
const loginRouter = new Router({prefix:'/login'});
const {myLogin,logout} = require('../../controller/login');
const {checkAuth} = require("../../middleware/login");
// const {searchGoods} = require('../../controller/login');
loginRouter.post('/',myLogin);
//logout
loginRouter.post('/logout',checkAuth,logout);
module.exports = {loginRouter}