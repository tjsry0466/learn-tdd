const productController = require("../../controller/products");
const productModel = require('../../models/Product');
const httpMocks = require('node-mocks-http');
const newProduct = require('../data/new-product.json');

productModel.create = jest.fn();

let req, res, next;
beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
})

describe('Product Controller Create', function () {
    beforeEach(() => {
        req.body = newProduct;
    })
    it("should have a createProduct function", () => {
        expect(typeof productController.createProduct).toBe("function");
    })
    it("should call ProductModel.create", async () => {
        await productController.createProduct(req, res, next);
        expect(productModel.create).toBeCalledWith(newProduct);
    });
    it("should return 201 response code", async () => {
        await productController.createProduct(req, res, next);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("shoild return json body in response", async () => {
        productModel.create.mockReturnValue(newProduct);
        await productController.createProduct(req, res, next);
        expect(res._getJSONData()).toStrictEqual(newProduct);
    });
    it("should handle errors", async () => {
        // 몽고디비에 의존하지 않기 위해 promise reject 객체 생성
        const errorMessage = {message: "description property missing"}
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.create.mockReturnValue(rejectedPromise);
        await productController.createProduct(req, res, next);
        // middleware function을 위한 callback 인자
        expect(next).toBeCalledWith(errorMessage);
    });
});