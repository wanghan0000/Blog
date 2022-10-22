const { exec } = require('../db/mysql')

const getList = (author, keyword) => {
    let sql = 'select * from blog where 1=1 '
    if (author) {
        sql += `and author='${author}' `
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' `
    }
    sql += 'order by createtime desc'

    //这里返回是一个promise
    return exec(sql)
}

const getDetail = (id) => {
    const sql = `select * from blog where id='${id}'`
    return exec(sql).then(rows => {
        return rows[0]
    })
}


const newBlog = (blogData = {}) => {
    // blogData 是一个博客对象， 包含 title content 属性
    console.log('newBlogData blogData...', blogData)

    const createtime = Date.now()
    const { title = '', content = '', author } = blogData

    const sql = `
        insert into blog(title,content,createtime,author)
        values('${title}','${content}',${createtime},'${author}')
    `

    return exec(sql).then(data => {
        return { id: data.insertId }
    })
    // return {
    //     id: 3 //表示新建博客， 插入到数据表里面
    // }
}

const updateBlog = (id, blogData = {}) => {
    // id 表示更新博客的id
    // blogData 表示更新博客数据

    const createtime = Date.now()
    const { title = '', content = '', author } = blogData

    const sql = `update blog set title='${title}', content='${content}', author='${author}', createtime='${createtime}' where id=${id}`

    return exec(sql).then(data => {
        const { affectedRows } = data
        return affectedRows > 0
    })
    //return true
}

const deleteBlog = (id, author) => {

    const sql = `delete from blog where id=${id} and author='${author}'`
    return exec(sql).then(data => {
        const { affectedRows } = data
        return Boolean(affectedRows)
    })
    //return true
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
}