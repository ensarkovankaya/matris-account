import { model, Schema } from "mongoose";
import * as mongoosePaginate from 'mongoose-paginate';
import { isAlphanumeric, isEmail } from 'validator';
import { Gender } from "./gender.model";
import { Role } from "./role.model";
import { IUserModel } from './user.model';

const isNotContainEmptySpaces = (value: string): boolean => value.replace(/\s/g, '') === value;

const UserSchema: Schema = new Schema({
    email: {
        minlength: 3,
        maxLength: 50,
        required: true,
        type: String,
        trim: true,
        validate: {
            validator: (value: any) => isEmail(value),
            msg: 'Invalid email address',
            type: 'InvalidEmail'
        }
    },
    firstName: {
        type: String,
        required: false,
        minlength: 0,
        maxlength: 32,
        trim: true,
        match: new RegExp('^[A-Za-z ]+$')
    },
    lastName: {
        type: String,
        required: false,
        trim: true,
        minlength: 0,
        maxlength: 32,
        match: new RegExp('^[A-Za-z ]+$')
    },
    password: {
        type: String,
        required: true,
        minlength: 60,
        maxlength: 60
    },
    username: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        minlength: 4,
        maxlength: 20,
        validate: [
            {
                validator: (val: any) => isNotContainEmptySpaces(val),
                msg: 'Should not contains empty spaces',
                type: 'EmptySpaces'
            },
            {
                validator: (val: any) => isAlphanumeric(val),
                msg: 'Username must contain lower or uppercase characters and numbers.',
                type: 'AlphaNumeric'
            }
        ]
    },
    role: {
        type: String,
        enum: [Role.ADMIN, Role.MANAGER, Role.INSTRUCTOR, Role.PARENT, Role.STUDENT],
        required: true
    },
    birthday: {
        type: Date,
        default: null
    },
    gender: {
        type: String,
        enum: [Gender.MALE, Gender.FEMALE, Gender.UNKNOWN],
        default: Gender.UNKNOWN
    },
    active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    deletedAt: {
        type: Date,
        default: null
    },
    deleted: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date,
        default: null
    }
});
UserSchema.plugin(mongoosePaginate);

export const User = model<IUserModel>('User', UserSchema);
