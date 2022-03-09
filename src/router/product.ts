import express, { Request, Response } from 'express';
import { AlreadyExistError } from '../errors/already_exist_error';
import { BadRequestError } from '../errors/bad_request_error';
import { JWTisnotValid } from '../errors/jwt_isNotValid_error';
import { NotFoundError } from '../errors/not_found_error';
import { UnauthorizedError } from '../errors/unauthorized_error';
import { jwtSaleandMarketing } from '../middlewares/jwt_permission';
import { validateRequest } from '../middlewares/validate_request';
import { validateAddNewUser } from '../middlewares/validation_middleware';
import { CompanyModel } from '../models/company_model';
import { Product, ProductModel } from '../models/product_model';
import { UserModel } from '../models/user_model';
import { jwtID } from '../services/jwt_parser';

const router = express.Router();

router.post('/add_new_product', validateAddNewUser(), validateRequest, jwtSaleandMarketing, async (req: Request, res: Response) => {
    const { name, number, barcodeNumber, buyingPrice, saleingPrice } = req.body;
    
    const id = await jwtID(req);
    const user = await UserModel.findById(id);

    if(!user){
        throw new JWTisnotValid();
    }

    const existingBarcode = await ProductModel.findOne({barcodeNumber});

    if(existingBarcode){
        throw new AlreadyExistError('This barcode number has already taken!');
    }

    const newProduct = {
        name,
        companyID: user.companyId,
        number,
        barcodeNumber,
        buyingPrice,
        saleingPrice,
    };

    const product = await new ProductModel(newProduct);
    await product.save();

    const company = await CompanyModel.findById(user.companyId);
    
    if(!company){
        throw new BadRequestError('Company can not found');
    }

    let productList = company.products;
    let addNewProduct = await new Product(product.barcodeNumber, product.name)
    productList.push(addNewProduct);

    await company.updateOne({products: productList});

    res.status(200).json(product);
});

router.delete('/delete_product', jwtSaleandMarketing, async (req, res) => {
    const { barcodeNumber } = req.body;
    const id = await jwtID(req);

    if(!id){
        throw new JWTisnotValid();
    }

    const deletedProduct = await ProductModel.findOneAndDelete({barcodeNumber: barcodeNumber});

    if(!deletedProduct){
        throw new BadRequestError('Product can not found or deleted');
    }

    const user = await UserModel.findById(id);

    if(!user){
        throw new UnauthorizedError();
    }

    const company = await CompanyModel.findById(user.companyId);

    if(!company){
        throw new BadRequestError('Company can not found');
    }

    let productList: any = [];

    company.products.forEach(product => {
        if(product.barcodeNumber != barcodeNumber){
            productList.push(product)
        }
    });

    await company.updateOne({products: productList});

    res.status(200).json({msg: "true"});
});

router.put('/update_stock', jwtSaleandMarketing, async (req, res) => {
    const { barcode, number } = req.body;

    const userID = await jwtID(req);
    const user = await UserModel.findById(userID);

    if(!user){
        throw new JWTisnotValid();
    }

    const product = await ProductModel.findOne({barcodeNumber: barcode});

    if(!product){
        throw new BadRequestError('Product can not found!');
    }

    if(number < 0){
        throw new BadRequestError('Product number can not be negative number');
    }

    if(product.companyID != user.companyId){
        throw new NotFoundError();
    }

    await product.updateOne({number: number});

    res.status(200).json(product);
});

router.get('/stock/:id', async (req, res) => {
    const id = req.params.id;

    const userID = await jwtID(req);
    const user = await UserModel.findById(userID);

    if(!user){
        throw new JWTisnotValid();
    }

    const product = await ProductModel.findById(id);

    if(!product){
        throw new BadRequestError('Product can not found!');
    }

    if(`${product._id}` != user.companyId){
        throw new NotFoundError();
    }

    res.status(200).json({stock: product.number});
});

export { router as productRouter };