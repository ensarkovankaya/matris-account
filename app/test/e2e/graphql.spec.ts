import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import * as axios from 'axios';
import { expect } from 'chai';
import { readFileSync } from "fs";
import { createServer, Server as HttpServer } from 'http';
import { Logger } from 'matris-logger';
import { after, before, beforeEach, describe, it } from 'mocha';
import "reflect-metadata";
import { Container } from 'typedi';
import { getLogger } from '../../src/logger';
import { IUserModel } from '../../src/models/user.model';
import { Server } from '../../src/server';
import { DatabaseService } from '../../src/services/database.service';
import { MockDatabase } from '../mocks/mock.database';

let server: HttpServer;

const PORT = parseInt(process.env.TEST_PORT || '1234', 10);
const HOST = process.env.TEST_HOST || '0.0.0.0';
const URL = process.env.TEST_URL || '/graphql';
const ENDPOINT = `http://${HOST}:${PORT}${URL}`;

const PATH: string = process.env.MOCK_DATA || __dirname + '/../data/db.json';
const DATA = JSON.parse(readFileSync(PATH, {encoding: 'utf8'}));
const database = new MockDatabase();

before('Start Server', async () => {
    const express = new Server();
    server = createServer(express.app);
    return await server.listen(PORT, HOST, () => console.info(`Test Server start on host ${HOST} port ${PORT}.`));
});

class ShouldNotSucceed extends Error {
    public name = 'ShouldNotSucceed';
}

class HttpClientError extends Error implements AxiosError {
    public name = 'HttpClientError';
    public config: AxiosRequestConfig;
    public code?: string;
    public request?: any;
    public response?: AxiosResponse;

    constructor(e: AxiosError) {
        super();
        this.config = e.config;
        this.code = e.code;
        this.request = e.request;
        this.response = e.response;
    }

}

beforeEach('Mock Database', async () => {
    await database.load(DATA);
    Container.set(DatabaseService, database);
});

class HttpClient {

    private logger: Logger;

    constructor() {
        this.logger = getLogger('HttpClient', ['test']);
    }

    public async request<T>(query: string, variables: { [key: string]: any }): Promise<AxiosResponse<T>> {
        try {
            this.logger.debug('Request', {query, variables});
            return await axios.default.request<T>({
                method: 'POST',
                url: ENDPOINT,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                data: {query, variables}
            });
        } catch (e) {
            this.logger.http('Request', e.request, e.response, {data: e.response.data});
            throw new HttpClientError(e);
        }
    }
}

describe('GraphQL', () => {

    const client = new HttpClient();

    it('should server running and excepting request', async () => {
        try {
            await client.request('', {});
            throw new ShouldNotSucceed();
        } catch (e) {
            expect(e.name).to.be.eq('HttpClientError');
            expect(e.response).to.be.an('object');
            expect(e.response.status).to.be.eq(400);
            expect(e.response.data).to.be.deep.eq({errors: [{message: 'Must provide query string.'}]});
        }
    });

    describe('Get', () => {

        it('should get user by id', async () => {
            const mockUser = database.getOne({deleted: false});
            const query = `query getUser($id: String, $email: String, $username: String) {
                    user: get(id: $id, email: $email, username: $username) {
                        _id,
                        email,
                        firstName,
                        lastName,
                        username,
                        createdAt,
                        updatedAt,
                        deletedAt,
                        deleted,
                        role,
                        lastLogin,
                        gender,
                        active,
                        birthday,
                        groups
                    }
                }`;
            const variables = {id: mockUser.id};
            const response = await client.request<{ data: { user: IUserModel } }>(query, variables);
            expect(response.status).to.be.eq(200);
            expect(response.data).to.be.an('object');
            expect(response.data).to.have.key('data');
            expect(response.data.data).to.be.an('object');
            expect(response.data.data).to.have.key('user');
            expect(response.data.data.user).to.be.an('object');

            // Check response user is valid
            const user = response.data.data.user;

            expect(user).to.have.keys([
                '_id',
                'email',
                'firstName',
                'lastName',
                'username',
                'createdAt',
                'updatedAt',
                'deletedAt',
                'deleted',
                'role',
                'lastLogin',
                'gender',
                'active',
                'birthday',
                'groups'
            ]);

            expect(user._id).to.be.eq(mockUser.id.toString());
            expect(user.email).to.be.eq(mockUser.email);
            expect(user.firstName).to.be.eq(mockUser.firstName);
            expect(user.lastName).to.be.eq(mockUser.lastName);
            expect(user.username).to.be.eq(mockUser.username);
            expect(user.createdAt).to.be.eq(mockUser.createdAt.toJSON());
            expect(user.updatedAt).to.be.eq(mockUser.updatedAt.toJSON());
            if (mockUser.deletedAt) {
                expect(user.deletedAt).to.be.eq(mockUser.deletedAt.toJSON());
            } else {
                expect(user.deletedAt).to.be.eq(null);
            }
            expect(user.deleted).to.be.eq(mockUser.deleted);
            expect(user.role).to.be.eq(mockUser.role);
            if (mockUser.lastLogin) {
                expect(user.lastLogin).to.be.eq(mockUser.lastLogin.toJSON());
            } else {
                expect(user.lastLogin).to.be.eq(null);
            }
            expect(user.gender).to.be.eq(mockUser.gender);
            expect(user.active).to.be.eq(mockUser.active);
            if (mockUser.birthday) {
                expect(user.birthday).to.be.eq(mockUser.birthday.toJSON());
            } else {
                expect(user.birthday).to.be.eq(null);
            }
            expect(user.groups).to.be.deep.eq(mockUser.groups);
        });

        it('should get user by email', async () => {
            const mockUser = database.getOne({deleted: false});
            const query = `query getUser($id: String, $email: String, $username: String) {
                    user: get(id: $id, email: $email, username: $username) {
                        _id,
                        email,
                        firstName,
                        lastName,
                        username,
                        createdAt,
                        updatedAt,
                        deletedAt,
                        deleted,
                        role,
                        lastLogin,
                        gender,
                        active,
                        birthday,
                        groups
                    }
                }`;
            const variables = {email: mockUser.email};
            const response = await client.request<{ data: { user: IUserModel } }>(query, variables);
            expect(response.status).to.be.eq(200);
            expect(response.data).to.be.an('object');
            expect(response.data).to.have.key('data');
            expect(response.data.data).to.be.an('object');
            expect(response.data.data).to.have.key('user');
            expect(response.data.data.user).to.be.an('object');

            // Check response user is valid
            const user = response.data.data.user;

            expect(user).to.have.keys([
                '_id',
                'email',
                'firstName',
                'lastName',
                'username',
                'createdAt',
                'updatedAt',
                'deletedAt',
                'deleted',
                'role',
                'lastLogin',
                'gender',
                'active',
                'birthday',
                'groups'
            ]);

            expect(user._id).to.be.eq(mockUser.id.toString());
            expect(user.email).to.be.eq(mockUser.email);
            expect(user.firstName).to.be.eq(mockUser.firstName);
            expect(user.lastName).to.be.eq(mockUser.lastName);
            expect(user.username).to.be.eq(mockUser.username);
            expect(user.createdAt).to.be.eq(mockUser.createdAt.toJSON());
            expect(user.updatedAt).to.be.eq(mockUser.updatedAt.toJSON());
            if (mockUser.deletedAt) {
                expect(user.deletedAt).to.be.eq(mockUser.deletedAt.toJSON());
            } else {
                expect(user.deletedAt).to.be.eq(null);
            }
            expect(user.deleted).to.be.eq(mockUser.deleted);
            expect(user.role).to.be.eq(mockUser.role);
            if (mockUser.lastLogin) {
                expect(user.lastLogin).to.be.eq(mockUser.lastLogin.toJSON());
            } else {
                expect(user.lastLogin).to.be.eq(null);
            }
            expect(user.gender).to.be.eq(mockUser.gender);
            expect(user.active).to.be.eq(mockUser.active);
            if (mockUser.birthday) {
                expect(user.birthday).to.be.eq(mockUser.birthday.toJSON());
            } else {
                expect(user.birthday).to.be.eq(null);
            }
            expect(user.groups).to.be.deep.eq(mockUser.groups);
        });

        it('should get user by username', async () => {
            const mockUser = database.getOne({deleted: false});
            const query = `query getUser($id: String, $email: String, $username: String) {
                    user: get(id: $id, email: $email, username: $username) {
                        _id,
                        email,
                        firstName,
                        lastName,
                        username,
                        createdAt,
                        updatedAt,
                        deletedAt,
                        deleted,
                        role,
                        lastLogin,
                        gender,
                        active,
                        birthday,
                        groups
                    }
                }`;
            const variables = {username: mockUser.username};
            const response = await client.request<{ data: { user: IUserModel } }>(query, variables);
            expect(response.status).to.be.eq(200);
            expect(response.data).to.be.an('object');
            expect(response.data).to.have.key('data');
            expect(response.data.data).to.be.an('object');
            expect(response.data.data).to.have.key('user');
            expect(response.data.data.user).to.be.an('object');

            // Check response user is valid
            const user = response.data.data.user;

            expect(user).to.have.keys([
                '_id',
                'email',
                'firstName',
                'lastName',
                'username',
                'createdAt',
                'updatedAt',
                'deletedAt',
                'deleted',
                'role',
                'lastLogin',
                'gender',
                'active',
                'birthday',
                'groups'
            ]);

            expect(user._id).to.be.eq(mockUser.id.toString());
            expect(user.email).to.be.eq(mockUser.email);
            expect(user.firstName).to.be.eq(mockUser.firstName);
            expect(user.lastName).to.be.eq(mockUser.lastName);
            expect(user.username).to.be.eq(mockUser.username);
            expect(user.createdAt).to.be.eq(mockUser.createdAt.toJSON());
            expect(user.updatedAt).to.be.eq(mockUser.updatedAt.toJSON());
            if (mockUser.deletedAt) {
                expect(user.deletedAt).to.be.eq(mockUser.deletedAt.toJSON());
            } else {
                expect(user.deletedAt).to.be.eq(null);
            }
            expect(user.deleted).to.be.eq(mockUser.deleted);
            expect(user.role).to.be.eq(mockUser.role);
            if (mockUser.lastLogin) {
                expect(user.lastLogin).to.be.eq(mockUser.lastLogin.toJSON());
            } else {
                expect(user.lastLogin).to.be.eq(null);
            }
            expect(user.gender).to.be.eq(mockUser.gender);
            expect(user.active).to.be.eq(mockUser.active);
            if (mockUser.birthday) {
                expect(user.birthday).to.be.eq(mockUser.birthday.toJSON());
            } else {
                expect(user.birthday).to.be.eq(null);
            }
            expect(user.groups).to.be.deep.eq(mockUser.groups);
        });

        it('should return null for deleted user', async () => {
            const mockUser = database.getOne({deleted: true});
            const query = `query getUser($id: String, $email: String, $username: String) {
                    user: get(id: $id, email: $email, username: $username) {
                        _id,
                        email,
                        firstName,
                        lastName,
                        username,
                        createdAt,
                        updatedAt,
                        deletedAt,
                        deleted,
                        role,
                        lastLogin,
                        gender,
                        active,
                        birthday,
                        groups
                    }
                }`;
            const variables = {id: mockUser.id};
            const response = await client.request<{ data: { user: IUserModel } }>(query, variables);
            expect(response.status).to.be.eq(200);
            expect(response.data).to.be.an('object');
            expect(response.data).to.have.key('data');
            expect(response.data.data).to.be.an('object');
            expect(response.data.data).to.have.key('user');
            expect(response.data.data.user).to.be.eq(null);
        });
    });

    describe('Password', () => {
        it('should return true for active and not deleted user', async () => {
            const mockUser = database.getOne({deleted: false, active: true});
            const query = `query isPasswordValid($email: String!, $password: String!) {
                    valid: password(data: {email: $email, password: $password})
            }`;
            const variables = {email: mockUser.email, password: mockUser.email};
            const response = await client.request<{ data: { valid: boolean } }>(query, variables);
            expect(response.status).to.be.eq(200);
            expect(response.data).to.be.an('object');
            expect(response.data).to.have.key('data');
            expect(response.data.data).to.be.an('object');
            expect(response.data.data).to.have.key('valid');
            expect(response.data.data.valid).to.be.eq(true);
        });

        it('should raise error for not active user', async () => {
            const mockUser = database.getOne({deleted: false, active: false});
            const query = `query isPasswordValid($email: String!, $password: String!) {
                    valid: password(data: {email: $email, password: $password})
            }`;
            const variables = {email: mockUser.email, password: mockUser.email};

            try {
                await client.request<{ data: { valid: boolean } }>(query, variables);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('HttpClientError');
                expect(e.response.status).to.be.eq(500);
                expect(e.response.data).to.be.an('object');
                expect(e.response.data).to.have.keys(['errors', 'data']);
                expect(e.response.data.data).to.be.eq(null);
                expect(e.response.data.errors).to.be.an('array');
                expect(e.response.data.errors).to.have.lengthOf(1);
                const error = e.response.data.errors[0];
                expect(error).to.be.an('object');
                expect(error).to.have.keys(['message', 'locations', 'path']);
                expect(error.message).to.have.string('is not active');
            }
        });

        it('should raise error for deleted user', async () => {
            const mockUser = database.getOne({deleted: true});
            const query = `query isPasswordValid($email: String!, $password: String!) {
                    valid: password(data: {email: $email, password: $password})
            }`;
            const variables = {email: mockUser.email, password: mockUser.email};

            try {
                await client.request<{ data: { valid: boolean } }>(query, variables);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('HttpClientError');
                expect(e.response.status).to.be.eq(500);
                expect(e.response.data).to.be.an('object');
                expect(e.response.data).to.have.keys(['errors', 'data']);
                expect(e.response.data.data).to.be.eq(null);
                expect(e.response.data.errors).to.be.an('array');
                expect(e.response.data.errors).to.have.lengthOf(1);
                const error = e.response.data.errors[0];
                expect(error).to.be.an('object');
                expect(error).to.have.keys(['message', 'locations', 'path']);
                expect(error.message).to.have.string('User not found');
            }
        });

        it('should raise error for not existing user', async () => {
            const query = `query isPasswordValid($email: String!, $password: String!) {
                    valid: password(data: {email: $email, password: $password})
            }`;
            const variables = {email: 'notexists@user.com', password: '12345678'};

            try {
                await client.request<{ data: { valid: boolean } }>(query, variables);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('HttpClientError');
                expect(e.response.status).to.be.eq(500);
                expect(e.response.data).to.be.an('object');
                expect(e.response.data).to.have.keys(['errors', 'data']);
                expect(e.response.data.data).to.be.eq(null);
                expect(e.response.data.errors).to.be.an('array');
                expect(e.response.data.errors).to.have.lengthOf(1);
                const error = e.response.data.errors[0];
                expect(error).to.be.an('object');
                expect(error).to.have.keys(['message', 'locations', 'path']);
                expect(error.message).to.have.string('User not found');
            }
        });

        it('should return false for invalid password', async () => {
            const mockUser = database.getOne({deleted: false, active: true});
            const query = `query isPasswordValid($email: String!, $password: String!) {
                    valid: password(data: {email: $email, password: $password})
            }`;
            const variables = {email: mockUser.email, password: '12345678'};
            const response = await client.request<{ data: { valid: boolean } }>(query, variables);
            expect(response.status).to.be.eq(200);
            expect(response.data).to.be.an('object');
            expect(response.data).to.have.key('data');
            expect(response.data.data).to.be.an('object');
            expect(response.data.data).to.have.key('valid');
            expect(response.data.data.valid).to.be.eq(false);
        });

        it('email variable should be required', async () => {
            try {
                const query = `query isPasswordValid($email: String!, $password: String!) {
                    valid: password(data: {email: $email, password: $password})
                }`;
                const variables = {password: '12345678'};
                await client.request<{ data: { valid: boolean } }>(query, variables);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('HttpClientError');
                expect(e.response.status).to.be.eq(500);
                expect(e.response.data).to.be.an('object');
                expect(e.response.data).to.have.keys(['errors']);
                expect(e.response.data.errors).to.be.an('array');
                expect(e.response.data.errors).to.have.lengthOf(1);
                const error = e.response.data.errors[0];
                expect(error).to.be.an('object');
                expect(error).to.have.keys(['message', 'locations']);
                expect(error.message).to.be.eq('Variable "$email" of required type "String!" was not provided.');
            }
        });

        it('password variable should be required', async () => {
            try {
                const query = `query isPasswordValid($email: String!, $password: String!) {
                    valid: password(data: {email: $email, password: $password})
                }`;
                const variables = {email: 'mail@mail.com'};
                await client.request<{ data: { valid: boolean } }>(query, variables);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('HttpClientError');
                expect(e.response.status).to.be.eq(500);
                expect(e.response.data).to.be.an('object');
                expect(e.response.data).to.have.keys(['errors']);
                expect(e.response.data.errors).to.be.an('array');
                expect(e.response.data.errors).to.have.lengthOf(1);
                const error = e.response.data.errors[0];
                expect(error).to.be.an('object');
                expect(error).to.have.keys(['message', 'locations']);
                expect(error.message).to.be.eq('Variable "$password" of required type "String!" was not provided.');
            }
        });

        it('should raise error for email if email variable is not email format', async () => {
            try {
                const query = `query isPasswordValid($email: String!, $password: String!) {
                    valid: password(data: {email: $email, password: $password})
                }`;
                const variables = {email: 'notamailaddress', password: '12345678'};
                await client.request<{ data: { valid: boolean } }>(query, variables);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('HttpClientError');
                expect(e.response.status).to.be.eq(500);
                expect(e.response.data).to.be.an('object');
                expect(e.response.data).to.have.keys(['errors', 'data']);
                expect(e.response.data.data).to.be.eq(null);
                expect(e.response.data.errors).to.be.an('array');
                expect(e.response.data.errors).to.have.lengthOf(1);
                const error = e.response.data.errors[0];
                expect(error).to.be.an('object');
                expect(error).to.have.keys(['message', 'locations', 'path', 'validationErrors']);
                expect(error.message).to.be.eq('Argument Validation Error');
                expect(error.validationErrors).to.be.deep.eq([{
                    target: {
                        email: "notamailaddress",
                        password: "12345678"
                    },
                    value: "notamailaddress",
                    property: "email",
                    children: [],
                    constraints: {isEmail: "InvalidEmail"}
                }]);
            }
        });
    });

    describe('Delete', () => {
        it('should delete active user', async () => {
            const mockUser = database.getOne({deleted: false, active: true});
            const query = `mutation deleteUser($id: String!) {
                    deleted: delete(id: $id)
                }`;
            const variables = {id: mockUser.id};
            const response = await client.request<{ data: { deleted: boolean } }>(query, variables);
            expect(response.status).to.be.eq(200);
            expect(response.data).to.be.an('object');
            expect(response.data).to.have.key('data');
            expect(response.data.data).to.be.an('object');
            expect(response.data.data).to.have.key('deleted');
            expect(response.data.data.deleted).to.be.eq(true);
        });

        it('should delete inactive user', async () => {
            const mockUser = database.getOne({deleted: false, active: false});
            const query = `mutation deleteUser($id: String!) {
                    deleted: delete(id: $id)
                }`;
            const variables = {id: mockUser.id};
            const response = await client.request<{ data: { deleted: boolean } }>(query, variables);
            expect(response.status).to.be.eq(200);
            expect(response.data).to.be.an('object');
            expect(response.data).to.have.key('data');
            expect(response.data.data).to.be.an('object');
            expect(response.data.data).to.have.key('deleted');
            expect(response.data.data.deleted).to.be.eq(true);
        });

        it('should raise error for already deleted user', async () => {
            const mockUser = database.getOne({deleted: true});
            const query = `mutation deleteUser($id: String!) {
                    deleted: delete(id: $id)
                }`;
            const variables = {id: mockUser.id};

            try {
                await client.request<{ data: { deleted: boolean } }>(query, variables);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('HttpClientError');
                expect(e.response.status).to.be.eq(500);
                expect(e.response.data).to.be.an('object');
                expect(e.response.data).to.have.keys(['errors', 'data']);
                expect(e.response.data.data).to.be.eq(null);
                expect(e.response.data.errors).to.be.an('array');
                expect(e.response.data.errors).to.have.lengthOf(1);
                const error = e.response.data.errors[0];
                expect(error).to.be.an('object');
                expect(error).to.have.keys(['message', 'locations', 'path']);
                expect(error.message).to.have.string('User not found');
            }
        });

        it('should raise error for not exists user', async () => {
            const query = `mutation deleteUser($id: String!) {
                    deleted: delete(id: $id)
                }`;
            const variables = {id: '1'.repeat(24)};

            try {
                await client.request<{ data: { deleted: boolean } }>(query, variables);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('HttpClientError');
                expect(e.response.status).to.be.eq(500);
                expect(e.response.data).to.be.an('object');
                expect(e.response.data).to.have.keys(['errors', 'data']);
                expect(e.response.data.data).to.be.eq(null);
                expect(e.response.data.errors).to.be.an('array');
                expect(e.response.data.errors).to.have.lengthOf(1);
                const error = e.response.data.errors[0];
                expect(error).to.be.an('object');
                expect(error).to.have.keys(['message', 'locations', 'path']);
                expect(error.message).to.have.string('User not found');
            }
        });
    });
})
;

after('Stop Server', () => server.close(() => {
    console.info('Test Server closed.');
    process.exit();
}));
