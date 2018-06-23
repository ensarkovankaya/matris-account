import { Response } from "express";
import { IAPIResponse, IValidationError } from "./models/response.model";

export class BaseResponse implements IAPIResponse<any> {
    public data: any = null;
    public status: number;
    public errors: IValidationError[] | null = null;
    public hasErrorMessages: boolean = false;
    private response: Response;

    constructor(res: Response) {
        this.response = res;
    }

    public send(): Response {
        return this.response.status(this.status).json(this.toJSON());
    }

    public toJSON(): IAPIResponse<any> {
        return {
            data: this.data,
            errors: this.errors,
            hasErrorMessages: this.hasErrorMessages
        };
    }
}

export class SuccessResponse extends BaseResponse {

    constructor(res: Response, data: any = null) {
        super(res);
        this.status = 200;
        this.data = data;
    }
}

export class ErrorResponse extends BaseResponse {

    constructor(res: Response, errors: IValidationError[]) {
        super(res);
        this.status = 400;
        this.errors = errors;
        this.hasErrorMessages = errors.length > 0;
    }
}

export class ServerErrorResponse extends BaseResponse {

    constructor(res: Response) {
        super(res);
        this.status = 500;
    }
}
