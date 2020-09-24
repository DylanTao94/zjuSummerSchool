const mongoose = require('mongoose');
const Schema = mongoose.Schema; // define the structure of the data inside the database collection

const personalInfoSchema = new Schema({
    selectedData: {
        selectedState: { type: String, required: true },
        selectedCat: { type: String, required: true },
        selectedEducationLevel: { type: String, required: true },
        selectedUniversity: { type: String, required: true },
        selectedMajor: { type: String, required: true }
    },
    openId: { type: String, required: true, unique: true}
})

// 一般而言，model开头字母大写，
// 第一个参数，name of model, 会自动对应寻找数据库里PersonalInfos
const PersonalInfo = mongoose.model('PersonalInfo', personalInfoSchema)
module.exports = PersonalInfo;