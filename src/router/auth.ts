import express from 'express';
import { UserModel } from '../models/user_model';
import jwt from 'jsonwebtoken';
import { NotFoundError } from '../errors/not_found_error';

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

    const token = await jwt.sign(prd, `${process.env.KEY}`);

    res.header('token', token);
    res.status(200).json({msg: true});
});

router.get('/logout', (req, res) => {
    const token = '';

    res.header('token', token);
    res.status(200).json({msg: true})
});

router.post('/register', async (req, res) => {
    const { name, surname, email, password } = req.body;

    const newUser = {
        name,
        surname,
        email,
        password
    };

    const existingEmail = await UserModel.findOne(email);

    if(existingEmail){
        throw new Error('This email has been used before');
    }

    const user = await new UserModel(newUser);
    await user.save();

    res.status(200).json(user);
});

export { router as authRouter };