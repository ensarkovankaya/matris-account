import { Location } from "express-validator/check/location";

export interface IValidationError {
    location: Location;
    param: string;
    msg: string;
}

export interface IAPIResponse<T> {
    data: T | null;
    errors: IValidationError[] | null;
    hasErrorMessages: boolean;
}
