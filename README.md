# tdd-app-lecture

### 사용한 라이브러리
- node.js
- express
- Jest

### TDD 개발방법?
- test 코드를 작성하고 실제 코드를 작성한다

### 흐름
- Create
    1. shold haver a function -- toBe('function')
    2. product model의 create 함수 호출되는지 확인
    3. 상태값 확인
    4. 결과값 확인
    5. 에러처리
- Read 
    1. 함수가 있는지 확인 -- should have a function 
    2. product model의 find 함수를 호출하는지 확인 -- shold call PoductModel.find({})
    3. 상태값 확인
    4. 가져온 product 데이터를 클라이언트에 전달