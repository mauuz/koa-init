const koa = require('koa')
const cors = require('@koa/cors');
const KoaBody = require('koa-body');
//路由注册
const { searchRouter} = require('../router/search');
const { updateRouter} = require('../router/update');
const {loginRouter} = require('../router/login');
const {printRouter} = require('../router/print');
const app = new koa()
app.use(cors(

    // {
    // origin: function(ctx) { //设置允许来自指定域名请求
    //     const whiteList = ['http://localhost:3001']; //可跨域白名单
    //     let url = ctx.header.referer.substr(0, ctx.header.referer.length - 1);
    //     if(whiteList.includes(url)){
    //         return url // 注意，这里域名末尾不能带/，否则不成功，所以在之前我把/通过substr干掉了
    //     }
    //     return 'http://localhost:3001' //默认允许本地请求8080端口可跨域
    // },
    // maxAge: 5, //指定本次预检请求的有效期，单位为秒。
    // credentials: true, //是否允许发送Cookie
    // allowMethods: ['GET', 'POST'], //设置所允许的HTTP请求方法
    // allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
    // exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
// }
))
//中间件注册
app.use(KoaBody());
//注册路由
app.use(searchRouter.routes());
app.use(updateRouter.routes());
app.use(loginRouter.routes());
app.use(printRouter.routes());
app.on('error',(err,ctx)=>{
    console.log(ctx)
})
module.exports = {app}