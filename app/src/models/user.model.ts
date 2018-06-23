import { Document } from 'mongoose';
import { ICompareModel } from './compare.model';

export enum Role {
    SUPERADMIN = 'SUPERADMIN',
    ADMIN = 'ADMIN',
    INSTRUCTOR = 'INSTRUCTOR',
    PARENT = 'PARENT',
    STUDENT = 'STUDENT'
}

export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE'
}

export interface IUserFilterModel {
    active?: boolean;
    role?: {
        eq?: Role;
        in: Role[];
    };
    gender?: Gender;
    birthday?: ICompareModel;
    deleted?: boolean;
    deletedAt?: ICompareModel;
    createdAt?: ICompareModel;
    updatedAt?: ICompareModel;
    lastLogin?: ICompareModel;
}

export interface ICreateUserModel {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: Role;
    username?: string;
    gender?: Gender;
    birthday?: Date;
    active?: boolean;
}

export interface IUpdateUserModel {
    email?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    role?: Role;
    username?: string;
    gender?: Gender;
    birthday?: Date;
    active?: boolean;
}

export interface IUserModel extends Document {
    _id: string;
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: Role;
    gender: Gender | null;
    birthday: Date | null;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    deleted: boolean;
    lastLogin: Date | null;
}
