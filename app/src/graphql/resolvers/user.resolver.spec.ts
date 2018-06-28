import { expect } from 'chai';
import { describe, it } from 'mocha';
import 'reflect-metadata';
import { Gender, Role } from '../../models/user.model';
import { FakeDatabase } from '../../services/fake.database.service';
import { UserService } from '../../services/user.service';
import { UserResolver } from './user.resolver';

describe('UserResolver', () => {
    it('should create user with minimum arguments', async () => {
        const db = new FakeDatabase();
        const resolver = new UserResolver(new UserService(db));

        const user = await resolver.create({
            firstName: 'FirstName',
            lastName: 'LastName',
            email: 'email@mail.com',
            role: Role.ADMIN,
            password: '12345678',
        });
        expect(user).to.be.a('object');
        expect(user._id).to.be.a('string');
        expect(user.firstName).to.be.eq('FirstName');
        expect(user.lastName).to.be.eq('LastName');
        expect(user.email).to.be.eq('email@mail.com');
        expect(user.role).to.be.eq('ADMIN');
        expect(user.username).to.be.a('string');
        expect(user.username).to.be.eq('firstnamelastname');
        expect(user.password).to.be.a('string');
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
        const db = new FakeDatabase();
        const resolver = new UserResolver(new UserService(db));
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
        expect(user._id).to.be.a('string');
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
        const db = new FakeDatabase([
            {
                _id: "5b32925ea8b04a071c7f8bb0",
                birthday: new Date(1989, 1, 26),
                gender: "MALE",
                active: false,
                deletedAt: null,
                deleted: false,
                lastLogin: null,
                groups: ['group-1', 'group-2'],
                email: "nciccottio2r@pen.io",
                firstName: "Nelson",
                lastName: "Ciccottio",
                role: "STUDENT",
                password: "$2b$10$H210fn813wmANL5FSLz3re6og0xwJ0fKT4HqSY3hi.QgelGGQPM7.",
                username: "nelsonciccottio",
                createdAt: new Date("2018-06-26T19:22:06.755Z"),
                updatedAt: new Date("2018-06-26T19:22:06.755Z"),
                __v: 0
            }
        ]);
        const resolver = new UserResolver(new UserService(db));
        const user = await resolver.update("5b32925ea8b04a071c7f8bb0", {
            firstName: 'John',
            lastName: 'Nick',
            birthday: new Date(1987, 2, 4),
            groups: ['group-3'],
            active: true,
            gender: Gender.FEMALE,
            email: 'email@example.com',
            role: Role.INSTRUCTOR,
            password: 'newpassword',
            username: 'user23'
        });
        expect(user).to.be.a('object');
        expect(user.firstName).to.be.eq('John');
        expect(user.lastName).to.be.eq('Nick');
        expect(user.email).to.be.eq('email@example.com');
        expect(user.username).to.be.eq('user23');
        expect(user.role).to.be.eq('INSTRUCTOR');
        expect(user.gender).to.be.eq('FEMALE');
        expect(user.birthday).to.be.a('date');
        expect(user.birthday.getTime()).to.be.eq(new Date(1987, 2, 4).getTime());
        expect(user.password).to.be.not.eq('$2b$10$H210fn813wmANL5FSLz3re6og0xwJ0fKT4HqSY3hi.QgelGGQPM7.');
        expect(user.password).to.have.lengthOf.at.within(50, 80);
        expect(user.updatedAt).to.be.a('date');
        expect(user.updatedAt).to.be.not.eq(new Date("2018-06-26T19:22:06.755Z"));
        expect(user.active).to.be.eq(true);
        expect(user.groups.length).to.be.eq(1);
    });

    it('should delete user', async () => {
        const db = new FakeDatabase([
            {
                _id: "5b32925ea8b04a071c7f8bb0",
                birthday: new Date(1989, 1, 26),
                gender: "MALE",
                active: false,
                deletedAt: null,
                deleted: false,
                lastLogin: null,
                groups: ['group-1', 'group-2'],
                email: "nciccottio2r@pen.io",
                firstName: "Nelson",
                lastName: "Ciccottio",
                role: "STUDENT",
                password: "$2b$10$H210fn813wmANL5FSLz3re6og0xwJ0fKT4HqSY3hi.QgelGGQPM7.",
                username: "nelsonciccottio",
                createdAt: new Date("2018-06-26T19:22:06.755Z"),
                updatedAt: new Date("2018-06-26T19:22:06.755Z"),
                __v: 0
            }
        ]);
        const resolver = new UserResolver(new UserService(db));
        await resolver.delete("5b32925ea8b04a071c7f8bb0");
        expect(db.data.length).to.eq(1);
        const user = db.data[0];
        expect(user).to.be.an('object');
        expect(user.deleted).to.eq(true);
        expect(user.deletedAt).to.be.a('date');
    });

    it('should validate password', async () => {
        const db = new FakeDatabase();
        const resolver = new UserResolver(new UserService(db));
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
        } catch (e) {
            expect(e.name).to.eq('UserNotFound');
        }
    });
});
