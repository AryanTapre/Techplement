import multer from "multer";
import {Request} from "express";
import path from "node:path";

let fileName:any;

const storage = multer.diskStorage({
    destination: function (req:Request, file, callback) {
        //@ts-ignore
        fileName = req.userID +`_profile_photo`+path.extname(file.originalname);
        console.log("filename",fileName);
        callback(null,"./public/uploads/user/profile/");
    },
    filename: function (req:Request, file, callback) {
        console.log("filename=>",fileName);
        callback(null,fileName );
    }
})

console.log("inside multer middleware...");

export const upload = multer({
    storage,
    limits:{
        fileSize:3000000 // 3MB
    }
})