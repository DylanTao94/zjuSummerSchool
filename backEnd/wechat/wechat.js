'use strict' //设置为严格模式

const crypto = require('crypto'), //引入加密模块
    https = require('https'), //引入 htts 模块
    util = require('util'), //引入 util 工具包
    fs = require('fs'), //引入 fs 模块
    urltil = require('url'),//引入 url 模块
    accessTokenJson = require('./access_token'), //引入本地存储的 access_token
    menus = require('./menus'), //引入微信菜单配置
    parseString = require('xml2js').parseString,//引入xml2js包
    msg = require('./msg'),//引入消息处理模块
    CryptoGraphy = require('./cryptoGraphy'); //微信消息加解密模块


/**
 * 构建 WeChat 对象 即 js中 函数就是对象
 * @param {JSON} config 微信配置文件 
 */
var WeChat = function (config) {
    //设置 WeChat 对象属性 config
    this.config = config;
    //设置 WeChat 对象属性 token
    this.token = config.token;
    //设置 WeChat 对象属性 appID
    this.appID = config.appID;
    //设置 WeChat 对象属性 appScrect
    this.appScrect = config.appScrect;
    //设置 WeChat 对象属性 apiDomain
    this.apiDomain = config.apiDomain;
    //设置 WeChat 对象属性 apiURL
    this.apiURL = config.apiURL;



    //设置 图灵机器人接口 对象属性 turningAIURL
    this.turningAIURL = config.turningAIURL;
    //设置 图灵机器人接口 对象属性 turningAIURL
    this.turningAIApiKey = config.turningAIApiKey;

    /**
     * 用于处理 https Get请求方法
     * @param {String} url 请求地址 
     */
    this.requestGet = function (url) {
        return new Promise(function (resolve, reject) {
            https.get(url, function (res) {
                var buffer = [], result = "";
                //监听 data 事件
                res.on('data', function (data) {
                    buffer.push(data);
                });
                //监听 数据传输完成事件
                res.on('end', function () {
                    result = Buffer.concat(buffer).toString('utf-8');
                    //将最后结果返回
                    resolve(result);
                });
            }).on('error', function (err) {
                reject(err);
            });
        });
    }

    /**
     * 用于处理 https Post请求方法
     * @param {String} url  请求地址
     * @param {JSON} data 提交的数据
     */
    this.requestPost = function (url, data) {
        return new Promise(function (resolve, reject) {
            //解析 url 地址
            var urlData = urltil.parse(url);
            //设置 https.request  options 传入的参数对象
            var options = {
                //目标主机地址
                hostname: urlData.hostname,
                //目标地址 
                path: urlData.path,
                //请求方法
                method: 'POST',
                //头部协议
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(data, 'utf-8')
                }
            };
            var req = https.request(options, function (res) {
                var buffer = [], result = '';
                //用于监听 data 事件 接收数据
                res.on('data', function (data) {
                    buffer.push(data);
                });
                //用于监听 end 事件 完成数据的接收
                res.on('end', function () {
                    result = Buffer.concat(buffer).toString('utf-8');
                    resolve(result);
                })
            })
                //监听错误事件
                .on('error', function (err) {
                    console.log(err);
                    reject(err);
                });
            //传入数据
            req.write(data);
            req.end();
        });
    }
}

/**
 * 微信接入验证
 * @param {Request} req Request 对象
 * @param {Response} res Response 对象
 */
WeChat.prototype.auth = function (req, res) {

    var that = this;
    this.getAccessToken().then(function (data) {
        //格式化请求连接
        var url = util.format(that.apiURL.createMenu, that.apiDomain, data);
        //使用 Post 请求创建微信菜单
        that.requestPost(url, JSON.stringify(menus)).then(function (data) {
            //将结果打印
            console.log(data);
        });
    });

    //1.获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
    var signature = req.query.signature,//微信加密签名
        timestamp = req.query.timestamp,//时间戳
        nonce = req.query.nonce,//随机数
        echostr = req.query.echostr;//随机字符串

    //2.将token、timestamp、nonce三个参数进行字典序排序
    var array = [this.token, timestamp, nonce];
    array.sort();

    //3.将三个参数字符串拼接成一个字符串进行sha1加密
    var tempStr = array.join('');
    const hashCode = crypto.createHash('sha1'); //创建加密类型 
    var resultCode = hashCode.update(tempStr, 'utf8').digest('hex'); //对传入的字符串进行加密

    //4.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
    if (resultCode === signature) {
        res.send(echostr);
    } else {
        res.send('mismatch');
    }
}

/**
 * 获取微信 access_token
 */
WeChat.prototype.getAccessToken = function () {
    var that = this;
    return new Promise(function (resolve, reject) {
        //获取当前时间 
        var currentTime = new Date().getTime();
        //格式化请求地址
        var url = util.format(that.apiURL.accessTokenApi, that.apiDomain, that.appID, that.appScrect);
        //判断 本地存储的 access_token 是否有效
        if (accessTokenJson.access_token === "" || accessTokenJson.expires_time < currentTime) {
            that.requestGet(url).then(function (data) {
                var result = JSON.parse(data);
                if (data.indexOf("errcode") < 0) {
                    accessTokenJson.access_token = result.access_token;
                    accessTokenJson.expires_time = new Date().getTime() + (parseInt(result.expires_in) - 200) * 1000;
                    //更新本地存储的
                    fs.writeFile('./wechat/access_token.json', JSON.stringify(accessTokenJson));
                    //将获取后的 access_token 返回
                    resolve(accessTokenJson.access_token);
                } else {
                    //将错误返回
                    resolve(result);
                }
            });
        } else {
            //将本地存储的 access_token 返回
            resolve(accessTokenJson.access_token);
        }
    });
}

/**
 * 微信消息处理
 * @param {Request} req Request 对象
 * @param {Response} res Response 对象
 */
WeChat.prototype.handleMsg = function (req, res) {
    /*********************
     * xml解析后的数据结构如下
     * {
     *    tousername: [ 'gh_ea8ddcbb7bda' ],
     *    fromusername: [ 'ostUYt3Yp7Paq2QM7nFNoH6GAi70' ],
     *    createtime: [ '1599787083' ],
     *    msgtype: [ 'text' ],
     *    content: [ 's' ],
     *    msgid: [ '22903442057179070' ]
     * }
     *********************/
    var result = {};

    result.toUserName = req.body.xml.tousername[0]; //接收方微信
    result.fromUserName = req.body.xml.fromusername[0];;//发送方openId
    result.createTime = req.body.xml.createtime[0]//发送时间
    result.msgType = req.body.xml.msgtype[0]//发送消息类型

    // 不同消息可能不含有以下信息，需先进行判断
    if (req.body.xml.content) {
        result.content = req.body.xml.content[0]//发送消息内容
    }
    if (req.body.xml.msgId) {
        result.msgId = req.body.xml.msgid[0]//发送消息
    }
    if (req.body.xml.event) {
        result.event = req.body.xml.event[0]//发送消息
    }
    var reportMsg = ""; //声明回复消息的变量 s  
    var data2truningAI = {}; //声明传递给图灵机器人的数据
    //判断消息类型
    switch (result.msgType) {
        case "event": //判断事件类型为event
            switch (result.event) {
                case 'subscribe':
                    //回复消息
                    var content = "欢迎关注 浙大暑校 公众号，可以直接给客服发送信息，客服会立马回复你想要的数据哟。如回复：\n";
                    content += "暑期课介绍\n";
                    content += "暑期课上课地点\n";
                    content += "课程介绍\n";
                    reportMsg = msg.txtMsg(result.fromUserName, result.toUserName, content);
                    break;
                case 'click':
                    var contentArr = [
                        { Title: "Node.js 微信自定义菜单", Description: "使用Node.js实现自定义微信菜单", PicUrl: "http://img.blog.csdn.net/20170605162832842?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvaHZrQ29kZXI=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast", Url: "http://blog.csdn.net/hvkcoder/article/details/72868520" },
                        { Title: "Node.js access_token的获取、存储及更新", Description: "Node.js access_token的获取、存储及更新", PicUrl: "http://img.blog.csdn.net/20170528151333883?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvaHZrQ29kZXI=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast", Url: "http://blog.csdn.net/hvkcoder/article/details/72783631" },
                        { Title: "Node.js 接入微信公众平台开发", Description: "Node.js 接入微信公众平台开发", PicUrl: "http://img.blog.csdn.net/20170605162832842?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvaHZrQ29kZXI=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast", Url: "http://blog.csdn.net/hvkcoder/article/details/72765279" }
                    ];
                    //回复图文消息
                    reportMsg = msg.graphicMsg(result.fromUserName, result.toUserName, contentArr);

                    break;
            }
            break;
            //返回给微信服务器
            res.send(reportMsg);
        case "text": //判断消息类型为 文本消息
            // 根据消息内容返回消息信息
            /**
             * 处理Json数据发送给turingAI
             * 请求方式：POST
             * URL：http://openapi.tuling123.com/openapi/api/v2
             * 请求参数：参考图灵接口文档 https://www.kancloud.cn/turing/www-tuling123-com/718227
             **/
            // 处理Json数据发送给turingAI
            data2truningAI = {
                "reqType": 0, // 输入类型:0-文本(默认)、1-图片、2-音频Î
                perception: {
                    "inputText": {
                        "text": result.content,
                    }
                },
                "userInfo": {
                    "apiKey": this.turningAIApiKey,
                    "userId": result.fromUserName.replace("-", "")
                }
            };
            console.log("********************");
            console.log(result.content);
            console.log(result.fromUserName);
            console.log("********************");
            console.log(JSON.stringify(data2truningAI));
            // 发送json数据到图灵AI服务器
            this.requestPost(this.turningAIURL, JSON.stringify(data2truningAI)).then(function (data) {
                // 图灵机器人返回的数据格式为：
                // var data = {
                //     "intent":
                //     {
                //         "actionName": "",
                //         "code": 10020,
                //         "intentName": ""
                //     },
                //     "results": [
                //         {
                //             "groupType": 1,
                //             "resultType": "text",
                //             "values":
                //             {
                //                 "text": "作为"
                //             }
                //         }
                //     ]
                // }
                // 将数据解析成JSON
                // 如果是发送为个人信息，则返回链接；否则将信息交由图灵机器人处理
                let data_JSON = JSON.parse(data);
                // 将数据处理成为发送给微信的格式
                if (result.content == "链接") {
                    data_JSON.results[0].values.text = `https://2ba14454dddb.ngrok.io?openId=${result.fromUserName}`
                }
                reportMsg = msg.txtMsg(result.fromUserName, result.toUserName, data_JSON.results[0].values.text);
                //返回给微信服务器
                res.send(reportMsg)
            });
    }

    // res.send(reportMsg);
}

//暴露可供外部访问的接口
module.exports = WeChat;
