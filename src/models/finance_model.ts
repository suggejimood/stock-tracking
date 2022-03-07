import { Schema, model } from 'mongoose';

interface FinanceDoc extends Document{
    companyId: string,
    totalMoney: number
}

const financeSchema = new Schema<FinanceDoc>({
    companyId: {
        type: String,
        unique: true,
        required: true
    },
    totalMoney: {
        type: Number,
        default: 0,
        min: 0,
        required: true
    }
});

const FinanceModel = model<FinanceDoc>('finance', financeSchema);

export { FinanceModel };