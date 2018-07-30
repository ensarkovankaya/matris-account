import { ICompareDateModel, INullableCompareDateModel } from "./compare.model";
import { IGenderQueryModel } from "./gender.query.model";
import { IRoleQueryModel } from "./role.query.model";

export interface IUserFilterModel {
    active?: boolean;
    role?: IRoleQueryModel;
    gender?: IGenderQueryModel;
    birthday?: INullableCompareDateModel;
    deleted?: boolean;
    deletedAt?: ICompareDateModel;
    createdAt?: ICompareDateModel;
    updatedAt?: ICompareDateModel;
    lastLogin?: INullableCompareDateModel;
    groups?: string[];
    _id?: string;
}
