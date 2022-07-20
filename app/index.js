const koa = require('koa')
const KoaBody = require('koa-body')
//路由注册
const { indexRouter} = require('../router/helloworld')
const app = new koa()

//中间件注册
app.use(KoaBody())
//注册路由
app.use(indexRouter.routes())
app.on('error',(err,ctx)=>{
    console.log(ctx)
})
module.exports = {app}