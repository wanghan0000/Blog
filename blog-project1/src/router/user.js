const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const handleUserRouter = (req, res) => {
    const method = req.method
    const path = req.path
    //登錄
    if (method === 'GET' && path === '/api/user/login') {
        const { username, password } = req.query
        //console.log(username+'-----'+password)
        const result = login(username, password)

        return result.then(loginData => {
            if(loginData.username){

                //操作cookie 
                res.setHeader('Set-Cookie', `username=${loginData.username}; path=/`)
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

    if(method === 'GET' && path === '/api/user/login-test'){
        if(req.cookie.username){
            return Promise.resolve(new SuccessModel('登录成功'))
        }
        return Promise.resolve(new ErrorModel('登录失败'))
    }
}

module.exports = handleUserRouter