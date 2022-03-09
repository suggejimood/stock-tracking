import { Schema, model } from 'mongoose';
import { Product } from './product_model';
import { User } from './user_model';

interface CompanyDoc extends Document{
    name: string,
    users: Array<User>
    products: Array<Product>
}

const companySchema = new Schema<CompanyDoc>({
    name: {
        type: String,
        unique: true,
        required: true
    },
    users: [{
        id:{
            type: String
        },
        email: {
            type: String
        }
    }],
    products: [{
        barcodeNumber:{
            type: String
        },
        name: {
            type: String
        }
    }]
});

const CompanyModel = model<CompanyDoc>('company', companySchema);

export { CompanyModel };