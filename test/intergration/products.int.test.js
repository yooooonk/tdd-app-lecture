const { TestScheduler } = require('jest');
const request = require('supertest');
const app = require('../../server');
const newProduct = require('../data/new-product.json')

let firstProduct ;

it("POST /api/products",async ()=>{
    const res = await request(app)
        .post("/api/products")
        .send(newProduct);

    expect(res.statusCode).toBe(201)
    expect(res.body.name).toBe(newProduct.name)
    expect(res.body.description).toBe(newProduct.description)
    
})

it("shold return 500 on POST /api/products", async ()=>{
    const res =  await request(app)
                        .post('/api/products')
                        .send({name:'phone'})
    
    expect(res.statusCode).toBe(500);
    
    expect(res.body).toStrictEqual({message:"Product validation failed: description: Path `description` is required."})
})

test('GET /api/produts',async()=>{
    const res = await request(app).get('/api/products');

    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBeTruthy()
    expect(res.body[0].name).toBeDefined()
    expect(res.body[0].description).toBeDefined()
    firstProduct = res.body[0]
})

test('GET /api/product/:productId',async()=>{
    
    const response = await request(app).get('/api/products/'+firstProduct._id)
    expect(response.statusCode).toBe(200)
    expect(response.body.name).toBe(firstProduct.name)
    expect(response.body.description).toBe(firstProduct.description)
})

test('GET id doenst exist /api/products/:productId',async()=>{
    const response = await request(app).get('/api/products/5febd3236931533e7c06111c')
    expect(response.statusCode).toBe(404)
})

test('PUT /api/products',async()=>{
    const res = await request(app).put('/api/products/'+firstProduct._id)
                                    .send({name:'LG',description:'valet'})
    expect(res.statusCode).toBe(200)
    expect(res.body.name).toBe('LG')
    expect(res.body.description).toBe('valet')
})

test('PUT id doenst exist /api/products/:productId',async()=>{
    const res = await request(app).put('/api/products/5febd3236931533e7c06111c')
                                    .send({name:'LG',description:'valet'})
    expect(res.statusCode).toBe(404)
})

test('DELETE /api/products',async()=>{
    const res = await request(app).delete('/api/products'+firstProduct._id)
                                    .send()
    expect(res.statusCode).toBe(200);
})

it('DELETE id doenst exist /api/products/:productId',async()=>{
    const res = await request(app)
                        .delete('/api/products/5febd3236931533e7c06111c')
                        .send()
    expect(res.statusCode).toBe(404)
})