import express from 'express';
import { User, UserModel } from '../models/user_model';
import jwt from 'jsonwebtoken';
import { NotFoundError } from '../errors/not_found_error';
import { CompanyModel } from '../models/company_model';
import { AlreadyExistError } from '../errors/already_exist_error';

const router = express.Router();

router.post('/login', async (req, res)=>{
    const { email, password } = req.body;

    const user = await UserModel.findOne(email);

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

    res.header('token', token);
    res.status(200).json({msg: true});
});

router.get('/logout', (req, res) => {
    const token = '';

    res.header('token', token);
    res.status(200).json({msg: true})
});

router.post('/register', async (req, res) => {
    const { name, surname, email, password, companyName, } = req.body;

    const existingCompany = await CompanyModel.findOne({companyName});

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

    const existingEmail = await UserModel.findOne(email);

    if(existingEmail){
        throw new Error('This email has been used before');
    }

    const user = await new UserModel(newUser);
    await user.save();

    let users = [];
    const _user = await new User(user.email, `${user._id}`);
    users.push(_user);

    await company.updateOne({users: users});

    res.status(200).json({user, company});
});

export { router as authRouter };