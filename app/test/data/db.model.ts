import { Gender, Role } from './user.model';

export interface IDBUserModel {
    _id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    gender: Gender | null;
    birthday: string | null;
    active: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    deleted: boolean;
    lastLogin: string | null;
    groups: string[];
    password: string;
}
