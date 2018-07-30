import { ObjectID } from 'bson';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Gender, Role } from '../../../src/models/user.model';
import { User } from '../../../src/models/user.schema';

class ValidationPassed extends Error {
    public name = 'ValidationPassed';
}

describe('Models -> User', () => {
    it('should create user object with default values', () => {
        const user = new User();
        expect(user.isNew).to.be.eq(true);
        expect(user._id).to.be.instanceOf(ObjectID);

        expect(user.firstName).to.be.eq(undefined);
        expect(user.lastName).to.be.eq(undefined);

        expect(user.username).to.be.eq(undefined);
        expect(user.email).to.be.eq(undefined);

        expect(user.createdAt).to.be.a('date');
        expect(user.updatedAt).to.be.a('date');

        expect(user.birthday).to.be.eq(null);
        expect(user.deleted).to.be.eq(false);
        expect(user.deletedAt).to.be.eq(null);

        expect(user.gender).to.be.eq('UNKNOWN');

        expect(user.lastLogin).to.be.eq(null);

        expect(user.active).to.eq(true);

        expect(user.password).to.eq(undefined);

        expect(user.role).to.eq(undefined);
    });
    it('should validate raise required errors', async () => {
        try {
            await new User().validate();
            throw new ValidationPassed();
        } catch (err) {
            expect(err.name).to.eq('ValidationError');
            expect(err.errors).to.be.an('object');
            expect(err.errors).to.have.keys(['username', 'password', 'email', 'role']);
            expect(err.errors.username.kind).to.eq('required');
            expect(err.errors.password.kind).to.eq('required');
            expect(err.errors.email.kind).to.eq('required');
            expect(err.errors.role.kind).to.eq('required');
        }
    });

    it('should create user', async () => {
        const passwordHash = '$2b$10$lGsV.ebrEirwro.83ZHKqeHuEvfZmrJU9.AF6JUGxiKmuyPop/djC';
        const user = new User({
            firstName: 'FirstName',
            lastName: 'LastName',
            email: 'email@mail.com',
            username: 'username',
            password: passwordHash,
            role: 'ADMIN'
        });
        await user.validate(); // Validation should pass
        expect(user.firstName).to.eq('FirstName');
        expect(user.lastName).to.eq('LastName');
        expect(user.email).to.eq('email@mail.com');
        expect(user.username).to.eq('username');
        expect(user.password).to.eq(passwordHash);
        expect(user.role).to.eq('ADMIN');
    });

    describe('firstName', () => {
        it('should be valid', async () => {
            await new User({
                firstName: 'First Name',
                lastName: 'Lastname',
                email: 'mail@mail.com',
                username: 'username',
                password: '$2b$10$lGsV.ebrEirwro.83ZHKqeHuEvfZmrJU9.AF6JUGxiKmuyPop/djC',
                role: Role.ADMIN
            }).validate();
        });

        it('should raise ValidationError', async () => {
            try {
                await new User({
                    firstName: '1.name',
                    lastName: 'Lastname',
                    email: 'mail@mail.com',
                    username: 'username',
                    password: '$2b$10$lGsV.ebrEirwro.83ZHKqeHuEvfZmrJU9.AF6JUGxiKmuyPop/djC',
                    role: Role.ADMIN
                }).validate();
                throw new ValidationPassed();
            } catch (err) {
                expect(err.name).to.eq('ValidationError');
                expect(err.errors).to.be.an('object');
                expect(err.errors).to.have.key('firstName');
                expect(err.errors.firstName.kind).to.eq('regexp');
            }
        });
    });

    describe('lastName', () => {
        it('should be valid', async () => {
            await new User({
                firstName: 'First Name',
                lastName: 'Last Name',
                email: 'mail@mail.com',
                username: 'username',
                password: '$2b$10$lGsV.ebrEirwro.83ZHKqeHuEvfZmrJU9.AF6JUGxiKmuyPop/djC',
                role: Role.ADMIN
            }).validate();
        });

        it('should raise ValidationError', async () => {
            try {
                await new User({
                    firstName: 'FirstName',
                    lastName: '2.name',
                    email: 'mail@mail.com',
                    username: 'username',
                    password: '$2b$10$lGsV.ebrEirwro.83ZHKqeHuEvfZmrJU9.AF6JUGxiKmuyPop/djC',
                    role: Role.ADMIN
                }).validate();
                throw new ValidationPassed();
            } catch (err) {
                expect(err.name).to.eq('ValidationError');
                expect(err.errors).to.be.an('object');
                expect(err.errors).to.have.key('lastName');
                expect(err.errors.lastName.kind).to.eq('regexp');
            }
        });
    });

    describe('password', () => {
        it('should be valid', async () => {
            await new User({
                firstName: 'First Name',
                lastName: 'Last Name',
                email: 'mail@mail.com',
                username: 'username',
                password: '$2b$10$lGsV.ebrEirwro.83ZHKqeHuEvfZmrJU9.AF6JUGxiKmuyPop/djC',
                role: Role.ADMIN
            }).validate();
        });

        it('should raise ValidationError', async () => {
            try {
                await new User({
                    firstName: 'FirstName',
                    lastName: 'LastName',
                    email: 'mail@mail.com',
                    username: 'username',
                    password: '123445678',
                    role: Role.ADMIN
                }).validate();
                throw new ValidationPassed();
            } catch (err) {
                expect(err.name).to.eq('ValidationError');
                expect(err.errors).to.be.an('object');
                expect(err.errors).to.have.key('password');
                expect(err.errors.password.kind).to.eq('minlength');
            }

            try {
                await new User({
                    firstName: 'FirstName',
                    lastName: 'LastName',
                    email: 'mail@mail.com',
                    username: 'username',
                    password: '123445678'.repeat(10),
                    role: Role.ADMIN
                }).validate();
                throw new ValidationPassed();
            } catch (err) {
                expect(err.name).to.eq('ValidationError');
                expect(err.errors).to.be.an('object');
                expect(err.errors).to.have.key('password');
                expect(err.errors.password.kind).to.eq('maxlength');
            }
        });
    });

    describe('role', () => {
        it('should be valid', async () => {
            await new User({
                firstName: 'First Name',
                lastName: 'Last Name',
                email: 'mail@mail.com',
                username: 'username',
                password: '$2b$10$lGsV.ebrEirwro.83ZHKqeHuEvfZmrJU9.AF6JUGxiKmuyPop/djC',
                role: Role.ADMIN
            }).validate();
        });

        it('should raise ValidationError for role', async () => {
            try {
                await new User({
                    firstName: 'FirstName',
                    lastName: 'LastName',
                    email: 'email@mail.com',
                    username: 'username',
                    password: '$2b$10$lGsV.ebrEirwro.83ZHKqeHuEvfZmrJU9.AF6JUGxiKmuyPop/djC',
                    role: 'INVALIDROLE'
                }).validate();
                throw new ValidationPassed();
            } catch (err) {
                expect(err.name).to.eq('ValidationError');
                expect(err.errors).to.be.an('object');
                expect(err.errors).to.have.key('role');
                expect(err.errors.role.kind).to.eq('enum');
            }
        });
    });

    describe('birthday', () => {
        it('should be valid', async () => {
            await new User({
                firstName: 'First Name',
                lastName: 'Last Name',
                email: 'mail@mail.com',
                username: 'username',
                password: '$2b$10$lGsV.ebrEirwro.83ZHKqeHuEvfZmrJU9.AF6JUGxiKmuyPop/djC',
                role: Role.ADMIN,
                birthday: new Date()
            }).validate();
        });

        it('should raise ValidationError', async () => {
            try {
                await new User({
                    firstName: 'FirstName',
                    lastName: 'LastName',
                    email: 'email@mail.com',
                    username: 'username',
                    password: '$2b$10$lGsV.ebrEirwro.83ZHKqeHuEvfZmrJU9.AF6JUGxiKmuyPop/djC',
                    role: Role.ADMIN,
                    birthday: 'asd'
                }).validate();
                throw new ValidationPassed();
            } catch (err) {
                expect(err.name).to.eq('ValidationError');
                expect(err.errors).to.be.an('object');
                expect(err.errors).to.have.key('birthday');
                expect(err.errors.birthday.kind).to.eq('Date');
            }
        });
    });

    describe('gender', () => {
        it('should be valid', async () => {
            await new User({
                firstName: 'First Name',
                lastName: 'Last Name',
                email: 'mail@mail.com',
                username: 'username',
                password: '$2b$10$lGsV.ebrEirwro.83ZHKqeHuEvfZmrJU9.AF6JUGxiKmuyPop/djC',
                role: Role.ADMIN,
                gender: Gender.FEMALE
            }).validate();

            await new User({
                firstName: 'First Name',
                lastName: 'Last Name',
                email: 'mail@mail.com',
                username: 'username',
                password: '$2b$10$lGsV.ebrEirwro.83ZHKqeHuEvfZmrJU9.AF6JUGxiKmuyPop/djC',
                role: Role.ADMIN,
                gender: Gender.MALE
            }).validate();

            await new User({
                firstName: 'First Name',
                lastName: 'Last Name',
                email: 'mail@mail.com',
                username: 'username',
                password: '$2b$10$lGsV.ebrEirwro.83ZHKqeHuEvfZmrJU9.AF6JUGxiKmuyPop/djC',
                role: Role.ADMIN,
                gender: Gender.UNKNOWN
            }).validate();
        });

        it('should raise ValidationError', async () => {
            try {
                await new User({
                    firstName: 'FirstName',
                    lastName: 'LastName',
                    email: 'email@mail.com',
                    username: 'username',
                    password: '$2b$10$lGsV.ebrEirwro.83ZHKqeHuEvfZmrJU9.AF6JUGxiKmuyPop/djC',
                    role: Role.ADMIN,
                    gender: 'asd'
                }).validate();
                throw new ValidationPassed();
            } catch (err) {
                expect(err.name).to.eq('ValidationError');
                expect(err.errors).to.be.an('object');
                expect(err.errors).to.have.key('gender');
                expect(err.errors.gender.kind).to.eq('enum');
            }
        });
    });

    describe('active', () => {
        it('should be valid', async () => {
            await new User({
                firstName: 'First Name',
                lastName: 'Last Name',
                email: 'mail@mail.com',
                username: 'username',
                password: '$2b$10$lGsV.ebrEirwro.83ZHKqeHuEvfZmrJU9.AF6JUGxiKmuyPop/djC',
                role: Role.ADMIN,
                active: false
            }).validate();

            await new User({
                firstName: 'First Name',
                lastName: 'Last Name',
                email: 'mail@mail.com',
                username: 'username',
                password: '$2b$10$lGsV.ebrEirwro.83ZHKqeHuEvfZmrJU9.AF6JUGxiKmuyPop/djC',
                role: Role.ADMIN,
                active: true
            }).validate();
        });

        it('should raise ValidationError', async () => {
            try {
                await new User({
                    firstName: 'FirstName',
                    lastName: 'LastName',
                    email: 'email@mail.com',
                    username: 'username',
                    password: '$2b$10$lGsV.ebrEirwro.83ZHKqeHuEvfZmrJU9.AF6JUGxiKmuyPop/djC',
                    role: Role.ADMIN,
                    active: 'asd'
                }).validate();
                throw new ValidationPassed();
            } catch (err) {
                expect(err.name).to.eq('ValidationError');
                expect(err.errors).to.be.an('object');
                expect(err.errors).to.have.key('active');
                expect(err.errors.active.kind).to.eq('Boolean');
            }
        });
    });

    describe('deletedAt', () => {
        it('should be valid', async () => {
            await new User({
                firstName: 'First Name',
                lastName: 'Last Name',
                email: 'mail@mail.com',
                username: 'username',
                password: '$2b$10$lGsV.ebrEirwro.83ZHKqeHuEvfZmrJU9.AF6JUGxiKmuyPop/djC',
                role: Role.ADMIN,
                deletedAt: new Date()
            }).validate();
        });

        it('should raise ValidationError', async () => {
            try {
                await new User({
                    firstName: 'FirstName',
                    lastName: 'LastName',
                    email: 'email@mail.com',
                    username: 'username',
                    password: '$2b$10$lGsV.ebrEirwro.83ZHKqeHuEvfZmrJU9.AF6JUGxiKmuyPop/djC',
                    role: Role.ADMIN,
                    deletedAt: 'asd'
                }).validate();
                throw new ValidationPassed();
            } catch (err) {
                expect(err.name).to.eq('ValidationError');
                expect(err.errors).to.be.an('object');
                expect(err.errors).to.have.key('deletedAt');
                expect(err.errors.deletedAt.kind).to.eq('Date');
            }
        });
    });

    describe('deleted', () => {
        it('should be valid', async () => {
            await new User({
                firstName: 'First Name',
                lastName: 'Last Name',
                email: 'mail@mail.com',
                username: 'username',
                password: '$2b$10$lGsV.ebrEirwro.83ZHKqeHuEvfZmrJU9.AF6JUGxiKmuyPop/djC',
                role: Role.ADMIN,
                deleted: false
            }).validate();

            await new User({
                firstName: 'First Name',
                lastName: 'Last Name',
                email: 'mail@mail.com',
                username: 'username',
                password: '$2b$10$lGsV.ebrEirwro.83ZHKqeHuEvfZmrJU9.AF6JUGxiKmuyPop/djC',
                role: Role.ADMIN,
                deleted: true
            }).validate();
        });

        it('should raise ValidationError', async () => {
            try {
                await new User({
                    firstName: 'FirstName',
                    lastName: 'LastName',
                    email: 'email@mail.com',
                    username: 'username',
                    password: '$2b$10$lGsV.ebrEirwro.83ZHKqeHuEvfZmrJU9.AF6JUGxiKmuyPop/djC',
                    role: Role.ADMIN,
                    deleted: 'asd'
                }).validate();
                throw new ValidationPassed();
            } catch (err) {
                expect(err.name).to.eq('ValidationError');
                expect(err.errors).to.be.an('object');
                expect(err.errors).to.have.key('deleted');
                expect(err.errors.deleted.kind).to.eq('Boolean');
            }
        });
    });

    describe('lastLogin', () => {
        it('should be valid', async () => {
            await new User({
                firstName: 'FirstName',
                lastName: 'LastName',
                email: 'email@mail.com',
                username: 'username',
                password: '$2b$10$lGsV.ebrEirwro.83ZHKqeHuEvfZmrJU9.AF6JUGxiKmuyPop/djC',
                role: Role.ADMIN,
                lastLogin: null
            }).validate();

            await new User({
                firstName: 'FirstName',
                lastName: 'LastName',
                email: 'email@mail.com',
                username: 'username',
                password: '$2b$10$lGsV.ebrEirwro.83ZHKqeHuEvfZmrJU9.AF6JUGxiKmuyPop/djC',
                role: Role.ADMIN,
                lastLogin: new Date()
            }).validate();
        });

        it('should raise ValidationError', async () => {
            try {
                await new User({
                    firstName: 'FirstName',
                    lastName: 'LastName',
                    email: 'email@mail.com',
                    username: 'username',
                    password: '$2b$10$lGsV.ebrEirwro.83ZHKqeHuEvfZmrJU9.AF6JUGxiKmuyPop/djC',
                    role: Role.ADMIN,
                    lastLogin: 'asd'
                }).validate();
                throw new ValidationPassed();
            } catch (err) {
                expect(err.name).to.eq('ValidationError');
                expect(err.errors).to.be.an('object');
                expect(err.errors).to.have.key('lastLogin');
                expect(err.errors.lastLogin.kind).to.eq('Date');
            }
        });
    });

    describe('groups', () => {
        it('should be valid', async () => {
            await new User({
                firstName: 'FirstName',
                lastName: 'LastName',
                email: 'email@mail.com',
                username: 'username',
                password: '$2b$10$lGsV.ebrEirwro.83ZHKqeHuEvfZmrJU9.AF6JUGxiKmuyPop/djC',
                role: Role.ADMIN,
                groups: []
            }).validate();

            await new User({
                firstName: 'FirstName',
                lastName: 'LastName',
                email: 'email@mail.com',
                username: 'username',
                password: '$2b$10$lGsV.ebrEirwro.83ZHKqeHuEvfZmrJU9.AF6JUGxiKmuyPop/djC',
                role: Role.ADMIN,
                groups: ['group-1', 'group-2']
            }).validate();
        });

        it('should raise ValidationError', async () => {
            try {
                await new User({
                    firstName: 'FirstName',
                    lastName: 'LastName',
                    email: 'email@mail.com',
                    username: 'username',
                    password: '$2b$10$lGsV.ebrEirwro.83ZHKqeHuEvfZmrJU9.AF6JUGxiKmuyPop/djC',
                    role: Role.ADMIN,
                    groups: null
                }).validate();
                throw new ValidationPassed();
            } catch (err) {
                expect(err.name).to.eq('ValidationError');
                expect(err.errors).to.be.an('object');
                expect(err.errors).to.have.key('groups');
                expect(err.errors.groups.kind).to.eq('NotArray');
            }
        });
    });
});
