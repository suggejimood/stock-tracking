import { Schema, model } from "mongoose";

interface UserDoc extends Document{
    name: string;
    surname: string;
    email: string;
    password: string;
    department: string;
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
        type: String,
    },
});

const UserModel = model<UserDoc>('User', userSchema);

export { UserModel };