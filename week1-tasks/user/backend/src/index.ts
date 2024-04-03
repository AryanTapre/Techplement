import {app} from "./config/app.js";
import {connectDB, ConnectionObject} from "./config/database.js";
import {ApiError} from "./utiles/ApiError.js";


const connectionState:Promise<ConnectionObject> = connectDB();
connectionState
    .then((response:ConnectionObject) => {
        app.listen(process.env.SERVER_PORT,() => {
            //@ts-ignore
            response.httpServer.port = process.env.SERVER_PORT as string;
            response.httpServer.status = true;
            console.log(response);

        })
    })
    .catch((response:ConnectionObject) => {
        throw new ApiError(500,"failed to connect to database server",[response])
    })



