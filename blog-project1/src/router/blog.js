const { getList, getDetail, newBlog, updateBlog, deleteBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

// 统一的登录验证函数
const loginCheck = (req) => {
    if(!req.session.username) {
        return Promise.resolve(
            new ErrorModel('尚未登录')
        )
    } 
}

const handleBlogRouter = (req, res) => {
    const method = req.method
    const path = req.path
    //获取博客列表
    if (method === 'GET' && path === '/api/blog/list') {
        const { author = '', keyword = '' } = req.query
        console.log('作者' + author + '-----' + '關鍵字' + keyword)
        return getList(author, keyword).then(listData => {
            return new SuccessModel(listData, '成功')
        })

    }

    //获取博客详情
    if (method === 'GET' && path === '/api/blog/detail') {
        const { id = '' } = req.query
        console.log('博客id ' + id)
        // const data = getDetail(id)
        // return new SuccessModel(data, '成功')
        const result = getDetail(id)
        return result.then(data => {
            return new SuccessModel(data, '成功')
        })
    }

    //新建一篇博客
    if (method === 'POST' && path === '/api/blog/new') {
        const loginCheckResult = loginCheck(req)
        if(loginCheckResult){
            return loginCheck
        }
        const blogData = req.body
        blogData.username = req.session.username
        // const data = newBlog(blogData)
        // return new SuccessModel(data, '成功')
        const result = newBlog(blogData)
        return result.then(data => {
            return new SuccessModel(data, '成功')
        })
    }

    //更新一篇博客
    if (method === 'POST' && path === '/api/blog/update') {
        const loginCheckResult = loginCheck(req)
        if(loginCheckResult){
            return loginCheck
        }
        const { id = '' } = req.query
        const blogData = req.body
        // const result = updateBlog(id, blogData)
        // if (result) {
        //     return new SuccessModel('成功')
        // } else {
        //     return new ErrorModel('失败')
        // }
        const result = updateBlog(id, blogData)
        return result.then(val => {
            if (val) {
                return new SuccessModel('成功')
            } else {
                return new ErrorModel('失败')
            }
        })
    }

    //刪除一篇博客
    if (method === 'POST' && path === '/api/blog/del') {
        const loginCheckResult = loginCheck(req)
        if(loginCheckResult){
            return loginCheck
        }
        const { id = '' } = req.query
        // const result = deleteBlog(id)

        // if (result) {
        //     return new SuccessModel('删除博客成功')
        // } else {
        //     return new ErrorModel('删除博客失败')
        // }
        const author = req.session.username
        const result = deleteBlog(id, author)
        return result.then(val => {
            if (val) {
                return new SuccessModel('删除博客成功')
            } else {
                return new ErrorModel('删除博客失败')
            }
        })
    }
}

module.exports = handleBlogRouter