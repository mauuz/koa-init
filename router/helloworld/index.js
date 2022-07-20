const Router = require('koa-router')
const indexRouter = new Router()
indexRouter.get('/',async (ctx,next)=>{
    ctx.body = 'hello world!'
})
module.exports = {indexRouter}