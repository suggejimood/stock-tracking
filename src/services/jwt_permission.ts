import { Request } from "express"
import { BadRequestError } from "../errors/bad_request_error";
import { UnauthorizedError } from "../errors/unauthorized_error";
import { UserModel } from "../models/user_model";
import { jwtID } from "./jwt_parser";

const jwtAdmin = async (req: Request) => {
    const id = await jwtID(req);

    const user = await UserModel.findById(id);

    if(!user){
        throw new UnauthorizedError();
    }

    if(user.department != "1"){
        throw new BadRequestError("You dont have permision");
    }

    return id;
};

const jwtSaleandMarketing = async (req: Request) => {

};

export { jwtAdmin };