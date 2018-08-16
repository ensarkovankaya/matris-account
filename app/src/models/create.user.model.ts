import { Gender } from "./gender.model";
import { Role } from "./role.model";

export interface ICreateUserModel {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: Role;
    username?: string;
    gender?: Gender;
    birthday?: Date | string | null;
    active?: boolean;
}
