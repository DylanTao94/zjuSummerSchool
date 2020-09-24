const express = require('express'); //express 框架 
const wechat = require('./wechat/wechat');
const config = require('./config');//引入配置文件
const db = require('./db/database');// 引入数据库管理模块
const xmlparser = require('express-xml-bodyparser');//引入xml解析中间件

var app = express();//实例express框架
var wechatApp = new wechat(config); //实例wechat模块，并导入config
var dbApp = new db(config); //实例数据库管理模块，并导入config
var mongoose = require('mongoose')

// 为处理XML信息，加入中间件，预处理
app.use(express.json());
// app.use(express.urlencoded());
app.use(xmlparser());
// 处理cros（跨域访问）问题 => 接受所有域的访问
app.use(require('cors')({ "Access-Control-Allow-Origin": "*", }));

//用于处理所有进入 3000 端口 get 的连接请求
app.get('/', function (req, res) {
    wechatApp.auth(req, res);
});

//用于处理所有进入 3000 端口 post 的连接请求
app.post('/', function (req, res) {
    wechatApp.handleMsg(req, res);
});

//用于请求获取 access_token
app.get('/getAccessToken', function (req, res) {
    wechatApp.getAccessToken().then(data => {
        res.send(data);
    });
});

//用于查询并获取用户信息
app.get('/getPersonalInfo', function (req, res) {
    dbApp.getPersonalInfo(req.query.openId).then(data => {
        res.send(data);
    })
});


//存储用户信息
app.post('/savePersonalInfo', function (req, res) {
    dbApp.savePersonalInfo(req.body.openId,req.body.selectedData).then(data => {
        res.json(data);
    })
});

//连接完数据库，并开启web服务器
dbApp.connect().then(res => {
    console.log("connected to db")
    //连接完数据库后，再开始web服务器，监听3000端口
    app.listen(3000, () => {
        console.log("Listening port : 3000")
    });
}).catch(err => {
    console.log(err);
})
