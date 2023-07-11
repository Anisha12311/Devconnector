const express = require('express')
const app = express()
const port = 4000
const connectDB = require('./config/db')
const User = require('./routes/apis/user')
const Profile = require('./routes/apis/profile')
const Post = require('./routes/apis/post')
const Auth  = require('./routes/apis/auth')
connectDB()
app.use(express.json({extended : false}))
app.use('/api/user',User)
app.use('/api/profile',Profile)
app.use('/api/post',Post)
app.use('/api/auth',Auth)

app.listen(4000, () => {
    console.log(`Server is running on port ${port}`)
})


