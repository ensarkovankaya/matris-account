import { model, Schema } from "mongoose";
import { isAlphanumeric, isEmail } from 'validator';
import { Gender, IUserModel, Role } from './user.model';

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
        required: true,
        minlength: 1,
        maxlength: 32,
        trim: true,
        match: new RegExp('^([A-Za-z ]+)$')
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 32,
        match: new RegExp('^([A-Za-z ]+)$')
    },
    password: {
        type: String,
        required: true,
        minlength: 50,
        maxlength: 80
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
        default: null,
        validate: {
            validator: (val: any) => val === null || (val instanceof Date && val.toString() !== 'Invalid Date'),
            msg: 'Invalid value',
            type: 'InvalidDate'
        }
    },
    gender: {
        type: String,
        enum: [Gender.MALE, Gender.FEMALE, null],
        default: null
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
    },
    groups: {
        type: [String],
        default: [],
        validate: (value: string[]) => new Set(value).size === value.length  // checks only contains unique values
    }
});

export const User = model<IUserModel>('User', UserSchema);
