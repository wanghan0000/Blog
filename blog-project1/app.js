const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

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

const serverHandle = (req, res) => {
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
        const arr = element.split('=')
        const key = arr[0].trim()
        const val = arr[1].trim()
        req.cookie[key] = val
    });

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

        const userResult = handleUserRouter(req,res)
        if(userResult) {
            userResult.then(userData => {
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