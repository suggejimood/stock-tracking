import express from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { verify } from './middlewares/jwt_verify';
import { NotFoundError } from './errors/not_found_error';
import { errorHandler } from './middlewares/error_handler';
import { connectDB } from "./config/database/database";

//Router
import { userRouter } from './router/user';
import { productRouter } from './router/product';
import { authRouter } from './router/auth';
import { financeRouter } from './router/finance';

const app = express();
app.use(express.json());
app.use(helmet());
dotenv.config();

//Token
app.use('/api', verify);

app.use('/auth', authRouter);
app.use('/api', userRouter);
app.use('/api', productRouter);
app.use('/api', financeRouter)

//404
app.all('*', (req, res)=>{
    throw new NotFoundError();
});

app.use(errorHandler);

app.listen(process.env.PORT, async () => {
    console.log('API listen Port: ' + process.env.PORT);
    await connectDB();
});