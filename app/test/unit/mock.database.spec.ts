import { expect } from 'chai';
import { describe, it } from 'mocha';
import 'reflect-metadata';
import { Role } from '../../src/models/user.model';
import { MockDatabase } from './mock.database';

describe('Services -> MockDatabase', () => {
    it('should update', async () => {
        const service: MockDatabase = new MockDatabase();
        const user = await service.create({
            firstName: 'FirstName',
            lastName: 'LastName',
            role: Role.ADMIN,
            password: '123456789012345678901234567890123456789012345678901234567890',
            email: 'mail@mail.com',
            username: 'user1'
        });
        expect(user).to.be.an('object');
        await service.update(user._id, {firstName: 'Ensar'});
        const updated = await service.findOne({_id: user._id});
        expect(updated).to.be.an('object');
        expect(updated.firstName).to.be.a('string');
        expect(user.firstName).to.not.eq(updated.firstName);
    });
});
