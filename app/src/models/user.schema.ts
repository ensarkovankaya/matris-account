import { model, Schema } from "mongoose";
import { Gender, IUserModel, Role } from './user.model';

const UserSchema: Schema = new Schema({
    email: {
        minlength: 3,
        required: true,
        type: String
    },
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 32
    },
    lastName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 32
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 80
    },
    username: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        minlength: 4,
        maxlength: 20
    },
    role: {
        type: String,
        enum: [Role.SUPERADMIN, Role.ADMIN, Role.INSTRUCTOR, Role.PARENT, Role.STUDENT]
    },
    birthday: {
        type: Date,
        default: null
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
        default: Date.now,
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
        validate: {
            validator: (arr: string[]) => {
                // Validate array is not contains duplicate id
                return new Set(arr).size === arr.length;
            }
        }
    }
});

export const User = model<IUserModel>('User', UserSchema);
