import express from 'express';
import { AlreadyExistError } from '../errors/already_exist_error';
import { BadRequestError } from '../errors/bad_request_error';
import { NotFoundError } from '../errors/not_found_error';
import { UserModel } from '../models/user_model';
import { jwtID } from '../services/jwt_parser';

const router = express.Router();

router.post('/add_new_user', async (req, res) => {
    const { name, surname, email, department, password } = req.body;

    const existingEmail = await UserModel.findOne(email);
    
    if(existingEmail){
        throw new AlreadyExistError("This email already using");
    }

    const userAtr = {
        name,
        surname,
        email,
        department,
        password
    };

    const user = await new UserModel(userAtr);
    user.save();

    res.status(200).json(user);
});

router.get('/profile/:id', async (req, res) => {
    const id = req.query.id;

    const user = await UserModel.findById(id);

    if(!user){
        throw new NotFoundError();
    }

    const showUser = {
        name: user.name,
        surname: user.surname,
        email: user.email,
        departman: user.department
    };

    res.status(200).json(showUser);
});

router.put('/update_profile', async (req, res) => {
    const { name, surname, email } = req.body;
    const id = jwtID(req);

    if(name == null || surname == null || email == null){
        throw new BadRequestError('Name, email or surname can not be null');
    }
    
    const existingUser = await UserModel.findOne({email});

    if(existingUser){
        throw new AlreadyExistError('This email ');
    }

    const user = await UserModel.findByIdAndUpdate(id, {name, surname});

    if(!user){
        throw new BadRequestError("User can not found or can not update!");
    }

    
    res.status(200).json(user);
});

router.put('/update_user_profile', async (req, res) => {
    const { id, name, surname, email } = req.body;

    const user = await UserModel.findByIdAndUpdate(id, { name, surname });

    if(!user){
        throw new BadRequestError('User can not found or can not update!');
    }

    res.status(200).json(user);
});

router.get('/user_list', async (req, res) => {
    const userList = await UserModel.find();

    res.status(200).json(userList);
});

export { router as userRouter }