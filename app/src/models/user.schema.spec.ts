import { ObjectID } from 'bson';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { User } from './user.schema';

describe('User Schema', () => {
    it('Create User Object with Default values.', () => {
        const user = new User();
        expect(user).to.have.any.keys(['$__', '_doc', 'errors', 'isNew', '_id', 'username', 'firstName', 'lastName',
            'email', 'password', 'createdAt', 'updatedAt', 'deletedAd', 'lastLogin', 'role', 'birthday', 'gender',
            'active']);
        expect(user._id).to.be.an('ObjectID');
        expect(user.isNew).to.be.eq(true);
        expect(user.get('username')).to.be.eq(null);
    });
});
