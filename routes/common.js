const router = require('koa-router')()
const File = require('../models/file')
const multer = require('koa-multer')
const mkdirp = require('mkdirp')
const fs = require('fs')
const path = require('path')
const commonError = require('../libs/error')
let currMonth = new Date().toISOString().substr(0, 7)
let dest = `uploads/${currMonth}/`
let upload = multer({dest: dest})

let util = require('../libs/util')
let User = require('../models/user')
let security = require('../libs/security')
fs.existsSync(upload) ? '' : mkdirp.sync(path.join(__dirname, '../', dest))

router.prefix('/common')

/**
 * 上传文件（支持多文件上传）
 */
router.post('/uploadFile', upload.array('files', 12), async (ctx, next) => {
  try {
    let files = ctx.req.files
    let f = []
    for (let i = 0; i < files.length; i++) {
      let item = files[i]
      let ret = await File.create({
        savePath: item.path,
        fileName: item.filename,
        mimeType: item.mimetype,
        size: item.size,
        originalname: item.originalname,
        account: ctx.userId || ''
      })
      f.push({_id: ret._id})
    }
    ctx.success(f)
  } catch(err) {
    throw err
  }
})

/**
 * 文件下载
 *
 */
router.get('/downLoadFile', async (ctx, next) => {
  try {
    let {fileId} = ctx.query
    let f = await File.findOne({_id: fileId})
    ctx.res.setHeader('Content-disposition', `attachment; filename=${encodeURIComponent(f.originalname)};filename*=utf-8${f.fileName}`)
    ctx.res.setHeader('Content-type', f.mimeType)
    f.size
      ? ctx.res.setHeader('Content-Length', Number(+ f.size).toString())
      : ''
    ctx.body = fs.createReadStream(path.resolve(process.env.dataDir, f.savePath))
  } catch (err) {
    throw err
  }
})

/**
 * 注册
 */
router.post('/signUp', async (ctx, next) => {
  try {
    let {password, phone, username, email} = util.getParams(ctx.request.body)
    let u = await User.findOne({
      $or: [{
          phone
        }, {
          email
        }]
    })
    if (u) {
      throw new commonError.UserIsExist()
    } else {
      password = security.sign(password)
      let u = await User.create({username, phone, email, password})
      ctx.success('signUp successful!')
    }
  } catch(err) {
    ctx.success('signUp fail', -1)
  }
})

/**
 * 登陆
 */
router.post('/signIn', async (ctx, next) => {
  try {
    let {phone, email, password} = util.getParams(ctx.request.body)
    let u = await User.findOne({
      $or: [{
          phone
        }, {
          email
        }]
    })
    if (!u) {
      throw new commonError.UserIsNotExist()
    } else {
      password = security.sign(password)
      if (u.password !== password) {
        throw new commonError.PasswordError()
      } else {
        let token = ctx.sign(u.userId)
        await ctx.setSession(u, token)
        ctx.success({token})
      }
    }
  } catch(err) {
    ctx.success('signIn fail', -1)
  }
})

module.exports = router
