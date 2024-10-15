const Router = require('koa-router')
const updateRouter = new Router({prefix:'/update'});
const {updateGoodDetail} = require('../../controller/update');
const {checkAuth} = require('../../middleware/login')
updateRouter.post('/', checkAuth,updateGoodDetail);
module.exports = {updateRouter}