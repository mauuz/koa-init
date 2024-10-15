const {app} = require('./app')
//读取.env 中的内容
const {APP_PORT} = require('./src/config')
const os = require('os');
// 获取本机的局域网 IP 地址
const getLocalIP = () => {
    const interfaces = os.networkInterfaces();
    for (let interfaceName in interfaces) {
        for (let iface of interfaces[interfaceName]) {
            // 过滤掉内部地址和未使用的地址
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1'; // 如果没有找到，返回 localhost
};

const localIP = getLocalIP();

app.listen(APP_PORT, '0.0.0.0', () => {
    console.log(`listening at http://${localIP}:${APP_PORT}`); // 使用局域网 IP
});