import { expect } from 'chai';
import { readFileSync } from "fs";
import { describe, it } from 'mocha';
import 'reflect-metadata';
import { Gender, Role } from '../../src/models/user.model';
import { IDBUserModel } from '../data/db.model';
import { MockDatabase } from './mock.database';

const PATH: string = process.env.MOCK_DATA || __dirname + '/../data/db.json';
const DATA: IDBUserModel[] = JSON.parse(readFileSync(PATH, {encoding: 'utf8'}));

describe('Services -> MockDatabase', () => {
    describe('load', () => {
        it('should load all mock users', async () => {
            const service: MockDatabase = new MockDatabase();
            await service.load([]);
            expect(service.data.length).to.be.eq(0);
        });
        it('should load specific amount of mock users', async () => {
            const service: MockDatabase = new MockDatabase();
            await service.load(DATA, {n: 2});
            expect(service.data).to.have.lengthOf(2);
        });
    });

    describe('create', () => {
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
    });

    describe('update', () => {
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
    });

    describe('delete', () => {
        it('should delete user', async () => {
            const db = new MockDatabase();
            await db.load(DATA, {n: 1});
            const user = db.data[0];
            expect(user).to.be.an('object');
            await db.delete(user._id);
            expect(db.data).to.have.lengthOf(0);
        });
    });

    describe('all', () => {
        describe('pagination', () => {
            describe('limit', () => {
                it('should return correct data for 50 users with limit 25', async () => {
                    const db = new MockDatabase();
                    await db.load(DATA, {n: 50});
                    const result = await db.all({}, {limit: 25});
                    expect(result).to.have.keys(['docs', 'total', 'limit', 'page', 'pages', 'offset']);
                    expect(result.total).to.be.eq(50);
                    expect(result.docs).to.have.lengthOf(25);
                    expect(result.page).to.be.eq(1);
                    expect(result.pages).to.be.eq(2);
                });
                it('should return correct data for 0 users with limit 25', async () => {
                    const db = new MockDatabase();
                    await db.load([]);
                    const result = await db.all({}, {limit: 25});
                    expect(result).to.have.keys(['docs', 'total', 'limit', 'page', 'pages', 'offset']);
                    expect(result.total).to.be.eq(0);
                    expect(result.docs).to.have.lengthOf(0);
                    expect(result.page).to.be.eq(1);
                    expect(result.pages).to.be.eq(1);
                });
                it('should return correct data for 15 users with limit 25', async () => {
                    const db = new MockDatabase();
                    await db.load(DATA, {n: 15});
                    const result = await db.all({}, {limit: 25});
                    expect(result).to.have.keys(['docs', 'total', 'limit', 'page', 'pages', 'offset']);
                    expect(result.total).to.be.eq(15);
                    expect(result.docs).to.have.lengthOf(15);
                    expect(result.page).to.be.eq(1);
                    expect(result.pages).to.be.eq(1);
                });
                it('should return correct data for 80 users with limit 25', async () => {
                    const db = new MockDatabase();
                    await db.load(DATA, {n: 80});
                    const result = await db.all({}, {limit: 25});
                    expect(result).to.have.keys(['docs', 'total', 'limit', 'page', 'pages', 'offset']);
                    expect(result.total).to.be.eq(80);
                    expect(result.docs).to.have.lengthOf(25);
                    expect(result.page).to.be.eq(1);
                    expect(result.pages).to.be.eq(4);
                });
            });

            describe('page', () => {
                it('should return different data for every pages', async () => {
                    const db = new MockDatabase();
                    await db.load(DATA, {n: 75});
                    const page1 = await db.all({}, {limit: 25, page: 1});
                    expect(page1).to.have.keys(['docs', 'total', 'limit', 'page', 'pages', 'offset']);
                    expect(page1.total).to.be.eq(75);
                    expect(page1.docs).to.have.lengthOf(25);
                    expect(page1.page).to.be.eq(1);
                    expect(page1.pages).to.be.eq(3);

                    const page2 = await db.all({}, {limit: 25, page: 2});
                    expect(page2).to.have.keys(['docs', 'total', 'limit', 'page', 'pages', 'offset']);
                    expect(page2.total).to.be.eq(75);
                    expect(page2.docs).to.have.lengthOf(25);
                    expect(page2.page).to.be.eq(2);
                    expect(page2.pages).to.be.eq(3);

                    const page3 = await db.all({}, {limit: 25, page: 3});
                    expect(page3).to.have.keys(['docs', 'total', 'limit', 'page', 'pages', 'offset']);
                    expect(page3.total).to.be.eq(75);
                    expect(page3.docs).to.have.lengthOf(25);
                    expect(page3.page).to.be.eq(3);
                    expect(page3.pages).to.be.eq(3);

                    expect(page1.docs.map(d => d._id.toString()))
                        .to.be.not.eq(page2.docs.map(d => d._id.toString()));

                    expect(page2.docs.map(d => d._id.toString()))
                        .to.be.not.eq(page3.docs.map(d => d._id.toString()));

                    expect(page1.docs.map(d => d._id.toString()))
                        .to.be.not.eq(page3.docs.map(d => d._id.toString()));
                });
            });

            describe('offset', () => {
                it('should offset data', async () => {
                    const db = new MockDatabase();
                    await db.load(DATA, {n: 75});
                    const page1 = await db.all({}, {limit: 25, offset: 30});
                    expect(page1).to.have.keys(['docs', 'total', 'limit', 'page', 'pages', 'offset']);
                    expect(page1.total).to.be.eq(45);
                    expect(page1.docs).to.have.lengthOf(25);
                    expect(page1.page).to.be.eq(1);
                    expect(page1.pages).to.be.eq(2);
                });
            });
        });
    });

    describe('findOne', () => {
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
});
