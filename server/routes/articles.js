
const express = require('express')
const {mysql, mongodb} = require('access-db')

const {WEAPP} = require('../constants/constants')
const {getTime} = require('../utils/utils')
const { authUse } = require('../utils/jwt')

const articlesRouter = express.Router()



// 新增，如果要用户授权的话，就保留  authUse
articlesRouter.post('/add', /* authUse, */ async (req, res, next) => {
  const {user, body} = req
  const {title, cover_url, html} = body
  
  let nowTime = getTime('date_time')
  // 将基础数据，保存在mysql
  let tempAid = (await mysql.set('articles', {
    title: title,
    cover_url: cover_url,
    uid: user.id,
    created_at: nowTime
  })).data.insertId

  // 将文章内容保存在 mongodb
  // await mongodb.set('articles', {
  //   title: title,
  //   html: html,
  //   article_sql_id: tempAid,
  //   cover_url: cover_url,
  //   nickname: user.nickname,
  //   avatar_url: user.avatar,
  //   created_at: nowTime,
  //   status: 2,
  // })

  res.json({
    status: 2,
    message: '成功'
  })
})

// 列表
articlesRouter.get('/list', async (req, res, next) => {
  let list = (await mysql.find('articles')).data.objects

  res.json(list)
})


// 详情
articlesRouter.get('/detail/:aid', async (req, res, next) => {
  const {aid} = req.params
  let info = (await mysql.get('articles', aid)).data
  // let info = (await mongodb.get('articles', {article_sql_id: parseInt(aid)})).data
  res.json(info)
})



module.exports = articlesRouter