import {ApiError} from "./ApiError.js";
import {Request,Response} from  "express";

type AsyncHandler = (request:Request, response:Response) => Promise<void>;

export const asyncHandler = (handleRequest:AsyncHandler) => async (request:Request, response:Response)  => {
    try {
        await handleRequest(request, response);
    }
    catch (error) {
        throw new ApiError(500,"error at AsyncHandler side",[error]);
    }
}