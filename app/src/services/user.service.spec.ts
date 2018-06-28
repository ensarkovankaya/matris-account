import { expect } from 'chai';
import { describe, it } from 'mocha';
import { ICompareModel } from '../models/compare.model';
import { Gender, IUpdateUserModel, IUserFilterModel, IUserModel, Role } from '../models/user.model';
import { IDatabaseService } from './database.service';
import { UserService } from './user.service';

const compareFilter = (data: IUserModel[], path: string, filter: ICompareModel) => {
    if (filter.eq !== undefined) {
        return data.filter(d => d[path] === filter.eq);
    }
    if (filter.gt !== undefined) {
        data = data.filter(d => d[path] > filter.gt);
    } else if (filter.gte !== undefined) {
        data = data.filter(d => d[path] >= filter.gte);
    }

    if (filter.lt !== undefined) {
        data = data.filter(d => d[path] < filter.lt);
    } else if (filter.lte !== undefined) {
        data = data.filter(d => d[path] <= filter.lte);
    }

    return data;
};

interface IFilterModel extends IUserFilterModel {
    _id?: string;
    email?: string;
    username?: string;
}

class FakeDatabase implements IDatabaseService<IUserModel> {

    private static generateID(length: number = 24) {
        const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        let id = '';
        for (let i = 0; i < length; i++) {
            const num = Math.floor(Math.random() * chars.length);
            id += chars.substring(num, num + 1);
        }
        return id;
    }

    private _data: IUserModel[];

    constructor(data: any[] = []) {
        this._data = data;
    }

    public async create(data: Partial<IUserModel>) {
        const user = {
            _id: FakeDatabase.generateID(),
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            password: data.password,
            role: data.role,
            username: data.username,
            gender: data.gender || null,
            birthday: data.birthday || null,
            active: data.active || false,
            groups: data.groups || [],
            lastLogin: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            deleted: false,
            deletedAt: null,
            __v: 0
        } as IUserModel;
        this._data.push(user);
        return user;
    }

    public async update(id: string, data: any) {
        this._data = this._data.map(user => {
            if (user._id === id) {
                return Object.assign({}, user, data, {__v: user.__v + 1});
            }
            return user;
        });
    }

    public async delete(id: string) {
        this._data = this._data.filter(user => user._id !== id);
    }

    public async all(filters: IUserFilterModel) {
        return this.filter(this._data.slice(), filters);
    }

    public async findOne(conditions: IUserFilterModel) {
        return this.filter(this._data.slice(), conditions)[0] || null;
    }

    set data(data: IUserModel[]) {
        this._data = data;
    }

    get data() {
        return this._data;
    }

    private filter(data: IUserModel[], filters: IFilterModel): IUserModel[] {
        if (filters._id) {
            data = data.filter(d => d._id === filters._id);
        }
        if (filters.username) {
            data = data.filter(d => d.username === filters.username);
        }
        if (filters.email) {
            data = data.filter(d => d.email === filters.email);
        }
        if (filters.active !== undefined) {
            data = data.filter(u => u.active === filters.active);
        }
        if (filters.role) {
            if (filters.role.eq) {
                data = data.filter(user => user.role === filters.role.eq);
            } else if (filters.role.in && filters.role.in.length > 0) {
                data = data.filter(u => filters.role.in.indexOf(u.role) > 0);
            }
        }
        if (filters.gender !== undefined) {
            data = data.filter(u => u.gender === filters.gender);
        }
        if (filters.birthday) {
            data = compareFilter(data, 'birthday', filters.birthday);
        }
        if (filters.deleted !== undefined) {
            data = data.filter(u => u.deleted === filters.deleted);
        }
        if (filters.deletedAt) {
            data = compareFilter(data, 'deletedAt', filters.deletedAt);
        }
        if (filters.createdAt) {
            data = compareFilter(data, 'createdAt', filters.createdAt);
        }
        if (filters.updatedAt) {
            data = compareFilter(data, 'updatedAt', filters.updatedAt);
        }
        if (filters.lastLogin) {
            data = compareFilter(data, 'lastLogin', filters.lastLogin);
        }
        if (filters.groups && filters.groups.length > 0) {
            data = data.filter(u => u.groups.some(id => filters.groups.indexOf(id) > 0));
        }
        return data;
    }
}

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
        const now = new Date();
        const service = new UserService(db);
        await service.delete("5b32925ea8b04a071c7f8bb0");
        const user = db.data[0];

        expect(user).to.be.an('object');
        expect(user.deleted).to.be.eq(true);
        expect(user.deletedAt).to.be.a('date');
        expect(user.deletedAt).to.be.gt(now);
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
