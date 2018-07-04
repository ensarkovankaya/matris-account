import { expect } from 'chai';
import { describe, it } from 'mocha';
import 'reflect-metadata';
import { UserResolver } from '../../../../src/graphql/resolvers/user.resolver';
import { Gender, Role } from '../../../../src/models/user.model';
import { UserService } from '../../../../src/services/user.service';
import { MockDatabase } from '../../mock.database';

class ShouldNotSucceed extends Error {
    public name = 'ShouldNotSucceed';
}

describe('Resolvers -> User', () => {
    it('should create user with minimum arguments', async () => {
        const resolver = new UserResolver(new UserService(new MockDatabase()));
        const user = await resolver.create({
            firstName: 'FirstName',
            lastName: 'LastName',
            email: 'email@mail.com',
            role: Role.ADMIN,
            password: '12345678',
        });
        expect(user).to.be.a('object');
        expect(user._id).to.be.an('object');
        expect(user.firstName).to.be.eq('FirstName');
        expect(user.lastName).to.be.eq('LastName');
        expect(user.email).to.be.eq('email@mail.com');
        expect(user.role).to.be.eq('ADMIN');
        expect(user.username).to.be.a('string');
        expect(user.username).to.be.eq('firstnamelastname');
        expect(user.password).to.be.a('string');
        expect(user.password).to.not.eq('12345678');
        expect(user.password).to.have.lengthOf.at.within(50, 80);
        expect(user.birthday).to.be.eq(null);
        expect(user.updatedAt).to.be.a('date');
        expect(user.createdAt).to.be.a('date');
        expect(user.createdAt.getTime()).to.be.lessThan(Date.now());
        expect(user.deleted).to.be.eq(false);
        expect(user.deletedAt).to.be.eq(null);
        expect(user.active).to.be.eq(true);
        expect(user.gender).to.be.eq(null);
        expect(user.groups).to.be.an('array');
        expect(user.groups.length).to.be.eq(0);
    });

    it('should create user with all arguments', async () => {
        const resolver = new UserResolver(new UserService(new MockDatabase()));
        const user = await resolver.create({
            firstName: 'FirstName',
            lastName: 'LastName',
            email: 'email@mail.com',
            role: Role.ADMIN,
            password: '12345678',
            active: false,
            groups: ['group-id-1', 'group-id-2', 'group-id-3'],
            birthday: new Date(1987, 4, 19),
            gender: Gender.MALE,
            username: 'customusername'
        });
        expect(user).to.be.a('object');
        expect(user._id).to.be.an('object');
        expect(user.firstName).to.be.eq('FirstName');
        expect(user.lastName).to.be.eq('LastName');
        expect(user.email).to.be.eq('email@mail.com');
        expect(user.username).to.be.eq('customusername');
        expect(user.role).to.be.eq('ADMIN');
        expect(user.gender).to.be.eq('MALE');
        expect(user.birthday).to.be.a('date');
        expect(user.password).to.be.a('string');
        expect(user.password).to.have.lengthOf.at.within(50, 80);
        expect(user.updatedAt).to.be.a('date');
        expect(user.createdAt).to.be.a('date');
        expect(user.deleted).to.be.eq(false);
        expect(user.deletedAt).to.be.eq(null);
        expect(user.active).to.be.eq(false);
        expect(user.groups.length).to.be.eq(3);
    });

    it('should update user', async () => {
        const resolver = new UserResolver(new UserService(new MockDatabase()));
        const user = await resolver.create({
            birthday: new Date(1989, 1, 26),
            gender: Gender.MALE,
            active: false,
            groups: ['group-1', 'group-2'],
            email: "nciccottio2r@pen.io",
            firstName: "Nelson",
            lastName: "Ciccottio",
            role: Role.STUDENT,
            password: "12345678",
            username: "nelsonciccottio"
        });
        const updated = await resolver.update(user._id, {
            firstName: 'John',
            lastName: 'Nick',
            birthday: new Date(1987, 2, 4),
            groups: ['group-3'],
            active: true,
            gender: Gender.FEMALE,
            email: 'email@example.com',
            role: Role.INSTRUCTOR,
            password: 'newpassword',
            username: 'user23',
            updateLastLogin: true
        });
        expect(updated).to.be.a('object');
        expect(updated.firstName).to.be.eq('John');
        expect(updated.lastName).to.be.eq('Nick');
        expect(updated.email).to.be.eq('email@example.com');
        expect(updated.username).to.be.eq('user23');
        expect(updated.role).to.be.eq('INSTRUCTOR');
        expect(updated.gender).to.be.eq('FEMALE');
        expect(updated.birthday).to.be.a('date');
        expect(updated.lastLogin).to.be.a('date');
        expect(updated.birthday.getTime()).to.be.eq(new Date(1987, 2, 4).getTime());
        expect(updated.password).to.be.not.eq(user.password);
        expect(updated.password).to.be.not.eq('newpassword');
        expect(updated.password).to.have.lengthOf.at.within(50, 80);
        expect(updated.updatedAt).to.be.a('date');
        expect(updated.updatedAt).to.be.not.eq(user.updatedAt);
        expect(updated.active).to.be.eq(true);
        expect(updated.groups.length).to.be.eq(1);
    });

    it('should soft delete user', async () => {
        const db = new MockDatabase();
        const resolver = new UserResolver(new UserService(db));
        const user = await resolver.create({
            birthday: new Date(1989, 1, 26),
            gender: Gender.MALE,
            active: false,
            groups: ['group-1', 'group-2'],
            email: "nciccottio2r@pen.io",
            firstName: "Nelson",
            lastName: "Ciccottio",
            role: Role.STUDENT,
            password: "12345678",
            username: "nelsonciccottio"
        });
        await resolver.delete(user._id);
        expect(db.data.length).to.eq(1);
    });

    it('should validate password', async () => {
        const resolver = new UserResolver(new UserService(new MockDatabase()));
        await resolver.create({
            firstName: 'FirstName',
            lastName: 'LastName',
            email: 'email@mail.com',
            role: Role.ADMIN,
            password: '12345678'
        });

        const shouldValid = await resolver.password({email: 'email@mail.com', password: '12345678'});
        expect(shouldValid).to.eq(true);

        const shouldNotValid = await resolver.password({email: 'email@mail.com', password: '123456789'});
        expect(shouldNotValid).to.eq(false);

        try {
            await resolver.password({email: '123@mail.com', password: '123456789'});
            throw new ShouldNotSucceed();
        } catch (e) {
            expect(e.name).to.eq('UserNotFound');
        }
    });

    it('should get user by id, email or username', async () => {
        const resolver = new UserResolver(new UserService(new MockDatabase()));
        const user1 = await resolver.create({
            birthday: new Date(1999, 1, 26),
            gender: Gender.MALE,
            active: false,
            email: "1@mail.com",
            firstName: "Nelson",
            lastName: "Ciccottio",
            role: Role.STUDENT,
            password: "12345678",
            username: "user1"
        });
        const user2 = await resolver.create({
            birthday: new Date(1999, 1, 26),
            gender: Gender.MALE,
            active: false,
            email: "2@mail.com",
            firstName: "Nelson",
            lastName: "Ciccottio",
            role: Role.STUDENT,
            password: "12345678",
            username: "user2"
        });
        const user3 = await resolver.create({
            birthday: new Date(1999, 1, 26),
            gender: Gender.MALE,
            active: false,
            email: "3@mail.com",
            firstName: "Nelson",
            lastName: "Ciccottio",
            role: Role.STUDENT,
            password: "12345678",
            username: "user3"
        });
        const userByID = await resolver.get({id: user1._id});
        expect(userByID).to.be.a('object');
        expect(userByID._id).to.eq(user1._id);

        const userByEmail = await resolver.get({email: user2.email});
        expect(userByEmail).to.be.a('object');
        expect(userByEmail._id).to.eq(user2._id);

        const userByUsername = await resolver.get({username: user3.username});
        expect(userByUsername).to.be.a('object');
        expect(userByUsername._id).to.eq(user3._id);

        const shouldNull = await resolver.get({id: 'a'});
        expect(shouldNull).to.be.eq(null);

        try {
            await resolver.get({});
            throw new ShouldNotSucceed();
        } catch (e) {
            expect(e.name).to.be.eq('ParameterRequired');
        }
    });
});
