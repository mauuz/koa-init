const Router = require('koa-router')
const printRouter = new Router({prefix:'/print'});
const {checkAuth} = require('../../middleware/login');
const {printGoodsLabel} = require('../../controller/print')
printRouter.get('/',checkAuth,printGoodsLabel);
module.exports = {printRouter}