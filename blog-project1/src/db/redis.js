const redis = require('redis')
const { REDIS_CONF } = require('../conf/db')


//创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);

!(async function () {
    await redisClient.connect()
    .then(()=>{console.log('redis 连接成功')})
    .catch(()=>{console.log('redis连接失败')})
})()

const set = async (key, val) => {
    let objVal
    if (typeof val === 'object') {
        objVal = JSON.stringify(val)
    } else {
        objVal = val
    }
    try {
        await redisClient.set(key, objVal, redis.print)
    } catch (ex) {
        console.log('setRedis is ex: ', ex)
    }
}

const get = async (key) => {
    try {
        const val = await redisClient.get(key)
        if (val == null) {
            return null
        }
        try {
            return JSON.parse(val)
        } catch (ex) {
            return val
        }
    } catch (err) {
        throw err
    }
}




 module.exports = {
    set,
    get
 }