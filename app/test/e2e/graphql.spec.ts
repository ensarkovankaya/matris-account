import { expect } from 'chai';
import { readFileSync } from "fs";
import * as http from 'http';
import { AccountService } from 'matris-account-api';
import { after, before, beforeEach, describe, it } from 'mocha';
import "reflect-metadata";
import { Container } from 'typedi';
import { Server } from '../../src/server';
import { DatabaseService } from '../../src/services/database.service';
import { MockDatabase } from '../mocks/mock.database';

let ENDPOINT: string = '';

let server: http.Server;

const PATH: string = process.env.MOCK_DATA || __dirname + '/../data/db.json';
const DATA = JSON.parse(readFileSync(PATH, {encoding: 'utf8'}));
const database = new MockDatabase();

before('Start Server', async () => {
    const PORT = parseInt(process.env.PORT || '3000', 10);
    const HOST = process.env.HOST || '0.0.0.0';
    const URL = process.env.URL || '/graphql';
    ENDPOINT = `http://${HOST}:${PORT}${URL}`;
    const express = new Server();
    server = http.createServer(express.app);
    return await server.listen(PORT, HOST, () => console.info(`Test Server start on host ${HOST} port ${PORT}.`));
});

class ShouldNotSucceed extends Error {
    public name = 'ShouldNotSucceed';
}

beforeEach('Mock Database', async () => {
    await database.load(DATA);
    Container.set(DatabaseService, database);
});

describe('GraphQL', () => {
    describe('Get', () => {
        it('should get user by id', async () => {
            const service = new AccountService({url: ENDPOINT});
            const mockUser = database.getOne({deleted: false});
            const user = await service.get({id: mockUser.id});
            expect(user).to.be.an('object');
            expect(user.id).to.be.eq(mockUser._id.toString());
            expect(user.username).to.be.eq(mockUser.username);
        });

        it('should get user by email', async () => {
            const service = new AccountService({url: ENDPOINT});
            const mockUser = database.getOne({deleted: false});
            const user = await service.get({email: mockUser.email});
            expect(user.id).to.be.eq(mockUser._id.toString());
        });

        it('should get user by username', async () => {
            const service = new AccountService({url: ENDPOINT});
            const mockUser = database.getOne({deleted: false});
            const user = await service.get({username: mockUser.username});
            expect(user.id).to.be.eq(mockUser._id.toString());
        });

        it('should return null for deleted user', async () => {
            const service = new AccountService({url: ENDPOINT});
            const mockUser = database.getOne({deleted: true});
            const user = await service.get({id: mockUser._id.toString()});
            expect(user).to.be.eq(null);
        });
    });
});

after('Stop Server', () => server.close(() => {
    console.info('Test Server closed.');
    process.exit();
}));
