import { expect } from 'chai';
import { describe, it } from 'mocha';
import "reflect-metadata";
import { CompareDateInput } from '../../../../src/graphql/inputs/compare.date.input';

class ShouldNotSucceed extends Error {
    public name = 'ShouldNotSucceed';
}

describe('GraphQL -> Inputs -> CompareDateInput', () => {
    it('should be valid for empty object', async () => {
        const input = new CompareDateInput({});
        await input.validate();
        expect(input).to.be.deep.eq({});
    });

    describe('EQ', () => {
        it('should be valid for eq is Date', async () => {
            const input = new CompareDateInput({eq: new Date()});
            await input.validate();
            expect(input.eq).to.be.a('date');
        });

        it('should be valid for eq is null', async () => {
            const input = new CompareDateInput({eq: null});
            await input.validate();
            expect(input.eq).to.be.eq(null);
        });

        it('should raise ValidationError for eq is Invalid Date', async () => {
            try {
                await new CompareDateInput({eq: new Date('asd')}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('eq', 'isDate')).to.be.eq(true);
            }
        });

        it('should raise ValidationError for eq is not a date', async () => {
            try {
                await new CompareDateInput({eq: 'asd'} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('eq', 'isDate')).to.be.eq(true);
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
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('gt', 'isDate')).to.be.eq(true);
            }
        });

        it('should raise ValidationError for gt is not a date', async () => {
            try {
                await new CompareDateInput({gt: 'asd'} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('gt', 'isDate')).to.be.eq(true);
            }
        });

        it('should raise ValidationError for gt is null', async () => {
            try {
                await new CompareDateInput({gt: null}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('gt', 'isDate')).to.be.eq(true);
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
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('gte', 'isDate')).to.be.eq(true);
            }
        });

        it('should raise ValidationError for gte is not a date', async () => {
            try {
                await new CompareDateInput({gte: 'asd'} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('gte', 'isDate')).to.be.eq(true);
            }
        });

        it('should raise ValidationError for gte is null', async () => {
            try {
                await new CompareDateInput({gte: null}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('gte', 'isDate')).to.be.eq(true);
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
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('lt', 'isDate')).to.be.eq(true);
            }
        });

        it('should raise ValidationError for lt is not a date', async () => {
            try {
                await new CompareDateInput({lt: 'asd'} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('lt', 'isDate')).to.be.eq(true);
            }
        });

        it('should raise ValidationError for lt is null', async () => {
            try {
                await new CompareDateInput({lt: null}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('lt', 'isDate')).to.be.eq(true);
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
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('lte', 'isDate')).to.be.eq(true);
            }
        });

        it('should raise ValidationError for lte is not a date', async () => {
            try {
                await new CompareDateInput({lte: 'asd'} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('lte', 'isDate')).to.be.eq(true);
            }
        });

        it('should raise ValidationError for lte is null', async () => {
            try {
                await new CompareDateInput({lte: null}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('lte', 'isDate')).to.be.eq(true);
            }
        });
    });
});
