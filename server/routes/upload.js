
const express = require('express')

const {saveFile} = require('../utils/file')

const multer = require('multer')
const path = require('path')


let uploadRouter = express.Router()

let upload = multer({dest: path.join(__dirname, '../uploads/')})


//图片上传示例 web端
/** 如果需要验证用户，加上authUse 就行。 前端也要记得header带上token */
uploadRouter.post('/articles', upload.single('file'), async function(req, res, next) {
  const {file} = req
  let baseUrl = saveFile(file, '/articles')
  res.json({
    path: baseUrl,
    url: process.env.STATIC_URL + baseUrl
  })
})




module.exports = uploadRouter