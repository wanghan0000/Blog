# 从0开始搭建nodejs服务端

## 使用nodemon监测文件变化，自动重启node

## 使用cross-env设置环境变量，兼容mac linux 和 windows

## 开发接口
### 1 初始化路由
### 2 返回假数据 将路由和数据处理分离
### 3 获取博客列表 /api/blog/list method=>get params>author,keyword参数为空则不进行查询过滤
### 4 获取一篇博客的内容 /api/blog/detail method=>get params id
### 5 新增一篇博客 /api/blog/new method=>post post中有新增的信息
### 6 更新一篇博客 /api/blog/update method=>post params id postData中有更新的内容
### 7 删除一篇博客 /api/blog/del method=>post params id 
### 8 登录 /api/user/login method=>post postData中有用户名和密码

### 使用MySQL 数据库
### 使用MySQL workbench来操作mysql
### 创建一个myblog的数据库

### 使用cookie 以及 session来登录 但会有各种问题 比如存储内存不够，多进程session数据不共享 解决方案redis
#### redis是web server最常用的缓存数据库,数据库存放在内存中 缺点是内存比较昂贵 一当机就没有了
#### 相比于mysql，访问速度快（内存和硬盘不是一个数量级）
#### 成本过高，可存储的数据少
#### 将web sever和redis 才分为两个单独的服务
#### 双方都是独立的，可扩展的(都可以扩展成集群)
#### 包括mysql,也是一个单独的服务，也可扩展


