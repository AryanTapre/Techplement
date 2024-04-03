
export class ApiError extends Error{
    private statusCode:number;
    private data:unknown;
    public message:string;
    private errors:unknown[];
    private success:boolean;

    constructor(statusCode:number, message:string, errors:unknown[], stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.errors = errors;
        this.success = false;

        if(stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}