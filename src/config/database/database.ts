import mongoose from "mongoose";
import { DbConnectionError } from "../../errors/db_connection_error";

const connectDB = async () => {
    const type = await mongoose.connect(`${process.env.MONGODB}`);
    console.log("Connection is OK");
    if(!type){
        throw new DbConnectionError();
    }
};

export { connectDB };