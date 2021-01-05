// exporess module 불러오기

const express = require('express')
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://yooooonk:manager@cluster0.eulmi.mongodb.net/trello?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>console.log('MongoDB connected'))
    .catch(err=>console.log(err))

const PORT = 5000;

//applicaiton 생성
const app = express();
app.use(express.json()) //req.body를 사용하기위해

// api router 사용
const productRoutes = require('./routes')
app.use('/api/products',productRoutes)

//error처리 
app.use((error,req,res,next)=>{
    res.status(500).json({msessage:error.message})
})

// applicaiton 시작
app.listen(PORT);
console.log(`Running on port ${PORT}`)

module.exports = app;