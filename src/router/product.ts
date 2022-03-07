import express from 'express';
import { AlreadyExistError } from '../errors/already_exist_error';
import { BadRequestError } from '../errors/bad_request_error';
import { JWTisnotValid } from '../errors/jwt_isNotValid_error';
import { NotFoundError } from '../errors/not_found_error';
import { jwtSaleandMarketing } from '../middlewares/jwt_permission';
import { ProductModel } from '../models/product_model';
import { UserModel } from '../models/user_model';
import { jwtID } from '../services/jwt_parser';

const router = express.Router();

router.post('/add_new_product', jwtSaleandMarketing, async (req, res) => {
    const { name, number, barcodeNumber, buyingPrice, saleingPrice, moneyType } = req.body;
    
    const id = jwtID(req);
    const user = await UserModel.findById(id);

    if(!user){
        throw new JWTisnotValid();
    }

    const existingBarcode = await ProductModel.findOne(barcodeNumber);

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
        moneyType,
    };

    const product = await new ProductModel(newProduct);
    await product.save();

    res.status(200).json({msg: true});
});

router.put('/update_stock', jwtSaleandMarketing, async (req, res) => {
    const { id, number } = req.body;

    const userID = await jwtID(req);
    const user = await UserModel.findById(userID);

    if(!user){
        throw new JWTisnotValid();
    }

    const product = await ProductModel.findById(id);

    if(!product){
        throw new BadRequestError('Product can not found!');
    }

    if(number < 0){
        throw new BadRequestError('Product number can not be negative number');
    }

    if(`${product._id}` != user.companyId){
        throw new NotFoundError();
    }

    product.update(id, {number: number});
    product.save();

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