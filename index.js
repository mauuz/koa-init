const {app} = require('./app')
//读取.env 中的内容
const {APP_PORT} = require('./src/config')

app.listen(APP_PORT,()=>{
    console.log(`listening at http://localhost:${APP_PORT}`)
})