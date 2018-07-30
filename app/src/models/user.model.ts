import { Document } from 'mongoose';
import { Gender } from './gender.model';
import { Role } from './role.model';

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
