const { request } = require("express");

const productController = require('../../controller/products')
const productModel = require('../../models/Product')
const httpMocks = require('node-mocks-http')
const newProduct = require('../data/new-product.json')
const allProducts = require('../data/all-products.json')

productModel.create = jest.fn(); //mock함수생성 -- 의존성 x
productModel.find = jest.fn()
productModel.findById = jest.fn()
productModel.findByIdAndUpdate = jest.fn()
productModel.findByIdAndDelete = jest.fn()

const productId = '5febd3236931533e7c06425c'
const updateProduct = {name:'lglg',describe:'vallet'}
let req,res,next;

beforeEach(()=>{    
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = null;
})

//create
describe('Product Controller Create',()=>{
    beforeEach(()=>{
        req.body = newProduct;
    })

    // createProduct가 함수인지 확인
    it('shoud have a createProduct function',()=>{
        expect(typeof productController.createProduct).toBe('function'); 
    })
    
    //product model이 호출되는지 확인
    it('should call ProductModel.create',async()=>{        
        await productController.createProduct(req,res,next);
        expect(productModel.create).toBeCalledWith(newProduct)
    })

    // 상태값 확인
    it("should return 201 response code",async()=>{
        await productController.createProduct(req,res,next);
        expect(res.statusCode).toBe(201) //결과코드
        expect(res._isEndCalled()).toBeTruthy()
    })

    // 결과값 확인
    it("sould return json body in response",async()=>{
        productModel.create.mockReturnValue(newProduct)
        await productController.createProduct(req,res,next);
        expect(res._getJSONData()).toStrictEqual(newProduct)
    })

    // 에러처리 
    it('shoud handle error',async()=>{
        //몽고 디비에서 처리하는 부분은 문제가 없다는 것을 가정하는 단위테스트
        // 원래 몽고 DB에서 처리하는 에러메세지는 mock함수로 처리
        const errorMessage = {message:'description propery missing'}
        const rejectedPromise = Promise.reject(errorMessage)
        productModel.create.mockReturnValue(rejectedPromise) 

        await productController.createProduct(req,res,next);
        expect(next).toBeCalledWith(errorMessage)
    })
})

// read
describe("Product Controller Get",()=>{
    it('should have a getProducts function',()=>{
        expect(typeof productController.getProducts).toBe('function')
    })

    it('should call ProductModel.find({})',async()=>{
        await productController.getProducts(req,res,next);
        expect(productModel.find).toHaveBeenCalledWith({})
    })

    it('should return 200 response',async()=>{
        await productController.getProducts(req,res,next);
        expect(res.statusCode).toBe(200)
        expect(res._isEndCalled).toBeTruthy()
    })

    it('should return json body in response',async()=>{
        productModel.find.mockReturnValue(allProducts)
        await productController.getProducts(req,res,next);
        expect(res._getJSONData()).toStrictEqual(allProducts)
    })

    it("should handle errors",async()=>{
        const errorMessage = {message:"error finding product data"}
        const rejectedPromise = Promise.reject(errorMessage)
        productModel.find.mockReturnValue(rejectedPromise)
        await productController.getProducts(req,res,next);
        expect(next).toHaveBeenCalledWith(errorMessage)        
    })
})

describe('Product Controller GetById',()=>{
    it('should have a getProductById function',()=>{
        expect(typeof productController.getProductById).toBe('function')
    })

    it('should call productModel.findById',async()=>{
        req.params.productId = productId
        await productController.getProductById(req,res,next);
        expect(productModel.findById).toBeCalledWith(productId)
    })

    it('should return json body and response code 200',async()=>{
        productModel.findById.mockReturnValue(newProduct);
        await productController.getProductById(req,res,next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(newProduct);
        expect(res._isEndCalled()).toBeTruthy()
    })

    it('shold return 404 when item doesnt exist',async()=>{
        productModel.findById.mockReturnValue(null)
        await productController.getProductById(req,res,next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy()
    })

    it("should handle errors",async()=>{
        const errorMessage = {message:"error"}
        const rejectedPromise = Promise.reject(errorMessage)
        productModel.findById.mockReturnValue(rejectedPromise)
        await productController.getProductById(req,res,next);
        expect(next).toHaveBeenCalledWith(errorMessage)        
    })
})

describe("Product Controller Update",()=>{
    it('Should have an updateProduct function',()=>{
        expect(typeof productController.updateProduct).toBe('function')
    })
    it('should call productModel.findByIdAndUpdate',async()=>{
        req.params.productId = productId
        req.body = updateProduct
        await productController.updateProduct(req,res,next);
        expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith(
            productId,{name:'lglg',describe:'vallet'},
            {new:true}
        )
    })

    it('should return json body and response code 200',async()=>{
        req.params.productId = productId
        req.body = updateProduct
        productModel.findByIdAndUpdate.mockReturnValue(updateProduct)
        await productController.updateProduct(req,res,next);
        expect(res.statusCode).toBe(200)
        expect(res._isEndCalled()).toBeTruthy()
        expect(res._getJSONData()).toStrictEqual(updateProduct)
    })

    it("sholud handle 404 when item doesnt exist",async()=>{
        productModel.findByIdAndUpdate.mockReturnValue(null)
        await productController.updateProduct(req,res,next);
        expect(res.statusCode).toBe(404)
        expect(res._isEndCalled()).toBeTruthy()
    })

    it('should handle errors',async()=>{
        const errorMessage = {message:'Error'}
        const rejectedPromise = Promise.reject(errorMessage)
        productModel.findByIdAndUpdate.mockReturnValue(rejectedPromise)
        await productController.updateProduct(req,res,next);
        expect(next).toHaveBeenCalledWith(errorMessage)
    })
})

describe('Product Controller Delete',()=>{
    it('should have a deleteProduct function',()=>{
        expect(typeof productController.deleteProduct).toBe('function')
    })

    it('should call productModel.findByIdAndDelete',async()=>{
        req.params.productId = productId
        await productController.deleteProduct(req,res,next)
        expect(productModel.findByIdAndDelete).toBeCalledWith(productId)
    })

    it('should return 200 response',async()=>{
        let deletedProduct = {name:'deletedProduct',description:'it is deleted'}
        productModel.findByIdAndDelete.mockReturnValue(deletedProduct)
        await productController.deleteProduct(req,res,next)
        expect(res.statusCode).toBe(200)
        expect(res._getJSONData()).toStrictEqual(deletedProduct)
        expect(res._isEndCalled()).toBeTruthy()
    })

    it('should return 404 when item doent exist',async()=>{
        productModel.findByIdAndDelete.mockReturnValue(null)
        await productController.deleteProduct(req,res,next);
        expect(res.statusCode).toBe(404)
        expect(res._isEndCalled()).toBeTruthy()
    })

    it('should handle errors',async()=>{
        const errorMessage = {message:'Error deleteing'}
        const rejectedPromise = Promise.reject(errorMessage)
        productModel.findByIdAndDelete.mockReturnValue(rejectedPromise)
        await productController.deleteProduct(req,res,next)
        expect(next).toHaveBeenCalledWith(errorMessage)
    })
})