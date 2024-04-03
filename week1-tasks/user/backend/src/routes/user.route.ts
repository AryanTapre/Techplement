import express from 'express';
import {signup,logout,login} from "../controllers/user.controller.js";
import {userAuthentication} from "../middlewares/user.auth.middleware.js"
const userRouter = express.Router();
userRouter.route("/signup").post(signup);
userRouter.route("/logout").post(userAuthentication,logout);
userRouter.route("/login").post(userAuthentication,login);

export {userRouter};