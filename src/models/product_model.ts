import { Schema, model } from "mongoose";

class Product{
    public barcodeNumber: string;
    public name: string;

    constructor(barcodeNumber: string, name: string){
        this.barcodeNumber = barcodeNumber;
        this.name = name;
    }
}

interface ProductDoc extends Document{
    name: string;
    companyID: string,
    number: number;
    barcodeNumber: string;
    buyingPrice: number;
    saleingPrice: number;
}

const productSchema = new Schema<ProductDoc>({
    name: { 
        type: String, 
        required: true
    },
    companyID: {
        type: String,
        required: true
    },
    number:{
        type: Number,
        required: true,
        min: 0
    },
    barcodeNumber:{
        type: String,
        unique: true,
        required: true
    },
    buyingPrice: {
        type: Number,
        required: true,
        min: 0
    },
    saleingPrice: {
        type: Number,
        required: true,
        min: 0
    },
});

const ProductModel = model<ProductDoc>('product', productSchema);

export { ProductModel, Product };