import  mongoose,{Mongoose} from "mongoose";
import {ApiError} from "../utiles/ApiError.js";
import {DB_NAME} from "../constants/constant.js";
import express, {Express} from "express";


const app:Express = express();
export interface ConnectionObject {
    database: {
        status:string|number;
        host?:string;
        port?:string;
        name?:string;
        httpServerStatus?:boolean;
        httpServerPort?:string;
    },
    httpServer: {
        status?:boolean;
        port?:string;
    }

}


export const connectDB = async() => {

    let connectionStatus:any;

    try {
        const connectionInstance = await  mongoose.connect(`${process.env.MONGODB_CONNECTION_URL}/${DB_NAME}`);
        connectionStatus = connectionInstance;

        app.on('error',(error):void => {
            throw new ApiError(500,'Express cannot talk to mongoDB',[error]);
            process.exit(1);
        })


    } catch(error) {
        throw new ApiError(500,"error in connectDB()",[error]);
    }

    return new Promise<ConnectionObject>((resolve, reject) => {
        if(connectionStatus) {
            resolve({
                database: {
                    status: `connected to database server..`,
                    host:`${connectionStatus.connection?.host}`,
                    port:`${connectionStatus.connection?.port}`,
                    name:`${connectionStatus.connection?.name}`
                },
                httpServer:{}
            })
        } else {
            reject({
                status:0
            })
        }
    })
}