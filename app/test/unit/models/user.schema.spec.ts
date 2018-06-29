import { ObjectID } from 'bson';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { User } from '../../../src/models/user.schema';

class ValidationPassed extends Error {
    public name = 'ValidationPassed';
}

describe('Models -> User', () => {
    it('should create user object with default values and validate raise required errors', async () => {
        const now = Date.now();
        const before = new Date(now - (2 * 60000)); // Two minutes after
        const after = new Date(now + (2 * 60000)); // Two minutes before
        const user = new User();
        expect(user.isNew).to.be.eq(true);
        expect(user._id).to.be.instanceOf(ObjectID);

        expect(user.firstName).to.eq(undefined);
        expect(user.lastName).to.eq(undefined);

        expect(user.username).to.be.eq(undefined);
        expect(user.email).to.eq(undefined);

        expect(user.createdAt).to.gt(before);
        expect(user.createdAt).to.lt(after);

        expect(user.updatedAt).to.gt(before);
        expect(user.updatedAt).to.lt(after);

        expect(user.birthday).to.eq(null);

        expect(user.deleted).to.eq(false);
        expect(user.deletedAt).to.eq(null);

        expect(user.gender).to.eq(null);

        expect(user.lastLogin).to.eq(null);

        expect(user.active).to.eq(true);

        expect(user.password).to.eq(undefined);

        expect(user.role).to.eq(undefined);

        try {
            await user.validate();
        } catch (err) {
            expect(err.name).to.eq('ValidationError');
            expect(err.errors.username.kind).to.eq('required');
            expect(err.errors.password.kind).to.eq('required');
            expect(err.errors.firstName.kind).to.eq('required');
            expect(err.errors.lastName.kind).to.eq('required');
            expect(err.errors.email.kind).to.eq('required');
            expect(err.errors.role.kind).to.eq('required');
        }
    });

    it('should create user without error', async () => {
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

    it('should raise ValidationError for role', async () => {
        const user = new User({
            firstName: 'FirstName',
            lastName: 'LastName',
            email: 'email@mail.com',
            username: 'username',
            password: '$2b$10$lGsV.ebrEirwro.83ZHKqeHuEvfZmrJU9.AF6JUGxiKmuyPop/djC',
            role: 'INVALIDROLE'
        });
        try {
            await user.validate().then(() => {
                throw new Error('ValidationPassed');
            });
        } catch (err) {
            expect(err.name).to.eq('ValidationError');
            expect(err.errors.role.kind).to.eq('enum');
        }
    });

    it('should raise ValidationError', async () => {
        const user = new User({
            firstName: '123123',
            lastName: '3123 123',
            email: 'not a mail address',
            username: 'username',
            password: '$2b$10$lGsV.ebrEirwro.83ZHKqeHuEvfZmrJU9.AF6JUGxiKmuyPop/djC',
            role: 'ADMIN'
        });
        try {
            await user.validate().then(() => {
                throw new ValidationPassed();
            });
        } catch (err) {
            expect(err.name).to.eq('ValidationError');
            expect(err.errors.email.kind).to.eq('InvalidEmail');
            expect(err.errors.firstName.kind).to.eq('Alpha');
            expect(err.errors.lastName.kind).to.match(new RegExp('Alpha|EmptySpace', 'g'));
        }
    });

    it('should raise ValidationError for deleted', async () => {
        const user = new User({
            firstName: 'Firstname',
            lastName: 'Lastname',
            email: 'mail@email.com',
            username: 'username',
            password: '$2b$10$lGsV.ebrEirwro.83ZHKqeHuEvfZmrJU9.AF6JUGxiKmuyPop/djC',
            role: 'ADMIN',
            deleted: true
        });
        try {
            await user.validate().then(() => {
                throw new ValidationPassed();
            });
        } catch (err) {
            expect(err.name).to.eq('ValidationError');
            expect(err.errors.deleted.kind).to.eq('ValueDependency');
        }
    });

    it('should raise ValidationError for deletedAt', async () => {
        const user = new User({
            firstName: 'Firstname',
            lastName: 'Lastname',
            email: 'mail@email.com',
            username: 'username',
            password: '$2b$10$lGsV.ebrEirwro.83ZHKqeHuEvfZmrJU9.AF6JUGxiKmuyPop/djC',
            role: 'ADMIN',
            deletedAt: new Date()
        });
        try {
            await user.validate().then(() => {
                throw new ValidationPassed();
            });
        } catch (err) {
            expect(err.name).to.eq('ValidationError');
            expect(err.errors.deletedAt.kind).to.eq('ValueDependency');
        }
    });
});
