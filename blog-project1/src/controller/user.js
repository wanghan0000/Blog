const { exec } = require('../db/mysql')
const login = (username, password) => {

    const sql = `
        select username, password from users where username='${username}' and password='${password}'
    `

    return exec(sql).then(rows => {
        return rows[0] || {}
    })
    // if (username === 'zhangsan' && password === '123') {
    //     return true
    // }
    // return false
}

module.exports = {
    login
}