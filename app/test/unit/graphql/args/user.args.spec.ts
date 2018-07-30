import { expect } from 'chai';
import { describe, it } from 'mocha';
import "reflect-metadata";
import { UserArgs } from '../../../../src/graphql/args/user.args';

class ShouldNotSucceed extends Error {
    public name = 'ShouldNotSucceed';
}

describe('GraphQL -> Args -> User', () => {

    describe('Id', () => {
        it('should be valid', async () => {
            const input = new UserArgs({id: '5b4b57f1fc13ae1730000641'});
            await input.validate();
            expect(input).to.have.key('id');
            expect(input.id).to.be.eq('5b4b57f1fc13ae1730000641');
        });

        it('should raise ValidationError', async () => {
            try {
                await new UserArgs({id: 'notid'}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('id')).to.be.eq(true);
            }
        });
    });

    describe('Email', () => {
        it('should be valid', async () => {
            const input = new UserArgs({email: 'mail@mail.com'});
            await input.validate();
            expect(input).to.have.key('email');
            expect(input.email).to.be.eq('mail@mail.com');
        });

        it('should raise ValidationError', async () => {
            try {
                await new UserArgs({email: 'notamail'}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('email')).to.be.eq(true);
            }
        });
    });

    describe('Username', () => {
        it('should be valid', async () => {
            const input = new UserArgs({username: 'username'});
            await input.validate();
            expect(input).to.have.keys(['username']);
            expect(input.username).to.be.eq('username');
        });

        it('should raise ValidationError', async () => {
            try {
                await new UserArgs({username: 'asd'}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('username', 'length')).to.be.eq(true);
            }

            try {
                await new UserArgs({username: 'a'.repeat(33)}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('username', 'length')).to.be.eq(true);
            }

            try {
                await new UserArgs({username: 'userName'}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('username', 'isLowercase')).to.be.eq(true);
            }

            try {
                await new UserArgs({username: 'username-123'}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('username', 'isAlphanumeric')).to.be.eq(true);
            }
        });
    });
});
