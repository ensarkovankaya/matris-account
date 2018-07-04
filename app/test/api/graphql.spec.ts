import { expect } from 'chai';
import { GraphQLClient } from 'graphql-request';
import * as http from 'http';
import { after, before, describe, it } from 'mocha';
import "reflect-metadata";
import { Container } from 'typedi';
import Server from '../../src/server';
import { DatabaseService } from '../../src/services/database.service';
import { MockDatabase } from '../unit/mock.database';

const endpoint = 'http://0.0.0.0:3000/graphql';
const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

let server: http.Server;

before('Start Server', async () => {
    Container.set(DatabaseService, new MockDatabase());
    const PORT = parseInt(process.env.PORT || '3000', 10);
    const HOST = process.env.HOST || '0.0.0.0';

    server = http.createServer(Server);
    return await server.listen(PORT, HOST, () => console.log(`Test Server start on host ${HOST} port ${PORT}.`));
});

class ShouldNotSucceed extends Error {
    public name = 'ShouldNotSucceed';
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

    describe('Endpoint -> create', () => {
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
                console.log('Error');
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

        // it("should create user with min data", async () => {
        //     const client = new GraphQLClient(endpoint, {headers});
        //     const query = `mutation createUser($email: String!, $firstName: String!, $lastName: String!,
        //                     $password: String!, $role: Role!, $username: String, $gender: Gender,
        //                     $birthday: String, $groups: [String!]){
        //             user: create(data: {email: $email, firstName: $firstName, lastName: $lastName, password: $password,
        //                 role: $role, username: $username, gender: $gender, birthday: $birthday, groups: $groups}) {
        //                     _id
        //             }
        //         }
        //     `;
        //     try {
        //         await client.request(query, {
        //             data: {
        //                 email: 'email@example.com',
        //                 firstName: 'FirstName',
        //                 lastName: 'LastName',
        //             }
        //         });
        //         throw new ShouldNotSucceed();
        //     } catch (err) {
        //         console.log('Error');
        //         expect(err.response).to.be.an('object');
        //         expect(err.response.status).to.eq(500);
        //         expect(err.message)
        //             .to.have.string('Variable \\"$email\\" of required type \\"String!\\" was not provided.');
        //         expect(err.message)
        //             .to.have.string('Variable \\"$firstName\\" of required type \\"String!\\" was not provided.');
        //         expect(err.message)
        //             .to.have.string('Variable \\"$lastName\\" of required type \\"String!\\" was not provided.');
        //         expect(err.message)
        //             .to.have.string('Variable \\"$password\\" of required type \\"String!\\" was not provided.');
        //         expect(err.message)
        //             .to.have.string('Variable \\"$role\\" of required type \\"Role!\\" was not provided.');
        //     }
        // });
    });
});

after('Stop Server', () => server.close(() => {
    console.log('Test Server closed.');
    process.exit();
}));
