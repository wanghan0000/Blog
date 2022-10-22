const { getList, getDetail, newBlog, updateBlog, deleteBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

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
        const blogData = req.body
        // const data = newBlog(blogData)
        // return new SuccessModel(data, '成功')
        const result = newBlog(blogData)
        return result.then(data => {
            return new SuccessModel(data, '成功')
        })
    }

    //更新一篇博客
    if (method === 'POST' && path === '/api/blog/update') {
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
        const { id = '' } = req.query
        // const result = deleteBlog(id)

        // if (result) {
        //     return new SuccessModel('删除博客成功')
        // } else {
        //     return new ErrorModel('删除博客失败')
        // }
        const author = 'zhangsan' //开发假数据 登录后使用真数据
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