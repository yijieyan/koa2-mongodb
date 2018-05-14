const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autoIncrement = require('mongoose-auto-increment')

let userSchema = new Schema({
  password: String, // 密码
  username: String, // 用户名
  phone: String, // 手机号
  email: String, // 邮箱
  avatar: String // 头像
}, {versionKey: false, timestamps: true})
userSchema.plugin(autoIncrement.plugin, {
  model: 'user',
  field: 'userId',
  startAt: 10000,
  incrementBy: 1
})
module.exports = mongoose.model('user', userSchema)
