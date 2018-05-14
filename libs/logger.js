const path = require('path')
const fs = require('fs')
const bunyan = require('bunyan')
const pack = require('../package.json')
const moment = require('moment')

const loggerPath = path.resolve(__dirname, `../logs/`)
if (!fs.existsSync(loggerPath)) {
  fs.mkdirSync(loggerPath)
}

module.exports = function () {
  let logger = bunyan.createLogger({
    name: `${pack.name}`,
    streams: [
      {
        level: 'info',
        type: 'rotating-file',
        path: path.resolve(loggerPath, `${moment().format('YYYYMMDD')}.log`), // log ERROR and above to a file
        period: '1d'
      }
    ]
  })
  return logger
}
