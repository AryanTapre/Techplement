import express,{Express,Request,Response} from "express";
import {config} from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import {userRouter} from "../routes/user.route.js";

config({
     path:'src/environmentVariables/.env',
})

const app:Express = express();

app.use(express.json({
     limit:'200mb'
}))

app.use(express.urlencoded({
     limit:'100kb',
     extended:true
}))

app.use(cookieParser());

app.use(morgan('tiny'));

app.use(cors({
     origin: process.env.CORS_ORIGIN,
     credentials: true,
     optionsSuccessStatus:200,
     preflightContinue:true
}))

app.options('*',(request:Request,response:Response) => {
     response.setHeader('Access-Control-Allow-Header','Authorization');
     response.setHeader('Access-Control-Allow-Header','AccessToken');
     response.setHeader('Access-Control-Allow-Header','RefreshToken');
     response.sendStatus(200);
})

app.use('/api/v1',userRouter);

export {app};