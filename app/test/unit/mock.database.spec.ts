import { expect } from 'chai';
import { readFileSync } from "fs";
import { describe, it } from 'mocha';
import 'reflect-metadata';
import { Role } from '../../src/models/user.model';
import { Gender } from '../data/user.model';
import { MockDatabase } from './mock.database';

const PATH: string = process.env.MOCK_DATA || __dirname + '/../data/db.json';
const DATA = JSON.parse(readFileSync(PATH, {encoding: 'utf8'}));

describe('Services -> MockDatabase', () => {
    it('should load all mock users', async () => {
        const service: MockDatabase = new MockDatabase();
        await service.load([]);
        expect(service.data.length).to.be.gt(0);
    });
    it('should load specific amount of mock users', async () => {
        const service: MockDatabase = new MockDatabase();
        await service.load(DATA, {n: 2});
        expect(service.data).to.have.lengthOf(2);
    });
    it('should create user', async () => {
        const db = new MockDatabase();
        const user = await db.create({
            username: "kbowlandsik",
            groups: [
                "7wWAvU0FiV0s2UNH5nvgzIRZ",
                "IN1NFAZ2NlcdQKnknJ632rq7",
                "SeOtFel5zNYQt5utYlidQOss"
            ],
            firstName: "Kara lynn",
            lastName: "Bowlands",
            email: "kbowlandsik@vimeo.com",
            birthday: new Date("06/21/1956"),
            role: Role.MANAGER,
            gender: Gender.FEMALE,
            active: true,
            password: "$2b$10$hmeS440fxNnUx5a6ejTn.uc40rxd5j90VTiPRrpXso9au3fwVV9e6"
        });
        expect(user).to.be.an('object');
        expect(user._id).to.be.an('object');
        expect(user._id.toString()).to.have.lengthOf(24);
        expect(user.username).to.be.eq('kbowlandsik');
        expect(user.firstName).to.be.eq('Kara lynn');
        expect(user.lastName).to.be.eq('Bowlands');
        expect(user.email).to.be.eq('kbowlandsik@vimeo.com');
        expect(user.birthday).to.be.a('date');
        expect(user.password).to.be.eq('$2b$10$hmeS440fxNnUx5a6ejTn.uc40rxd5j90VTiPRrpXso9au3fwVV9e6');
        expect(user.createdAt).to.be.a('date');
        expect(user.updatedAt).to.be.a('date');
        expect(user.deleted).to.be.eq(false);
        expect(user.deletedAt).to.be.eq(null);
        expect(user.active).to.be.eq(true);
        expect(user.role).to.be.eq('MANAGER');
        expect(user.gender).to.be.eq('FEMALE');
        expect(user.groups).to.be.an('array');
        expect(user.groups).to.have.lengthOf(3);
    });
    it('should update user', async () => {
        const db = new MockDatabase();
        await db.load(DATA, {n: 1});
        const user = db.data[0];
        expect(user).to.be.an('object');
        await db.update(user._id, {firstName: 'Name'});
        const updated = db.data[0];
        expect(updated).to.be.an('object');
        expect(updated.firstName).to.be.eq('Name');
    });
    it('should delete user', async () => {
        const db = new MockDatabase();
        await db.load(DATA, {n: 1});
        const user = db.data[0];
        expect(user).to.be.an('object');
        await db.delete(user._id);
        expect(db.data).to.have.lengthOf(0);
    });
    it('should return all users', async () => {
        const db = new MockDatabase();
        await db.load(DATA, {n: 5});
        const users = await db.all({});
        expect(users).to.have.lengthOf(5);
    });
    it('should findOne return user', async () => {
        const db = new MockDatabase();
        await db.load(DATA, {n: 2});
        const user = db.data[0];
        const find = await db.findOne({_id: user._id});
        expect(find.email).to.be.eq(user.email);
    });
    it('should findOne return null', async () => {
        const db = new MockDatabase();
        await db.load(DATA, {n: 2});
        const find = await db.findOne({_id: 'a'.repeat(24)});
        expect(find).to.be.eq(null);
    });
});
