import express from 'express';
import dotenv from 'dotenv';


const app = express();
dotenv.config();

//Router
import { userRouter } from './router/user';
import { productRouter } from './router/product';
import { authRouter } from './router/auth';
import { errorHandler } from './middlewares/error_handler';

app.all('*', (req, res)=>{
    res.status(404);
});

//Token

app.use('/auth', authRouter);
app.use('/api', userRouter);
app.use('/api', productRouter);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log('API listen Port: ' + process.env.PORT);
});