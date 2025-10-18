import { Response } from "express";
import { HttpStatus, SuccessMessage } from "../constants/messages";

export class ApiResponse {
    public statusCode: number;
    public success: boolean;
    public message: string;
    public data: any;

    constructor(statusCode: number, data: any, message: string) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }

    send(res: Response) {
        return res.status(this.statusCode).json({
            success: this.success,
            message: this.message,
            data: this.data,
        });
    }

    static ok(res: Response, data: any) {
        return new ApiResponse(HttpStatus.OK, data, SuccessMessage.OK).send(res);
    }

    static generated(res: Response, data: any) {
        return new ApiResponse(HttpStatus.OK, data, SuccessMessage.GENERATED).send(res);
    }

    static created(res: Response, data: any, entity: string = "Resource") {
        return new ApiResponse(HttpStatus.CREATED, data, SuccessMessage.RESOURCE_CREATED(entity)).send(res);
    }

    static retrieved(res: Response, data: any, entity: string = "Resource") {
        return new ApiResponse(HttpStatus.OK, data, SuccessMessage.RESOURCE_RETRIEVED(entity)).send(res);
    }

    static noContent(res: Response) {
        return res.status(HttpStatus.NO_CONTENT).send();
    }

    static register(res: Response, data: any) {
        return new ApiResponse(HttpStatus.CREATED, data, SuccessMessage.USER_REGISTERED).send(res);
    }

    static login(res: Response, data: any) {
        return new ApiResponse(HttpStatus.OK, data, SuccessMessage.LOGIN_SUCCESS).send(res);
    }

    static passwordChanged(res: Response) {
        return new ApiResponse(HttpStatus.OK, null, SuccessMessage.PASSWORD_CHANGED).send(res);
    }

    static profileUpdate(res: Response, data: any) {
        return new ApiResponse(HttpStatus.OK, data, SuccessMessage.USER_PROFILE_UPDATED).send(res);
    }

    static deleted(res: Response, entity: string) {
        return new ApiResponse(HttpStatus.NO_CONTENT, null, SuccessMessage.RESOURCE_DELETED(entity)).send(res);
    }

    static updated(res: Response, data: any, entity: string = "Resource") {
        return new ApiResponse(HttpStatus.OK, data, SuccessMessage.RESOURCE_UPDATED(entity)).send(res);
    }

}
