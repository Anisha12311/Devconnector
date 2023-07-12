const config = require('config')
const jwt = require('jsonwebtoken')

module.exports = function(req,res,next) {
    const token = req.header('x-auth-token');
    if(!token){
        res.status(401).json("No token, authorization denied")
    }
    try {
       
        const decode = jwt.verify(token,config.get('jwtSecret'))
        req.user = decode.user
        next()
        
    } catch (error) {
        res.status(401).json("Token is not vaild")
    }
} 