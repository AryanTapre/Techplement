
 export class ApiResponse {
    private statusCode:number;
    private message:string;
    private data:unknown;
    private success:boolean;

    constructor(statusCode:number, message:string, data:unknown) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        if(this.statusCode >= 200 && this.statusCode <= 300 ) {
            this.success = true;
        } else {
            this.success = false;
        }
    }
 }