import express from 'express';
import {signup} from "../controllers/user.controller.js";

const userRouter = express.Router();
userRouter.route("/signup").post(signup);


export {userRouter};