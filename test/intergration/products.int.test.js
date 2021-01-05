const request = require('supertest');
const app = require('../../server');
const newProduct = require('../data/new-product.json')


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
    console.log('res.body',res.body)
    expect(res.body).toStrictEqual({message:'Product validation failed: description: Path `description` is required.'})
})