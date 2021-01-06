//1. express.router 클래스를 이용해 router를 모듈로 작성하기
const express = require('express')
const router = express.Router()
const productController = require('./controller/products')

// 2. ㄱrouter에서 미들웨어 함수를 load하기
router.post('/',productController.createProduct);
router.get('/',productController.getProducts);
router.get('/:productId',productController.getProductById);

module.exports = router;
// 3. 몇몇 Route를 정의하기

// 4. 기본앱의 한 경로에 라우터 모듈을 마운트하기
