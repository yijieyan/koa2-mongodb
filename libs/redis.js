const redis = require('redis')
const config = require('../config.js')
const {timeout = 60 * 60 * 24 * 2, host, port} = config.redis
const bluebird = require('bluebird')
bluebird.promisifyAll(redis.RedisClient.prototype)

let redisClient
function connectionServer () {
  redisClient = redis.createClient(port, host)
};

/**
 * 判断key是否存在redis中
 */

let has = async (key) => {
  if (!key) return
  if (!redisClient) connectionServer()
  let value = await redisClient.existsAsync(key)
  return value
}

/**
 * 根据key从redis中获取信息
 */

let get = async (key) => {
  if (!key) return
  if (!redisClient) connectionServer()
  let str = await redisClient.getAsync(key)
  return JSON.parse(str)
}

/**
 * 根据key从redis中删除信息
 */

let del = async (key) => {
  if (!key) return
  if (!redisClient) connectionServer()
  let value = await redisClient.delAsync(key)
  return value
}

/**
 * 把key、value存进redis中
 */

let set = async (key, value, _timeout = timeout) => {
  if (!key || !value) return
  if (!redisClient) connectionServer()
  if (value instanceof Object) { value = JSON.stringify(value) }
  let val = await redisClient.setAsync(key, value)
  await redisClient.expireAsync(key, _timeout)// 设置超时时间
  return val
}

module.exports = {has, get, del, set}
