import {IUser, IUserMethods, User, UserModel} from "../models/user.model.js";
import {sendTokens} from "../utiles/sendTokens.js";
import {ApiResponse} from "../utiles/ApiResponse.js";
import {ApiError} from "../utiles/ApiError.js";
import {asyncHandler} from "../utiles/AsyncHandler.js";
import {Request,Response} from "express";
import {HydratedDocument} from  "mongoose";
import path from "node:path";


interface IData {
    type:string,
    data:object|string|undefined;
}

interface IUserData {
    profilePhoto?:string;
    dob?:Date;
    address?:string;
}
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
            $unset: {
                refreshToken: {
                    token: 1
                }
            }
        },{new:true});

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

        const incomingToken =   request.cookies?.accessToken ||
                                request.header("Authorization")?.replace("Bearer ","") ||
                                request.body.accessToken;

        // checking if user forcefully send the login request even though he have tokens..
        if(incomingToken) {
            response
                .status(400)
                .json(new ApiError(400,"you are already logged-in",["user already loggedin to there account"]));
            return;
        }

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
            //@ts-ignore
            await sendTokens(existingUser,response);
        } else {
            throw new ApiError(400,"invalid password",["wrong password received!"]);
        }

    } catch (error) {
        throw new ApiError(500,"Error at login handler",[error]);
    }
})


const selectProfileDataToUpdate = (...data:any) => {
    let values = [];
    for(let n of data) {
        if(n.data) {
            values.push(n.type);
        }
    }
    return values;
}
const profile = asyncHandler(async (request:Request, response:Response) => {
    let userData:IUserData = {
    }
    //@ts-ignore
    const data:IData = [
        {
            type:"profilePhoto",
            //@ts-ignore
            data:request.files?request.files.profilePhoto:undefined
        },
        {
            type:"address",
            data:request.body?.address
        },
        {
            type:"dob",
            data:request.body?.dob
        }
    ]

    const selectedData = selectProfileDataToUpdate(...data as any);

    for (const d of selectedData) {
        switch (d) {
            case 'profilePhoto':
                //@ts-ignore
                userData.profilePhoto = request.files.profilePhoto[0].path;
                break;
            case 'address':
                userData.address = request.body?.address;
                break;
            case 'dob':
                const dateString = Date.parse(request.body?.dob);
                if(!isNaN(dateString)) {
                    userData.dob = new Date(dateString);
                }
                break;
        }
    }

    try  {
        //@ts-ignore
        const userUpdate = await User.findByIdAndUpdate(request.userID,userData);
        if(userUpdate) {
            //@ts-ignore
            userUpdate.refreshToken = undefined;
            response
                .status(200)
                .json(new ApiResponse(200,"user data updated successfully",userUpdate));
            return;
        }
    } catch (error) {
        throw new ApiError(500,"unable to update data",[error]);
    }
})


export {signup,logout,login,profile};