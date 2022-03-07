import { Schema, model } from "mongoose";

class User{
    public email: string;
    public id: string;

    constructor(email: string, id: string){
        this.email = email;
        this.id = id;
    }
}

interface UserDoc extends Document{
    name: string;
    surname: string;
    email: string;
    password: string;
    department: number;
    companyId: string;
}

const userSchema = new Schema<UserDoc>({
    name: { 
        type: String, 
        required: true
    },
    surname: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    department: {
        type: Number,
    },
    companyId: {
        type: String,
        required: true,
    }
});

const UserModel = model<UserDoc>('user', userSchema);

export { UserModel, User };