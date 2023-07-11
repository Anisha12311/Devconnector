const express = require('express')
const router = express.Router()
const {check,validationResult } = require('express-validator')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const User = require('../../models/User')
const jwt = require('jsonwebtoken')
const config = require('config')


router.post('/' , 
  [check('name','Name is required').not().isEmpty(),
   check('email','Please include vaild email').isEmail(),
   check('password','Please add password with 6 or more characters').isLength({min : 6})
  ],
  async(req,res) => {
    
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(200).json({error : errors.array()})
    }
    try {
        const {name,email,password} = req.body
        const user = await User.findOne({email})

        if(user){
            res.status(400).json({message : "User already exits"})
        }

        const avator =  gravatar.url(email,{
            s:'200',
            r: 'pg',
            d: 'mm'
        })

      const userData = new User({
            name,
            email,
            password,
            avator
        })

        const salt = await bcrypt.genSalt(10)
        userData.password = await bcrypt.hash(password,salt)
     
        await userData.save()
        
        const payload = {
            user : { 
                id : userData.id
            }
        }
        
        jwt.sign(payload,config.get('jwtSecret'),{expiresIn : 3600000}, (err,token) => {
            if(err) throw err
            res.json({token : token})
        })


    } catch (errors) {
        console.error(errors.message)
        process.exit(1)
    }
    
})

module.exports = router
