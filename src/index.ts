import express from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { verify } from './middlewares/jwt_verify';
import { errorHandler } from './middlewares/error_handler';
import { connectDB } from './config/database/database';


const app = express();
dotenv.config();
app.use(helmet());

//Router
import { userRouter } from './router/user';
import { productRouter } from './router/product';
import { authRouter } from './router/auth';

app.all('*', (req, res)=>{
    res.status(404);
});

//Token
app.use('/api', verify);

app.use('/auth', authRouter);
app.use('/api', userRouter);
app.use('/api', productRouter);

app.use(errorHandler);

app.listen(process.env.PORT, async () => {
    console.log('API listen Port: ' + process.env.PORT);
    await connectDB();
});