import express from 'express';
import {
         signup,
         logout,
         login,
         profile
        }
from "../controllers/user.controller.js";

import {userAuthentication} from "../middlewares/auth.middleware.js"
import {upload} from  "../middlewares/multer.middleware.js"
const userRouter = express.Router();
userRouter.route("/signup").post(signup);
userRouter.route("/logout").post(userAuthentication,logout);
userRouter.route("/login").post(login);
userRouter.route("/profile/update").post([userAuthentication,upload.fields([
    {
        name:"profilePhoto",
        maxCount:1
    }
])],profile);

export {userRouter};