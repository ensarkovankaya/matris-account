import { expect } from 'chai';
import { describe, it } from 'mocha';
import "reflect-metadata";
import { PasswordInput } from '../../../../src/graphql/inputs/password.input';

class ShouldNotSucceed extends Error {
    public name = 'ShouldNotSucceed';
}

describe('GraphQL -> Inputs -> PasswordInput', () => {
    describe('Email', () => {
        it('should be valid', async () => {
            try {
                const input = new PasswordInput({email: 'email@mail.com'});
                expect(input).to.have.keys(['email']);
                expect(input.email).to.be.eq('email@mail.com');
                await input.validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('email')).to.be.eq(false);
            }
        });

        it('should raise ValidationError', async () => {
            try {
                await new PasswordInput({email: 'notaemail'}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('email', 'isEmail')).to.be.eq(true);
            }
        });
    });

    describe('Password', () => {
        it('should be valid', async () => {
            try {
                const input1 = new PasswordInput({password: '12345678'});
                expect(input1).to.have.keys(['password']);
                expect(input1.password).to.be.eq('12345678');
                await input1.validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('password')).to.be.eq(false);
            }

            try {
                const input2 = new PasswordInput({password: '1237aysd.1öças-*149-*'});
                expect(input2).to.have.keys(['password']);
                expect(input2.password).to.be.eq('1237aysd.1öças-*149-*');
                await input2.validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('password')).to.be.eq(false);
            }
        });

        it('should raise ValidationError', async () => {
            try {
                await new PasswordInput({password: ''}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('password', 'length')).to.be.eq(true);
            }

            try {
                await new PasswordInput({password: 'a'.repeat(33)}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('password', 'length')).to.be.eq(true);
            }
        });
    });
});
