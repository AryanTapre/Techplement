import jwt from "jsonwebtoken";
import {ApiError} from "../utiles/ApiError.js";
import {NextFunction, Request, Response} from "express";

export const userAuthentication = (request:Request,response:Response,next:NextFunction) => {
                            //@ts-ignore
    const incomingToken =   request.cookies.accessToken ||
                            request.header("Authorization")?.replace("Bearer ","") ||
                            request.body.accessToken;

    if(!incomingToken) {
            response
                .status(401)
                .json(new ApiError(401,"you are not authenticated",["token not received"]));
    }
    else {
        // checking for unnecessary token..
        const path = request.route.path.split("/");
        if(path.includes("login")) {
            response
                .status(400)
                .json(new ApiError(400,"you are already logged-in",["user already loggedin to there account"]));
            return;

        }

        const decodeToken = jwt.verify(incomingToken,process.env.JWT_SECRET_KEY as string);
        if(!decodeToken) {
            response
                .status(400)
                .json(new ApiError(400,"access-token expired",["refresh access-token"]))
        }

        //@ts-ignore
        request.userID = decodeToken.id;
        next();
    }
}

