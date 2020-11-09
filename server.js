const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const {MONGOURI}=require('./config/keys')
const auth = require('./routes/auth')
const post = require('./routes/post')
const  user  = require('./routes/user')

//app config
const app = express()
const PORT = process.env.PORT || 5000



//mongoURI = 'mongodb+srv://admin:3818200@cluster0.3wppw.mongodb.net/db?retryWrites=true&w=majority'

mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}).then(() => console.log("Connect to MongoDB.."))
    .catch((err) =>
        console.error("Could not connct to MongoDB....", err.message)
    );

//custom middleware
// const customMiddleware = (req, res, next) => {
//     console.log("middlewar")
//     next()
// }

//middlewares
app.use(express.json())
app.use(cors())



app.use('/', auth)
app.use('/', post)
app.use('/',user)



if(process.env.NODE_ENV=="pproduction"){
    app.use(express.static('social-app-frontend/build'))

    const path=require("path")
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(_dirname,'social-app-frontend','build','index.js'))
    })
}




//listen
app.listen(PORT, () => console.log(`listening on localhost:${PORT}`))