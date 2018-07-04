import { expect } from 'chai';
import { describe, it } from 'mocha';
import 'reflect-metadata';
import { Gender, IUpdateUserModel, Role } from '../../../src/models/user.model';
import { UserService } from '../../../src/services/user.service';
import { MockDatabase } from '../mock.database';

describe('Services -> User', () => {
    describe('Create', () => {
        it('should create user with basic information', async () => {
            const service = new UserService(new MockDatabase());
            const user = await service.create({
                email: 'email@mail.com',
                firstName: 'FirstName',
                lastName: 'LastName',
                password: '12345678',
                role: Role.STUDENT
            });
            // Generated Fields
            expect(user._id).to.be.an('object');
            expect(user.username).to.be.a('string');

            expect(user.password).to.not.eq('12345678');
            expect(user.password).to.lengthOf.gt(50);

            expect(user.firstName).to.eq('FirstName');
            expect(user.lastName).to.eq('LastName');
            expect(user.email).to.eq('email@mail.com');
            expect(user.role).to.eq('STUDENT');
        });

        it('should create user with all information', async () => {
            const service = new UserService(new MockDatabase());
            const user = await service.create({
                email: 'email@mail.com',
                firstName: 'FirstName',
                lastName: 'LastName',
                password: '12345678',
                role: Role.STUDENT,
                birthday: new Date(1993, 4, 21),
                gender: Gender.MALE
            });

            expect(user._id).to.be.an('object');

            expect(user.password).to.not.eq('12345678');
            expect(user.password).to.lengthOf.gt(50);

            expect(user.firstName).to.eq('FirstName');
            expect(user.lastName).to.eq('LastName');
            expect(user.email).to.eq('email@mail.com');
            expect(user.role).to.eq('STUDENT');
            expect(user.username).to.be.a('string');
            expect(user.username).to.be.a('string');

            expect(user.birthday).to.be.a('date');
            expect(user.gender).to.eq('MALE');
        });
    });

    it('should update user', async () => {
        const service = new UserService(new MockDatabase());
        const user = await service.create({
            email: "nciccottio2r@pen.io",
            firstName: "Nelson",
            lastName: "Ciccottio",
            role: Role.STUDENT,
            username: "nelsonciccottio",
            password: '12345678',
            birthday: new Date(1999, 1, 26),
            active: false,
            gender: Gender.MALE,
        });
        const updated = await service.update(user._id, {
            gender: Gender.FEMALE,
            email: 'new@email.com',
            lastName: 'Whates',
            role: Role.INSTRUCTOR,
            password: 'newpassword',
            updateLastLogin: true,
            birthday: new Date(1993, 2, 26)
        } as IUpdateUserModel);

        // Check is updated related fields
        expect(updated.gender).to.eq('FEMALE');
        expect(updated.email).to.eq('new@email.com');
        expect(updated.lastName).to.eq('Whates');
        expect(updated.role).to.eq('INSTRUCTOR');
        expect(updated.lastLogin).to.be.a('date');
        expect(updated.birthday.toJSON()).to.eq(new Date(1993, 2, 26).toJSON());

        // Check is hashed the password
        expect(updated.password).to.not.eq(user.password);
        expect(updated.password).to.not.eq('newpassword');

        // Check is not updated unrelated fields
        expect(updated.updatedAt.toJSON()).to.not.eq(user.updatedAt.toJSON());
        expect(updated.createdAt.toJSON()).to.eq(user.createdAt.toJSON());
    });

    it('should soft delete user', async () => {
        const service = new UserService(new MockDatabase());

        const user = await service.create({
            email: "nciccottio2r@pen.io",
            firstName: "Nelson",
            lastName: "Ciccottio",
            role: Role.STUDENT,
            password: "12345678"
        });
        expect(user).to.be.an('object');
        expect(user._id).to.be.an('object');

        await service.delete(user._id);

        const deleted = await service.getBy({id: user._id}, true);
        expect(deleted).to.be.an('object');
        expect(deleted.deleted).to.be.eq(true);
        expect(deleted.deletedAt).to.be.a('date');
    });

    it('should hard delete user', async () => {
        const service = new UserService(new MockDatabase());

        const user = await service.create({
            email: "nciccottio2r@pen.io",
            firstName: "Nelson",
            lastName: "Ciccottio",
            role: Role.STUDENT,
            password: "12345678"
        });
        expect(user).to.be.an('object');
        expect(user._id).to.be.an('object');
        await service.delete(user._id, true);
        const deleted = await service.getBy({id: user._id}, null);
        expect(deleted).to.be.eq(null);
    });

    it('should get user by id, email and username', async () => {
        const service = new UserService(new MockDatabase());
        const user1 = await service.create({
            email: "1@mail.com",
            firstName: "Nelson",
            lastName: "Ciccottio",
            role: Role.STUDENT,
            password: "12345678",
            username: "user1"
        });
        const user2 = await service.create({
            email: "2@mail.com",
            firstName: "Nelson",
            lastName: "Ciccottio",
            role: Role.STUDENT,
            password: "12345678",
            username: "user2"
        });
        const user3 = await service.create({
            email: "3@mail.com",
            firstName: "Nelson",
            lastName: "Ciccottio",
            role: Role.STUDENT,
            password: "12345678",
            username: "user3"
        });
        const byID = await service.getBy({id: user1._id});
        expect(byID._id).to.eq(user1._id);

        const byEmail = await service.getBy({email: user2.email});
        expect(byEmail._id).to.eq(user2._id);

        const byUsername = await service.getBy({username: user3.username});
        expect(byUsername._id).to.eq(user3._id);

        const notExistById = await service.getBy({id: "5"});
        expect(notExistById).to.eq(null);

        const notExistByEmail = await service.getBy({email: "5@mail.com"});
        expect(notExistByEmail).to.eq(null);

        const notExistByUsername = await service.getBy({username: "user5"});
        expect(notExistByUsername).to.eq(null);

        try {
            await service.getBy({});
        } catch (err) {
            expect(err.name).to.eq('ParameterRequired');
        }
    });

    it('should check username exists', async () => {
        const service = new UserService(new MockDatabase());
        await service.create({
            firstName: 'FirstName',
            lastName: 'LastName',
            email: 'mail@email.com',
            role: Role.STUDENT,
            password: '12345678',
            username: 'user1'
        });
        const shouldExists = await service.isUsernameExists('user1');
        expect(shouldExists).to.eq(true);

        const shouldNotExists = await service.isUsernameExists('user2');
        expect(shouldNotExists).to.eq(false);
    });

    it('should check password', async () => {
        const service = new UserService(new MockDatabase());
        const user = await service.create({
            firstName: 'FirstName',
            lastName: 'LastName',
            email: 'email@mail.com',
            password: '12345678',
            role: Role.ADMIN
        });

        const shouldValid = await service.isPasswordValid('12345678', user.password);
        expect(shouldValid).to.eq(true);

        const shouldNotValid = await service.isPasswordValid('12345678asd', user.password);
        expect(shouldNotValid).to.eq(false);
    });
});
