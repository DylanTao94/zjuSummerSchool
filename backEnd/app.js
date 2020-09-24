const express = require('express'), //express 框架 
    wechat = require('./wechat/wechat'),
    config = require('./config'),//引入配置文件
    cors = require('cors'),
    xmlparser = require('express-xml-bodyparser');//引入xml解析中间件

var app = express();//实例express框架
var wechatApp = new wechat(config); //实例wechat模块，并导入config
var mongoose = require('mongoose')

// 为处理XML信息，加入中间件，预处理
app.use(express.json());
// app.use(express.urlencoded());
app.use(xmlparser());
// 处理cros问题 => 接受所有域的访问
app.use(cors({"Access-Control-Allow-Origin": "*",}));

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

//用于查询并获取用户信息
// instance PersonalInfo data model
let PersonalInfo = require('./db/dataModels/personalInfo')
app.get('/getPersonalInfo', function (req, res) {
    // 获取用户openId
    let openId = req.query.openId;
    // console.log(openId);

    // 查看数据库里是否有对应用户数据
    PersonalInfo.find({ openId: openId }).then(
        result => {
            if (result.length != 0) {
                // 有用户数据，返回success = 1，并返回数据
                res.send({ success: 1, result: result });
            } else {
                // 无用户数据，返回success = 0
                res.send({ success: 0 });
            }
        }
    ).catch(err => {
        console.log(err);
    })
});


//存储用户信息
app.post('/savePersonalInfo', function (req, res) {
    // 根据model 定义一个新的 instance
    console.log(req.body.openId)
    let personalInfo = new PersonalInfo({
        selectedData: req.body.selectedData,
        openId: req.body.openId
    })
    // save() 会自动存到database的对应collection
    personalInfo.save().then(result => {
        res.json(result)
    }).catch(err => {
        console.log(err);
    })
})



// 测试接口
// app.post('/testtest', function (req, res) {
//     res.json(req.body)
// })
//连接完数据库，并开启web服务器
mongoose.connect(config.dbURI, { useNewUrlParser: true, useUnifiedTopology: true }).then(res => {
    console.log("connected to db")
    //连接完数据库后，再开始web服务器，监听3000端口
    app.listen(3000, () => {
        console.log("Listening port : 3000")
    });
}).catch(err => {
    console.log(err);
})
