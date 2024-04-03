import {User} from "../models/user.model.js";
import {ApiError} from "./ApiError.js";
import {ApiResponse} from "./ApiResponse.js";
import {Response} from "express";
import {markAsUntransferable} from "node:worker_threads";

const sendTokens = async (user:any,response:Response) => {
    try{
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        await user.save({validateBeforeSave:false});

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
            .json(new ApiResponse(201,"user created successfully",{user:user,accessToken:accessToken,refreshToken:refreshToken}))

    } catch (error) {
        throw new ApiError(500,"sendTokens error",error as Array<string>);
    }
}

export {sendTokens};