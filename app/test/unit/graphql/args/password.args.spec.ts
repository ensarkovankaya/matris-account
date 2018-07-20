import { expect } from 'chai';
import { describe, it } from 'mocha';
import "reflect-metadata";
import { PasswordArgs } from '../../../../src/graphql/args/password.args';

class ShouldNotSucceed extends Error {
    public name = 'ShouldNotSucceed';
}

describe('', () => {
    describe('Email', () => {
        it('should be valid', async () => {
            const input = new PasswordArgs({email: 'email@mail.com'});
            await input.validate();
            expect(input).to.have.keys(['email']);
            expect(input.email).to.be.eq('email@mail.com');
        });

        it('should raise ValidationError', async () => {
            try {
                await new PasswordArgs({email: 'notaemail'}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('email');
                expect(err.constraints).to.have.key('isEmail');
            }
        });
    });

    describe('Password', () => {
        it('should be valid', async () => {
            const input1 = new PasswordArgs({password: '12345678'});
            await input1.validate();
            expect(input1).to.have.keys(['password']);
            expect(input1.password).to.be.eq('12345678');

            const input2 = new PasswordArgs({password: '1237aysd.1öças-*149-*'});
            await input2.validate();
            expect(input2).to.have.keys(['password']);
            expect(input2.password).to.be.eq('1237aysd.1öças-*149-*');
        });

        it('should raise ValidationError', async () => {
            try {
                await new PasswordArgs({password: ''}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('password');
                expect(err.constraints).to.have.keys(['length', 'matches']);
            }

            try {
                await new PasswordArgs({password: 'a'.repeat(33)}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('password');
                expect(err.constraints).to.have.keys(['length']);
            }

            try {
                await new PasswordArgs({password: 'asdasd asd'}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('password');
                expect(err.constraints).to.have.keys(['matches']);
            }
        });
    });
});
