import { expect } from 'chai';
import { GraphQLClient } from 'graphql-request';
import * as http from 'http';
import { after, before, beforeEach, describe, it } from 'mocha';
import "reflect-metadata";
import { Container } from 'typedi';
import { Logger } from '../../src/logger';
import { Gender, Role } from '../../src/models/user.model';
import Server from '../../src/server';
import { DatabaseService } from '../../src/services/database.service';
import { MockDatabase } from '../unit/mock.database';

const endpoint = 'http://0.0.0.0:3000/graphql';
const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

const logger = new Logger('GraphQL Spec File');

let server: http.Server;

before('Start Server', async () => {
    const PORT = parseInt(process.env.PORT || '3000', 10);
    const HOST = process.env.HOST || '0.0.0.0';

    server = http.createServer(Server);
    return await server.listen(PORT, HOST, () => logger.info(`Test Server start on host ${HOST} port ${PORT}.`));
});

class ShouldNotSucceed extends Error {
    public name = 'ShouldNotSucceed';
}

beforeEach('Mock Database', () => Container.set(DatabaseService, new MockDatabase()));

interface IUserModel {
    _id?: string;
    username?: string;
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    role?: Role;
    gender?: Gender | null;
    birthday?: string | null;
    active?: boolean;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
    deleted?: boolean;
    lastLogin?: string | null;
    groups?: string[];
}

describe('GraphQL', () => {

    it("should return 'must provide query string' error", async () => {
        const client = new GraphQLClient(endpoint, {headers});
        try {
            await client.request(``);
        } catch (err) {
            expect(err.response.status).to.eq(400);
            expect(err.response.errors).to.have.deep.members([{message: 'Must provide query string.'}]);
        }
    });

    describe('Create', () => {
        it("should throw error without variables", async () => {
            const client = new GraphQLClient(endpoint, {headers});
            const query = `mutation createUser($email: String!, $firstName: String!, $lastName: String!,
                            $password: String!, $role: Role!, $username: String, $gender: Gender,
                            $birthday: String, $groups: [String!]){
                    user: create(data: {email: $email, firstName: $firstName, lastName: $lastName, password: $password,
                        role: $role, username: $username, gender: $gender, birthday: $birthday, groups: $groups}) {
                            _id
                    }
                }
            `;
            try {
                await client.request(query);
                throw new ShouldNotSucceed();  // Make sure raise error
            } catch (err) {
                expect(err.name).to.not.eq('ShouldNotSucceed');
                expect(err.response).to.be.an('object');
                expect(err.response.status).to.eq(500);
                expect(err.message)
                    .to.have.string('Variable \\"$email\\" of required type \\"String!\\" was not provided.');
                expect(err.message)
                    .to.have.string('Variable \\"$firstName\\" of required type \\"String!\\" was not provided.');
                expect(err.message)
                    .to.have.string('Variable \\"$lastName\\" of required type \\"String!\\" was not provided.');
                expect(err.message)
                    .to.have.string('Variable \\"$password\\" of required type \\"String!\\" was not provided.');
                expect(err.message)
                    .to.have.string('Variable \\"$role\\" of required type \\"Role!\\" was not provided.');
            }
        });

        it("should create user with min data", async () => {
            const client = new GraphQLClient(endpoint, {headers});
            const query = `mutation createUser($email: String!, $firstName: String!, $lastName: String!,
                            $password: String!, $role: Role!, $username: String, $gender: Gender,
                            $birthday: String, $active: Boolean, $groups: [String!]){
                    user: create(data: {
                        email: $email, firstName: $firstName, lastName: $lastName, password: $password, role: $role,
                        username: $username, gender: $gender, birthday: $birthday, groups: $groups, active: $active
                        }) {
                            ...userFields
                    }
                }

                fragment userFields on User {
                    _id
                    email
                    firstName
                    lastName
                    role
                    username
                    gender
                    birthday
                    createdAt
                    updatedAt
                    deletedAt
                    deleted
                    groups
                    active
                    lastLogin
                }
            `;
            const response = await client.request<{ user: IUserModel }>(query, {
                email: 'email@example.com',
                firstName: 'FirstName',
                lastName: 'LastName',
                password: '12345678',
                role: 'ADMIN'
            });
            expect(response.user).to.be.an('object');
            expect(response.user._id).to.be.a('string');
            expect(response.user._id).to.have.lengthOf(24);
            expect(response.user.email).to.be.eq('email@example.com');
            expect(response.user.firstName).to.be.eq('FirstName');
            expect(response.user.lastName).to.be.eq('LastName');
            expect(response.user.password).to.be.eq(undefined);
            expect(response.user.role).to.be.eq('ADMIN');
            expect(response.user.username).to.be.a('string');
            expect(response.user.gender).to.be.eq(null);
            expect(response.user.birthday).to.be.eq(null);
            expect(response.user.createdAt).to.be.a('string');
            expect(new Date(response.user.createdAt).toString()).to.be.not.eq('Invalid Date');
            expect(response.user.updatedAt).to.be.a('string');
            expect(new Date(response.user.updatedAt).toString()).to.be.not.eq('Invalid Date');
            expect(response.user.deletedAt).to.be.eq(null);
            expect(response.user.deleted).to.be.eq(false);
            expect(response.user.groups).to.be.an('array');
            expect(response.user.groups).to.have.lengthOf(0);
            expect(response.user.active).to.be.eq(true);
            expect(response.user.lastLogin).to.be.eq(null);
        });

        it("should create user with max data", async () => {
            const client = new GraphQLClient(endpoint, {headers});
            const query = `mutation createUser($email: String!, $firstName: String!, $lastName: String!,
                            $password: String!, $role: Role!, $username: String!, $gender: Gender!,
                            $birthday: String!, $active: Boolean!, $groups: [String!]!){
                    user: create(data: {
                    email: $email, firstName: $firstName, lastName: $lastName, password: $password, role: $role,
                    username: $username, gender: $gender, birthday: $birthday, active: $active, groups: $groups}) {
                            ...userFields
                    }
                }

                fragment userFields on User {
                    _id
                    email
                    firstName
                    lastName
                    role
                    username
                    gender
                    birthday
                    createdAt
                    updatedAt
                    deletedAt
                    deleted
                    groups
                    active
                    lastLogin
                }
            `;
            const response = await client.request<{ user: IUserModel }>(query, {
                email: 'email2@example.com',
                firstName: 'FirstName',
                lastName: 'LastName',
                password: '12345678',
                role: 'ADMIN',
                gender: 'MALE',
                active: false,
                groups: ['random-24-chars-group-id'],
                birthday: new Date(1987, 3, 21),
                username: 'customusername'
            });
            expect(response.user).to.be.an('object');
            expect(response.user._id).to.be.a('string');
            expect(response.user._id).to.have.lengthOf(24);
            expect(response.user.email).to.be.eq('email2@example.com');
            expect(response.user.firstName).to.be.eq('FirstName');
            expect(response.user.lastName).to.be.eq('LastName');
            expect(response.user.password).to.be.eq(undefined);
            expect(response.user.role).to.be.eq('ADMIN');
            expect(response.user.username).to.be.eq('customusername');
            expect(response.user.gender).to.be.eq('MALE');
            expect(response.user.birthday).to.be.a('string');
            expect(new Date(response.user.birthday).toString()).to.be.not.eq('Invalid Date');
            expect(response.user.createdAt).to.be.a('string');
            expect(new Date(response.user.createdAt).toString()).to.be.not.eq('Invalid Date');
            expect(response.user.updatedAt).to.be.a('string');
            expect(new Date(response.user.updatedAt).toString()).to.be.not.eq('Invalid Date');
            expect(response.user.deletedAt).to.be.eq(null);
            expect(response.user.deleted).to.be.eq(false);
            expect(response.user.groups).to.be.an('array');
            expect(response.user.groups).to.have.lengthOf(1);
            expect(response.user.active).to.be.eq(false);
            expect(response.user.lastLogin).to.be.eq(null);
        });
    });
});

after('Stop Server', () => server.close(() => {
    logger.info('Test Server closed.');
    process.exit();
}));
