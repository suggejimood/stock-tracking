import { NextFunction, Request, Response } from "express"
import { BadRequestError } from "../errors/bad_request_error";
import { UnauthorizedError } from "../errors/unauthorized_error";
import { UserModel } from "../models/user_model";
import { jwtID } from "../services/jwt_parser";

const jwtAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const id = await jwtID(req);

    const user = await UserModel.findById(id);

    if(!user){
        throw new UnauthorizedError();
    }

    if(user.department != 0 as Number){
        throw new BadRequestError("You dont have permision");
    }

    next();
};

const jwtSaleandMarketing = async (req: Request, res: Response, next: NextFunction) => {
    const id = await jwtID(req);

    const user = await UserModel.findById(id);

    if(!user){
        throw new UnauthorizedError();
    }

    if(user.department != 1 as Number || user.department != 0 as Number){
        throw new BadRequestError("You dont have permision");
    }

    next();
};

export { 
    jwtAdmin,
    jwtSaleandMarketing,
 };