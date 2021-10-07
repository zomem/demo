
const fs = require('fs')
const path = require('path')

// 文件保存，删除等操作


// file为  multer 包处理后的file。
const saveFile = (file, localPath, fileName) => {
  let data = fs.readFileSync(file.path)
  let extname = file.originalname.substring(file.originalname.lastIndexOf('.')+1)
  let savename = fileName ? (fileName + '.' + extname) : file.originalname
  fs.writeFileSync(path.join(__dirname, '../static' + localPath + '/' + savename), data)
  fs.unlinkSync(path.join(__dirname, '../uploads/' + file.filename))
  let baseUrl = localPath + '/' + savename
  return baseUrl
}



// 删除文件
const deleteFile = (pathUrl) => {
  if (!fs.existsSync(path.join(__dirname, '../static' + pathUrl))) {
    return true
  }
  fs.unlinkSync(path.join(__dirname, '../static' + pathUrl))
  return true
}


module.exports = {
  saveFile,
  deleteFile
}