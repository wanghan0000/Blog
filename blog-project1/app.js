const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const { get, set } = require('../blog-project1/src/db/redis')

//session 数据
//const SESSION_DATA = {};

//获取cookie过期时间
const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    return d.toGMTString()
}

const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({})
            return
        }
        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }
        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            if (!postData) {
                resolve({})
                return
            }
            resolve(
                JSON.parse(postData)
            )
        })
    })
    return promise
}

const serverHandle = async (req, res) => {
    //设置返回格式 JSON
    res.setHeader('Content-type', 'application/json')

    const url = req.url
    req.path = url.split('?')[0]

    //解析query
    req.query = querystring.parse(url.split('?')[1])

    req.cookie = {}
    //解析cookie
    const coookieStr = req.headers.cookie || ''
    coookieStr.split(';').forEach(element => {
        if (!element) {
            return
        }
        const arr = element.split('=')
        const key = arr[0].trim()
        const val = arr[1].trim()
        req.cookie[key] = val
    });

    //解析session
    // let needSetCookie = false
    // let userId = req.cookie.userid
    // if(userId){
    //     if(!SESSION_DATA[userId]){
    //         SESSION_DATA[userId] = {}
    //     }
    // }else {
    //     needSetCookie = true
    //     userId = `${Date.now()}_${Math.random()}` 
    //     SESSION_DATA[userId] = {}
    // }
    // req.session = SESSION_DATA[userId]

    //解析session 使用 redis
    let needSetCookie = false
    let userId = req.cookie.userid
    if (!userId) {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        await set(userId, {})
    }
    //获取session
    req.sessionId = userId
    const sessionData = await get(userId)
    if(sessionData == null){
        // 初始化
        await set(req.sessionId, {})
        //设置session
        req.session = {}
    }else {
        req.session = sessionData
    }
    console.log('req.session ', req.session)

    //处理 post data
    getPostData(req).then(postData => {
        req.body = postData

        const blogResult = handleBlogRouter(req, res)
        if (blogResult) {
            blogResult.then(blogData => {
                res.end(
                    JSON.stringify(blogData)
                )
            })
            return
        }

        const userResult = handleUserRouter(req, res)
        if (userResult) {
            userResult.then(userData => {
                if (needSetCookie) {
                    //操作cookie 
                    res.setHeader('Set-Cookie',
                        `userid=${userId}; path=/; httpOnly; expires:${getCookieExpires()};`)
                }
                res.end(
                    JSON.stringify(userData)
                )
            })
            return
        }
        // const userData = handleUserRouter(req, res)
        // if (userData) {
        //     res.end(
        //         JSON.stringify(userData)
        //     )
        //     return
        // }

        //未命中路由
        res.writeHead(404, { "Content-type": "text/plain" })
        res.write("404 Not Found\n")
        res.end();
    })


}

module.exports = serverHandle
// env: process.env.NODE_ENV