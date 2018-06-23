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
        required: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        required: true,
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
    }
});

export const User = model<IUserModel>('User', UserSchema);
