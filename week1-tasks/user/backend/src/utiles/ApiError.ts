
export class ApiError extends Error{
    private statusCode:number;
    private data:unknown;
    public message:string;
    private errors:unknown[];
    private success:boolean;
    private msg:string

    constructor(statusCode:number, message:string, errors:unknown[], stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.errors = errors;
        this.success = false;
        this.msg = message;
        if(stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}