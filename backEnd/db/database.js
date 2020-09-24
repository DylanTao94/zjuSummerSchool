// 设置 personalInfo 数据模型
const PersonalInfo = require('./dataModels/personalInfo');
const mongoose = require('mongoose');
const config = require('../config.json');

/**
 * 构建 数据库管理 对象 即 js中 函数就是对象
 * @param {JSON} config 数据库置文件 
 */
var db = function () {
    //设置 数据库管理 对象属性 config
    this.config = config;
}

/**
 * 连接数据库
 */
db.prototype.connect = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(config.dbURI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            resolve();
        }).catch(err => {
            console.log(err);
        })
    })
}

/**
 * 获取用户信息
 */
db.prototype.getPersonalInfo = openId => {
    return new Promise(function (resolve, reject) {
        // 查看数据库里是否有对应用户数据
        PersonalInfo.find({ openId: openId }).then(
            result => {
                if (result.length != 0) {
                    // 有用户数据，返回success = 1，并返回数据
                    resolve({ success: 1, result: result });
                } else {
                    // 无用户数据，返回success = 0
                    resolve({ success: 0 });
                }
            }
        ).catch(err => {
            console.log(err);
        })
    });
}



/**
 * 存储用户信息
 */
db.prototype.savePersonalInfo = (openId, selectedData) => {
    return new Promise(function (resolve, reject) {
        // 根据model 定义一个新的 instance
        let personalInfo = new PersonalInfo({
            selectedData: selectedData,
            openId: openId
        })
        // save() 会自动存到database的对应collection
        personalInfo.save().then(result => {
            resolve(result)
        }).catch(err => {
            resolve({ success: 0 })
        })
    })
}
//暴露可供外部访问的接口
module.exports = db;