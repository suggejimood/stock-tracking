import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { JWTisnotValid } from '../errors/jwt_isNotValid_error';
import { UnauthorizedError } from '../errors/unauthorized_error';

async function jwtID(req: Request){
    const token = req.headers['x-access-token'] || req.body.token || req.query.token;

    console.log(token)

    if(!token){
        throw new UnauthorizedError();
    }

    const decode = await <any>jwt.verify(token, `${process.env.JWT_SECRET}`);

    if(!decode){
        throw new JWTisnotValid();
    }
    
    const { id } = decode;

    return id;
}

export { jwtID };