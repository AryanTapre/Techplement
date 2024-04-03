import {Schema,model,Model} from 'mongoose';
import bcryptjs from "bcryptjs"
import crypto from "crypto";
import jwt from 'jsonwebtoken';

interface IUser {
    email:string;
    password:string;
    refreshToken: {
        token:string;
        revoke:boolean;
    };
    profilePhoto:Buffer;
    address:string;
    dob:Date;
    createdAt:Date;
    updatedAt:Date;
}

interface IUserMethods {
    validatePassword(userPassword:string):Promise<boolean>;
    generateAccessToken():any;
    generateRefreshToken():any;
}

type UserModel = Model<IUser,{},IUserMethods>;

const userSchema = new Schema<IUser,UserModel,IUserMethods>({
    email: {
        type: String,
        required:true
    },
    password:{
        type: String,
        required:true
    },
    refreshToken:{
        token: {
            type:String
        },
        revoke: {
            type:Boolean
        }
    },
    profilePhoto: {
        type:Buffer
    },
    address: {
        type:String,
    },
    dob: {
        type:Date
    },
    createdAt: {
        type:Date,
        default:Date.now
    },
    updatedAt: {
        type:Date
    }
})

userSchema.pre('save',async function () {
    //@ts-ignore
    this.password = await bcryptjs.hash(this.password,10);
})

userSchema.method('validatePassword',function (userPassword:string):Promise<boolean> {
    //@ts-ignore
    return bcryptjs.compare(userPassword,this.password);
})

userSchema.method('generateAccessToken', function () {
    return jwt.sign(
        {id:this._id},
        process.env.JWT_SECRET_KEY as string ,
        {
            expiresIn:'2d'
        }
    )
})

userSchema.method('generateRefreshToken', function () {
    //@ts-ignore
    const refreshToken = crypto.randomBytes(20).toString("hex");
    //@ts-ignore
    this.refreshToken.token = crypto.createHash('sha256').update(refreshToken).digest("hex");

    return jwt.sign(
        {id:this._id,refreshToken:refreshToken},
        process.env.JWT_SECRET_KEY as string,
        {
            expiresIn:'7d',
        }
    )
})

const User = model<IUser,UserModel>('user',userSchema);
export {User};