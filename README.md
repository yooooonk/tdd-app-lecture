# tdd-app-lecture

### 사용한 라이브러리
- node.js
- express
- Jest

### TDD 개발방법?
- test 코드를 작성하고 실제 코드를 작성한다

### 흐름
- 함수인지 확인 : expect().toBe('function')
- 함수를 호출하는지 확인 : expect.toBeCalledWith -- mockfunction 이용
- 상태값 확인 : expect(res.statusCode).toBe(200)
- 결과값 확인 : expoect(res._getJSONData()).toStrictEqual(xx)
- 에러처리

