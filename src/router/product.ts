import express from 'express';
import { AlreadyExistError } from '../errors/already_exist_error';
import { ProductModel } from '../models/product_model';

const router = express.Router();

router.post('/add_new_product', async (req, res) => {
    const { name, number, barcodeNumber, buyingPrice, saleingPrice, moneyType } = req.body;

    const existingBarcode = await ProductModel.findOne(barcodeNumber);

    if(existingBarcode){
        throw new AlreadyExistError('This barcode number has already taken!');
    }

    const newProduct = {
        name,
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

router.put('/update_stock', async (req, res) => {
    const { id, number } = req.body;

    const product = await ProductModel.findByIdAndUpdate(id, {number: number});

    if(!product){
        throw new Error('Product can not update');
    }

    res.status(200).json(product);
});

router.get('/stock/:id', async (req, res) => {
    const id = req.params.id;

    const product = await ProductModel.findById(id);

    if(!product){
        throw new Error();
    }

    res.status(200).json({stock: product.number});
});

export { router as productRouter };