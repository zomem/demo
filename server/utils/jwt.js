const {mysql} = require('access-db')

const jwt = require('jsonwebtoken')

const genToken = (uid) => {
  const jwt = require('jsonwebtoken')
  const token = jwt.sign({id: uid}, process.env.JWT_TOKEN_SECRET, {expiresIn: parseInt(process.env.JWT_TOKEN_EXPIRATION_TIME || '0')})
  return token
}


const authUse = async (req, res, next) => {
  if(!req.headers.authorization){
    res.send(401, '用户未登录')
  }
  const raw = req.headers.authorization.split(' ').pop()
  if(raw === 'Bearer'){
    res.send(401, '用户未登录')
  }
  const {id} = jwt.verify(raw, process.env.JWT_TOKEN_SECRET)
  req.user = (await mysql.get('users', id)).data
  next()
}


module.exports = {
  genToken,
  authUse
}

