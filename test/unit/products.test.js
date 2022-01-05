const productController = require("../../controller/products");
const productModel = require('../../models/Product');
const httpMocks = require('node-mocks-http');
const newProduct = require('../data/new-product.json');
const allProducts = require('../data/all-products.json');

productModel.create = jest.fn();
productModel.find = jest.fn();
productModel.findById = jest.fn();
productModel.findByIdAndUpdate = jest.fn();
productModel.findByIdAndDelete = jest.fn();

const productId = "dafsdfdsafs";
const updatedProduct = {name: 'updated name', description: 'updated description'};
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

describe("Product Controller Get", () => {
    it("should have a getProducts functions", () => {
        expect(typeof productController.getProducts).toBe("function");
    })
    it("shold call ProductModel.find({})", async () => {
        await productController.getProducts(req, res, next);
        expect(productModel.find).toHaveBeenCalledWith({});
    });
    it('should return 200 response', async() => {
        await productController.getProducts(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled).toBeTruthy();
    })
    it('should return json body in response', async () => {
        productModel.find.mockReturnValue(allProducts);
        await productController.getProducts(req, res, next);
        expect(res._getJSONData()).toStrictEqual(allProducts);
    });
    it('should handle errors', async () => {
        const errorMessage = {message: "Error finding product data"};
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.find.mockReturnValue(rejectedPromise);
        await productController.getProducts(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
});

describe("Product Controller GetById", () => {
    it("should have a getProductById", () => {
        expect(typeof productController.getProductById).toBe('function');
    })
    it('should call productModel.findById', async () => {
        req.params.productId = productId;
        await productController.getProductById(req, res, next);
        expect(productModel.findById).toBeCalledWith(productId);
    });
    it("should return json body and response code 200", async () => {
        productModel.findById.mockReturnValue(newProduct);
        await productController.getProductById(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(newProduct);
        expect(res._isEndCalled()).toBeTruthy()
    });
    it("should return 404 when item doesnt exist", async () => {
        productModel.findById.mockReturnValue(null);
        await productController.getProductById(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("should handle errors", async () => {
        const errorMessage = {message: "error"};
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.findById.mockReturnValue(rejectedPromise);
        await productController.getProductById(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    })
});

describe('Product Controller Update', () => {
    it('shuld have an updateProduct function', () => {
        expect(typeof productController.updateProduct).toBe('function');
    })
    it('should call productModel.findByIdAndUPdate', async () => {
        req.params.productId = productId;
        req.body = updatedProduct
        await productController.updateProduct(req, res, next);
        expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith(
            productId, updatedProduct,
            {new: true});
    });
    it('should return json body and response code 200', async () => {
        req.params.productId = productId;
        req.body = updatedProduct;
        productModel.findByIdAndUpdate.mockReturnValue(updatedProduct);
        await productController.updateProduct(req, res, next);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(updatedProduct);
    });
    it('should handle 404 when item doesnt exist', async () => {
        productModel.findByIdAndUpdate.mockReturnValue(null);
        await productController.updateProduct(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    })
    it('should handle errors', async () => {
        const errorMessage = {message: 'error'};
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
        await productController.updateProduct(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    })
});

describe('Product Controller Delete', () => {
    it('should have a deleteProduct function', () => {
        expect(typeof productController.deleteProduct).toBe('function');
    })
    it('should call ProductModel.findByIdAndDelete', async () => {
        req.params.productId = productId;
        await productController.deleteProduct(req, res, next);
        expect(productModel.findByIdAndDelete).toBeCalledWith(productId);
    });
    it('should return 200 response', async () => {
        let deletedProduct = {
            name: 'deletedProduct',
            description: 'it is deleted'
        }
        productModel.findByIdAndDelete.mockReturnValue(deletedProduct)
        await productController.deleteProduct(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(deletedProduct);
        expect(res._isEndCalled()).toBeTruthy();
    });
});
