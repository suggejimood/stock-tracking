import express from 'express';
import { BadRequestError } from '../errors/bad_request_error';
import { NotFoundError } from '../errors/not_found_error';
import { jwtAccountant, jwtSaleandMarketing } from '../middlewares/jwt_permission';
import { CompanyModel } from '../models/company_model';
import { FinanceModel } from '../models/finance_model';
import { ProductModel } from '../models/product_model';
import { UserModel } from '../models/user_model';
import { jwtID } from '../services/jwt_parser';

const router = express.Router();

router.get('/total_money', jwtAccountant, async (req, res) => {
    const id = await jwtID(req);

    const user = await UserModel.findById(id);

    if(!user){
        throw new BadRequestError('User can not found');
    }

    const company = await CompanyModel.findById(user.companyId);

    if(!company){
        throw new BadRequestError('Company can not found');
    }

    const finance = await FinanceModel.findOne({companyId: company._id})

    if(!finance){
        throw new BadRequestError('Finance table can not found');
    }

    res.status(200).json({totalMoney: finance.totalMoney})
});

router.post('/sell/:id', jwtSaleandMarketing, async (req, res) => {
    const userId = await jwtID(req);
    const id = req.params.id;
    const { number } = req.body;

    const user = await UserModel.findById(userId);

    if(!user){
        throw new BadRequestError('User can not found');
    }

    const company = await CompanyModel.findById(user.companyId);

    if(!company){
        throw new BadRequestError('Company can not found');
    }

    const product = await ProductModel.findById(id);

    if(!product){
        throw new BadRequestError('Product can not found');
    }

    const productList = company.products;
    let flag: boolean = false;

    productList.forEach(value => {
        if(value.id == id){
            flag = true;
        }
    });

    if(!flag){
        throw new NotFoundError();
    }

    if(product < number){
        throw new BadRequestError('Stock can not be less then zero');
    }

    const stock = product.number - number;
    await product.updateOne({number: stock});

    res.status(200).json(product);
});

export { router as financeRouter };