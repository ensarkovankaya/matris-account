import { Document } from 'mongoose';
import { ICompareDateModel, INullableCompareDateModel } from './compare.model';
import { IGenderQueryModel } from './gender.query.model';
import { IRoleQueryModel } from './role.query.model';

export enum Role {
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    INSTRUCTOR = 'INSTRUCTOR',
    PARENT = 'PARENT',
    STUDENT = 'STUDENT'
}

export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    UNKNOWN = 'UNKNOWN'
}

export interface IUserFilterModel {
    active?: boolean;
    role?: IRoleQueryModel;
    gender?: IGenderQueryModel;
    birthday?: ICompareDateModel;
    deleted?: boolean;
    deletedAt?: ICompareDateModel;
    createdAt?: ICompareDateModel;
    updatedAt?: ICompareDateModel;
    lastLogin?: INullableCompareDateModel;
    groups?: string[];
    _id?: string;
}

export interface ICreateUserModel {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: Role;
    username?: string;
    gender?: Gender;
    birthday?: Date | null;
    active?: boolean;
    groups?: string[];
}

export interface IUpdateUserModel {
    email?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    role?: Role;
    username?: string;
    gender?: Gender;
    birthday?: Date | null;
    active?: boolean;
    groups?: string[];
    updateLastLogin?: boolean;
}

export interface IUserModel extends Document {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: Role;
    gender: Gender;
    birthday: Date | null;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    deleted: boolean;
    lastLogin: Date | null;
    groups: string[];
}
