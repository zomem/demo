
const express = require('express')
const {mysql} = require('access-db')
const axios = require('axios')

const {WEAPP} = require('../constants/constants')
const {getTime} = require('../utils/utils')
const {genToken} = require('../utils/jwt')

const WXBizDataCrypt = require('../utils/WXBizDataCrypt')

const loginRouter = express.Router()


// 仅获取sessionkey
loginRouter.post('/wechat_session_key', async function(req, res, next) {
  try{
    let {code} = req.body
    let sessionRes = await axios({
      url: 'https://api.weixin.qq.com/sns/jscode2session',
      params: {
        appid: WEAPP.APP_ID,
        secret: WEAPP.APP_SECRET,
        js_code: code,
        grant_type: 'authorization_code',
      }
    })
    res.json({
      session_key: sessionRes.data.session_key,
      openid: sessionRes.data.openid
    })
  }catch(err){
    res.status(500).send(err)
  }
})


// 小程序授权登录
loginRouter.post('/wechat', async function(req, res, next) {
  let {code, userInfo} = req.body
  if(!userInfo){ 
    userInfo = {
      nickName: null,
      avatarUrl: null,
    }
  }
  let sessionRes = await axios({
    url: 'https://api.weixin.qq.com/sns/jscode2session',
    params: {
      appid: WEAPP.APP_ID,
      secret: WEAPP.APP_SECRET,
      js_code: code,
      grant_type: 'authorization_code',
    }
  })
  // 如果小程序绑定了微信开放平台，则也会返回unionid
  let userRes = await mysql.find('users', {
    p0: ['openid', '=', sessionRes.data.openid],
    r: 'p0'
  })
  let nowTime = getTime('date_time')
  let resUser = {}
  if(userRes.data.objects.length === 0){
    //没有，新增用户
    let setRes = await mysql.set('users', {
      nickname: userInfo.nickName,
      avatar: userInfo.avatarUrl,
      openid: sessionRes.data.openid,
      created_at: nowTime,
      updated_at: nowTime,
    })
    if(setRes.data.insertId){
      let getRes = await mysql.get('users', setRes.data.insertId)
      resUser = {
        ...getRes.data,
        session_key: sessionRes.data.session_key,
        token: genToken(setRes.data.insertId)
      }
    }
  }else{
    //有用户，更新基本信息
    if(userInfo.avatarUrl){
      let updateRes = await mysql.update('users', userRes.data.objects[0].id, {
        nickname: userInfo.nickName,
        avatar: userInfo.avatarUrl,
        updated_at: nowTime,
      })
    }
    let getRes = await mysql.get('users', userRes.data.objects[0].id)
    resUser = {
      ...getRes.data,
      session_key: sessionRes.data.session_key,
      token: genToken(userRes.data.objects[0].id)
    }
  }
  res.json(resUser)
})


// 小程序获取手机号
loginRouter.post('/wechat_phone', async function(req, res, next) {
  let {openid, sessionKey, iv, encryptedData} = req.body
  var pc = new WXBizDataCrypt(WEAPP.APP_ID, sessionKey)
  var data = pc.decryptData(encryptedData , iv)

  let userList = (await mysql.find('users', {
    p0: ['openid', '=', openid],
    r: 'p0'
  })).data.objects
  let nowTime = getTime('date_time')
  let resUser = {}
  if(userList.length === 0){
    //没有，新增用户
    let id = (await mysql.set('users', {
      phone: data.phoneNumber,
      created_at: nowTime,
      updated_at: nowTime,
      openid: openid,
    })).data.insertId
    if(id){
      resUser = (await mysql.get('users', id)).data
    }
  }else{
    //有用户，更新基本信息
    if(userList[0].phone != data.phoneNumber){
      await mysql.update('users', userList[0].id, {
        phone: data.phoneNumber,
        updated_at: nowTime,
      })
    }
    resUser = (await mysql.get('users', userList[0].id)).data
  }
  res.json(resUser)
})

module.exports = loginRouter