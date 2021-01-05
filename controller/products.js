const productModel = require('../models/Product')

exports.createProduct = async(req,res,next)=>{
    try{
        const createdProduct = await productModel.create(req.body)                            
        //console.log(res)
        res.status(201).json(createdProduct)
    }catch(error){
        
        next(error); // 비동기에러를 처리할 수 있는 곳으로 보내줌
        
    }
    
}