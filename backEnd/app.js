const express = require('express'), //express 框架 
    wechat = require('./wechat/wechat'),
    config = require('./config'),//引入配置文件
    xmlparser = require('express-xml-bodyparser');//引入xml解析中间件

var app = express();//实例express框架
// 为处理XML信息，加入中间件，预处理
app.use(express.json());
// app.use(express.urlencoded());
app.use(xmlparser());

var wechatApp = new wechat(config); //实例wechat 模块

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
    wechatApp.getAccessToken().then(function (data) {
        res.send(data);
    });
});

//监听3000端口
app.listen(3000, () => {
    console.log("Listening port : 3000")
});