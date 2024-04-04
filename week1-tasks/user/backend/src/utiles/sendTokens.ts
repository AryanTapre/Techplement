import {IUser, User} from "../models/user.model.js";
import {ApiError} from "./ApiError.js";
import {ApiResponse} from "./ApiResponse.js";
import {Response} from "express";
import {HydratedDocument} from  "mongoose";

const sendTokens = async (user:any,response:Response) => {
    try{
        //@ts-ignore
        const accessToken = user.generateAccessToken();
        //@ts-ignore
        const refreshToken = user.generateRefreshToken();
        //@ts-ignore
        await user.save({validateBeforeSave:false});
        //@ts-ignore
        user.password = undefined;
        response
            .status(201)
            .cookie("accessToken",accessToken,{
                expires: new Date(Date.now() + 2*24*60*60*1000),
                httpOnly:true,
                secure:true,
                sameSite:'lax'
            })
            .cookie("refreshToken",refreshToken,{
                expires: new Date(Date.now() + 7*24*60*60*1000),
                httpOnly:true,
                secure:true,
                sameSite:'lax'
            })
            .json(new ApiResponse(201,"user account managed successfully",{user:user,accessToken:accessToken,refreshToken:refreshToken}))

    } catch (error) {
        throw new ApiError(500,"sendTokens error",error as Array<string>);
    }
}

export {sendTokens};