import express, { Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserModel } from '../models/user_model';
import { NotFoundError } from '../errors/not_found_error';
import { CompanyModel } from '../models/company_model';
import { AlreadyExistError } from '../errors/already_exist_error';
import { FinanceModel } from '../models/finance_model';
import { validateLogin, validateNewRegister } from '../middlewares/validation_middleware';
import { validateRequest } from '../middlewares/validate_request';

const router = express.Router();

router.post('/login', validateLogin(), validateRequest, async (req: Request, res: Response)=>{
    const { email, password } = req.body;

    const user = await UserModel.findOne({email});

    if(!user){
        throw new NotFoundError();
    }

    if(password != user.password){
        throw new NotFoundError()
    }

    const prd = {
        id: user.id
    }

    const token = await jwt.sign(prd, `${process.env.KEY}`, {expiresIn: '1d'});

    res.cookie('access-cookie', token, {secure: false});
    res.status(200).json({msg: true});
});

router.get('/logout', (req: Request, res: Response) => {
    const token = '';

    res.cookie('access-cookie', token);
    res.status(200).json({msg: true})
});

router.post('/register', validateNewRegister(), validateRequest, async (req: Request, res: Response) => {
    const { name, surname, email, password, companyName, } = req.body;

    const existingEmail = await UserModel.findOne({email});

    if(existingEmail){
        throw new AlreadyExistError('This email has been used before');
    }

    const existingCompany = await CompanyModel.findOne({name: companyName});

    if(existingCompany){
        throw new AlreadyExistError('This company has been used before');
    }


    const company = await new CompanyModel({name: companyName});
    await company.save();

    const newUser = {
        name,
        surname,
        email,
        password,
        department: 0,
        companyId: company._id,
    };

    const user = await new UserModel(newUser);
    await user.save();

    const newFinance = {
        companyId: company._id,
        totalMoney: 0
    };

    const finance = await new FinanceModel(newFinance);
    finance.save();

    let users = [];
    const _user = await new User(user.email, `${user._id}`);
    users.push(_user);

    await company.updateOne({users: users});

    res.status(200).json({user, company, finance});
});

export { router as authRouter };