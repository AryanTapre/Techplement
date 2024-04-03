import {User} from "../models/user.model.js";
import {sendTokens} from "../utiles/sendTokens.js";
import {ApiResponse} from "../utiles/ApiResponse.js";
import {ApiError} from "../utiles/ApiError.js";
import {asyncHandler} from "../utiles/AsyncHandler.js";
import {Request,Response} from "express";

const signup = asyncHandler(async (request:Request, response:Response):Promise<void> => {
    try {

        const {email,password}  = request.body;
        if([email,password].some(element => element.trim() === "")) {
            response.status(400).json(new ApiError(400,"email and password are mandatory",["enable to found email and password "]));
        }

        const existingUser = await User.findOne({
            email:email,
        })

        if(existingUser) {
            response.status(400).json(new ApiResponse(400,"user already exists",null));
            return;
        }

        const newUser = new User({
            email:email,
            password:password,

        })

        await newUser.save().then((savedUser) => {
            console.log(`user created successfully with id:${savedUser._id}`);
        }).catch((error) => {
            throw new ApiError(500,"failed to create new user",[error]);
        })


        await sendTokens(newUser,response);

    } catch (error) {
        throw new ApiError(500,"error at signup controller",[error]);
    }
})

const logout = asyncHandler(async (request:Request, response:Response) => {
    try {
        //@ts-ignore
        const userUpdated = await User.findByIdAndUpdate(request.userID,{
            refreshToken: {
                token: undefined
            }
        });

        if(userUpdated) {
            //@ts-ignore
           response
               .status(200)
               .clearCookie("accessToken")
               .clearCookie("refreshToken")
               .json(new ApiResponse(200,"user logged out successfully",{
                   id:userUpdated._id,
                   email:userUpdated.email
               }))
        }

    } catch (error) {
        throw new ApiError(500,"error in logout handler",[error])
    }
})

const login = asyncHandler(async (request:Request, response:Response) => {
    try {

        const {email,password}  = request.body;
        if([email,password].some(element => element.trim() === "")) {
            response.status(400).json(new ApiError(400,"email and password are mandatory",["enable to found email and password "]));
        }

        const existingUser = await User.findOne({
            email:email
        }).select("+password");

        if(!existingUser) {
            throw new ApiResponse(400,"user-account does not exists",["please, create an account first"])
        }

        //@ts-ignore
        if(existingUser.validatePassword(existingUser.password)) {
            await sendTokens(existingUser,response);
        } else {
            throw new ApiError(400,"invalid password",["wrong password received!"]);
        }

    } catch (error) {
        throw new ApiError(500,"Error at login handler",[error]);
    }
})




export {signup,logout,login};