import { model, Schema } from "mongoose";
import { isAlpha, isAlphanumeric, isEmail } from 'validator';
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
        validate: {
            validator: (val: any) => isAlpha(val, 'tr-TR'),
            msg: 'First name should be alphanumeric.',
            type: 'Alpha'
        }
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 32,
        validate: [
            {
                validator: (val: any) => isNotContainEmptySpaces(val),
                msg: 'Should not contains empty spaces.',
                type: 'EmptySpace'
            },
            {
                validator: (val: any) => isAlpha(val, 'tr-TR'),
                msg: 'Last name should only contains alpha numeric values.',
                type: 'Alpha'
            }
        ]
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
                msg: 'Should not contains empty spaces'
            },
            {
                validator: (val: any) => isAlphanumeric(val),
                msg: 'AlphaNumeric'
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
        default: null,
        validate: {
            validator: (val: any) => !(val instanceof Date && this.deleted !== true), // Check if deleted is set true.
            type: 'ValueDependency'
        }
    },
    deleted: {
        type: Boolean,
        default: false,
        validate: {
            validator: (val: any) => !(val && !this.deletedAt), // Check if deletedAt set
            type: 'ValueDependency'
        }
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
