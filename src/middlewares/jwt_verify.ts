import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWTisnotValid } from '../errors/jwt_isNotValid_error';
import { UnauthorizedError } from '../errors/unauthorized_error';

const verify = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['token'] || req.body.token;

    if(!token){
        throw new UnauthorizedError();
    }

    const decode = <any>jwt.verify(token, `${process.env.KEY}`);
    const { id } = decode;

    if(!decode){
        throw new JWTisnotValid();
    }

    const newToken = jwt.sign({id}, `${process.env.KEY}`);
    res.header('token', newToken);

    next();
};

export { verify };