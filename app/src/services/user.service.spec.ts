import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Gender, IUpdateUserModel, Role } from '../models/user.model';
import { FakeDatabase } from './fake.database.service';
import { UserService } from './user.service';

describe('UserService', () => {
    it('should create user with basic information', async () => {
        const db = new FakeDatabase();
        const service = new UserService(db);
        const user = await service.create({
            email: 'email@mail.com',
            firstName: 'FirstName',
            lastName: 'LastName',
            password: '12345678',
            role: Role.STUDENT
        });
        // Generated Fields
        expect(user._id).to.be.a('string');
        expect(user.username).to.be.a('string');

        expect(user.password).to.not.eq('12345678');
        expect(user.password).to.lengthOf.gt(50);

        expect(user.firstName).to.eq('FirstName');
        expect(user.lastName).to.eq('LastName');
        expect(user.email).to.eq('email@mail.com');
        expect(user.role).to.eq('STUDENT');
        expect(db.data.length).to.eq(1);
    });

    it('should create user with all information', async () => {
        const db = new FakeDatabase();
        const service = new UserService(db);
        const user = await service.create({
            email: 'email@mail.com',
            firstName: 'FirstName',
            lastName: 'LastName',
            password: '12345678',
            role: Role.STUDENT,
            birthday: new Date(),
            gender: Gender.MALE,

        });

        expect(user._id).to.be.a('string');

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

    it('should update user', async () => {
        const db = new FakeDatabase([
            {
                _id: "5b32925ea8b04a071c7f8bb0",
                birthday: new Date("1999-01-26T00:00:00.000Z"),
                gender: "MALE",
                active: false,
                deletedAt: null,
                deleted: false,
                lastLogin: null,
                groups: [],
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
        const service = new UserService(db);
        const user = await service.update("5b32925ea8b04a071c7f8bb0", {
            gender: Gender.FEMALE,
            email: 'new@email.com',
            lastName: 'Whates',
            role: Role.INSTRUCTOR,
            password: 'newpassword',
            birthday: new Date("1993-02-26"),
            createdAt: new Date("2018-06-23T19:22:06.755Z"),
            updatedAt: new Date("2018-06-23T19:22:06.755Z")
        } as IUpdateUserModel);

        // Check is updated related fields
        expect(user.gender).to.eq('FEMALE');
        expect(user.email).to.eq('new@email.com');
        expect(user.lastName).to.eq('Whates');
        expect(user.role).to.eq('INSTRUCTOR');
        expect(user.birthday.getTime()).to.eq(new Date("1993-02-26").getTime());

        // Check is hashed the password
        expect(user.password).to.not.eq('$2b$10$H210fn813wmANL5FSLz3re6og0xwJ0fKT4HqSY3hi.QgelGGQPM7.');
        expect(user.password).to.not.eq('newpassword');

        // Check is not updated unrelated fields
        expect(user.createdAt.getTime()).to.not.eq(new Date("2018-06-23T19:22:06.755Z").getTime());
        expect(user.updatedAt.getTime()).to.not.eq(new Date("2018-06-23T19:22:06.755Z").getTime());
        expect(user.createdAt.getTime()).to.eq(new Date("2018-06-26T19:22:06.755Z").getTime());
        // Check is updated changed updatedAt
        expect(user.updatedAt.getTime()).to.not.eq(new Date("2018-06-26T19:22:06.755Z").getTime());
    });

    it('should soft delete user', async () => {
        const db = new FakeDatabase([
            {
                _id: "5b32925ea8b04a071c7f8bb0",
                birthday: new Date("1999-01-26T00:00:00.000Z"),
                gender: "MALE",
                active: false,
                deletedAt: null,
                deleted: false,
                lastLogin: null,
                groups: [],
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
        const service = new UserService(db);
        await service.delete("5b32925ea8b04a071c7f8bb0");
        const user = db.data[0];

        expect(user).to.be.an('object');
        expect(user.deleted).to.be.eq(true);
        expect(user.deletedAt).to.be.a('date');
    });

    it('should hard delete user', async () => {
        const db = new FakeDatabase([
            {
                _id: "5b32925ea8b04a071c7f8bb0",
                birthday: new Date("1999-01-26T00:00:00.000Z"),
                gender: "MALE",
                active: false,
                deletedAt: null,
                deleted: false,
                lastLogin: null,
                groups: [],
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
        const service = new UserService(db);
        await service.delete("5b32925ea8b04a071c7f8bb0", true);

        expect(db.data.length).to.be.eq(0);
    });

    it('should get user by id, email and username', async () => {
        const db = new FakeDatabase([
            {
                _id: "1",
                birthday: new Date("1999-01-26T00:00:00.000Z"),
                gender: "MALE",
                active: false,
                deletedAt: null,
                deleted: false,
                lastLogin: null,
                groups: [],
                email: "1@mail.com",
                firstName: "Nelson",
                lastName: "Ciccottio",
                role: "STUDENT",
                password: "$2b$10$H210fn813wmANL5FSLz3re6og0xwJ0fKT4HqSY3hi.QgelGGQPM7.",
                username: "user1",
                createdAt: new Date("2018-06-26T19:22:06.755Z"),
                updatedAt: new Date("2018-06-26T19:22:06.755Z"),
                __v: 0
            },
            {
                _id: "2",
                birthday: new Date("1999-01-26T00:00:00.000Z"),
                gender: "MALE",
                active: false,
                deletedAt: null,
                deleted: false,
                lastLogin: null,
                groups: [],
                email: "2@mail.com",
                firstName: "Nelson",
                lastName: "Ciccottio",
                role: "STUDENT",
                password: "$2b$10$H210fn813wmANL5FSLz3re6og0xwJ0fKT4HqSY3hi.QgelGGQPM7.",
                username: "user2",
                createdAt: new Date("2018-06-26T19:22:06.755Z"),
                updatedAt: new Date("2018-06-26T19:22:06.755Z"),
                __v: 0
            },
            {
                _id: "3",
                birthday: new Date("1999-01-26T00:00:00.000Z"),
                gender: "MALE",
                active: false,
                deletedAt: null,
                deleted: false,
                lastLogin: null,
                groups: [],
                email: "3@mail.com",
                firstName: "Nelson",
                lastName: "Ciccottio",
                role: "STUDENT",
                password: "$2b$10$H210fn813wmANL5FSLz3re6og0xwJ0fKT4HqSY3hi.QgelGGQPM7.",
                username: "user3",
                createdAt: new Date("2018-06-26T19:22:06.755Z"),
                updatedAt: new Date("2018-06-26T19:22:06.755Z"),
                __v: 0
            }
        ]);
        const service = new UserService(db);
        const byID = await service.getBy({id: "1"});
        expect(byID._id).to.eq("1");

        const byEmail = await service.getBy({email: "2@mail.com"});
        expect(byEmail._id).to.eq("2");

        const byUsername = await service.getBy({username: "user3"});
        expect(byUsername._id).to.eq("3");

        const notExists = await service.getBy({id: "5"});
        expect(notExists).to.eq(null);
    });
});
