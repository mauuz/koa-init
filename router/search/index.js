const Router = require('koa-router')
const searchRouter = new Router({prefix:'/search'});
const {checkAuth} = require('../../middleware/login');
const {searchGoods} = require('../../controller/search');
searchRouter.get('/',checkAuth,searchGoods);
module.exports = {searchRouter}