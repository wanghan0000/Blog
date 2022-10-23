const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { set } = require('../db/redis')

const handleUserRouter = (req, res) => {
    const method = req.method
    const path = req.path
    //登錄
    if (method === 'GET' && path === '/api/user/login') {
        const { username, password } = req.body
        //console.log(username+'-----'+password)
        const result = login(username, password)

        return result.then(loginData => {
            if(loginData.username){
                //设置session
                req.session.username = loginData.username
                req.session.realname = loginData.realname
               
                //同步到 redis
                set(req.sessionId, req.session)
                console.log("session is",req.session)
                return new SuccessModel('登录成功')
            }
            return new ErrorModel('登录失败')
        })

        // if (result) {
        //     return new SuccessModel('登录成功')
        // } else {
        //     return new ErrorModel('登录失败')
        // }
    }

    // if(method === 'GET' && path === '/api/user/login-test'){
    //     if(req.session.username){
    //         return Promise.resolve(new SuccessModel('登录成功'))
    //     }
    //     return Promise.resolve(new ErrorModel('登录失败'))
    // }
}

module.exports = handleUserRouter