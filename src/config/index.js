const dotenv = require('dotenv')
const path = require('path')
dotenv.config({path:path.resolve(__dirname,'../../.env')})
// console.log(process.env.APP_PORT)
module.exports = process.env