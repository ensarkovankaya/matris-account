import { expect } from 'chai';
import { describe, it } from 'mocha';
import "reflect-metadata";
import { CompareDateInput } from '../../../../src/graphql/inputs/compare.date.input';

class ShouldNotSucceed extends Error {
    public name = 'ShouldNotSucceed';
}

describe('GraphQL -> Inputs -> CompareDateInput', () => {
    it('should be valid for empty object', async () => {
        const input = new CompareDateInput();
        await input.validate();
        expect(input).to.be.deep.eq({});
    });

    describe('EQ', () => {
        it('should be valid for eq', async () => {
            const input = new CompareDateInput({eq: new Date()});
            await input.validate();
            expect(input.eq).to.be.a('date');
        });

        it('should raise ValidationError for eq is Invalid Date', async () => {
            try {
                await new CompareDateInput({eq: new Date('asd')}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('eq');
                expect(err.constraints).to.have.key('isDate');
            }
        });

        it('should raise ValidationError for eq is not a date', async () => {
            try {
                await new CompareDateInput({eq: 'asd'}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('eq');
                expect(err.constraints).to.have.key('isDate');
            }
        });
    });

    describe('GT', () => {
        it('should be valid for gt', async () => {
            const input = new CompareDateInput({gt: new Date()});
            await input.validate();
            expect(input.gt).to.be.a('date');
        });

        it('should raise ValidationError for gt is Invalid Date', async () => {
            try {
                await new CompareDateInput({gt: new Date('asd')}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('gt');
                expect(err.constraints).to.have.key('isDate');
            }
        });

        it('should raise ValidationError for gt is not a date', async () => {
            try {
                await new CompareDateInput({gt: 'asd'}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('gt');
                expect(err.constraints).to.have.key('isDate');
            }
        });
    });

    describe('GTE', () => {
        it('should be valid for gte', async () => {
            const input = new CompareDateInput({gte: new Date()});
            await input.validate();
            expect(input.gte).to.be.a('date');
        });

        it('should raise ValidationError for gte is Invalid Date', async () => {
            try {
                await new CompareDateInput({gte: new Date('asd')}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('gte');
                expect(err.constraints).to.have.key('isDate');
            }
        });

        it('should raise ValidationError for gte is not a date', async () => {
            try {
                await new CompareDateInput({gte: 'asd'}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('gte');
                expect(err.constraints).to.have.key('isDate');
            }
        });
    });

    describe('LT', () => {
        it('should be valid for lt', async () => {
            const input = new CompareDateInput({lt: new Date()});
            await input.validate();
            expect(input.lt).to.be.a('date');
        });

        it('should raise ValidationError for lt is Invalid Date', async () => {
            try {
                await new CompareDateInput({lt: new Date('asd')}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('lt');
                expect(err.constraints).to.have.key('isDate');
            }
        });

        it('should raise ValidationError for lt is not a date', async () => {
            try {
                await new CompareDateInput({lt: 'asd'}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('lt');
                expect(err.constraints).to.have.key('isDate');
            }
        });
    });

    describe('LTE', () => {
        it('should be valid for lte', async () => {
            const input = new CompareDateInput({lte: new Date()});
            await input.validate();
            expect(input.lte).to.be.a('date');
        });

        it('should raise ValidationError for lte is Invalid Date', async () => {
            try {
                await new CompareDateInput({lte: new Date('asd')}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('lte');
                expect(err.constraints).to.have.key('isDate');
            }
        });

        it('should raise ValidationError for lte is not a date', async () => {
            try {
                await new CompareDateInput({lte: 'asd'}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('lte');
                expect(err.constraints).to.have.key('isDate');
            }
        });
    });
});
