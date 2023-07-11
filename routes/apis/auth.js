const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const config = require('config')
const bcrypt = require('bcryptjs')
const {check,validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
router.get('/' , auth,async(req,res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server Error")
    }
    res.send('auth router')
})

router.post('/' , 
  [
   check('email','Please include vaild email').isEmail(),
   check('password','Please add password with 6 or more characters').isLength({min : 6})
  ],
  async(req,res) => {
    
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(200).json({error : errors.array()})
    }
    try {
        const {email,password} = req.body
        const user = await User.findOne({email})

        if(!user){
            res.status(400).json({message : "Invaild credientials"})
        }

       const ismatch = bcrypt.compare(password,user.password)

       if(!ismatch){
          return res.status(400).json({message : "Invaild credentials"})
       }
        
        const payload = {
            user : { 
                id : user.id
            }
        }
        
        jwt.sign(payload,config.get('jwtSecret'),{expiresIn : 3600000}, (err,token) => {
            if(err) throw err
            res.json({token : token})
        })


    } catch (errors) {
        console.error(errors.message)
        res.status(500).json("Server Error! ")
        process.exit(1)
    }
    
})
module.exports = router
