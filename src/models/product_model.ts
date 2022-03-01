import { Schema, model } from "mongoose";

interface ProductDoc extends Document{
    name: string;
    number: number;
    barcodeNumber: string;
    buyingPrice: number;
    saleingPrice: number;
    moneyType: string;
}

const productSchema = new Schema<ProductDoc>({
    name: { 
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
    moneyType: {
        type: String,
        required: true
    }
});

const ProductModel = model<ProductDoc>('Product', productSchema);

export { ProductModel };