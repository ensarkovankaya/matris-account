import { expect } from 'chai';
import { describe, it } from 'mocha';
import "reflect-metadata";
import { CompareNumberInput } from '../../../../src/graphql/inputs/compare.number.input';

class ShouldNotSucceed extends Error {
    public name = 'ShouldNotSucceed';
}

describe('GraphQL -> Inputs -> CompareNumberInput', () => {
    it('should be valid for empty object', async () => {
        const input = new CompareNumberInput({});
        await input.validate();
        expect(input).to.be.deep.eq({});
    });

    describe('EQ', () => {
        it('should be valid for eq', async () => {
            const input = new CompareNumberInput({eq: 2});
            await input.validate();
            expect(input.eq).to.be.a('number');
        });

        it('should raise ValidationError for eq is Date', async () => {
            try {
                await new CompareNumberInput({eq: new Date()} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('eq', 'isNumber')).to.be.eq(true);
            }
        });

        it('should raise ValidationError for eq is not a number', async () => {
            try {
                await new CompareNumberInput({eq: 'asd'} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('eq', 'isNumber')).to.be.eq(true);
            }
        });
    });

    describe('GT', () => {
        it('should be valid for gt', async () => {
            const input = new CompareNumberInput({gt: 3});
            await input.validate();
            expect(input.gt).to.be.a('number');
        });

        it('should raise ValidationError for gt is Date', async () => {
            try {
                await new CompareNumberInput({gt: new Date()} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('gt', 'isNumber')).to.be.eq(true);
            }
        });

        it('should raise ValidationError for gt is not a number', async () => {
            try {
                await new CompareNumberInput({gt: 'asd'} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('gt', 'isNumber')).to.be.eq(true);
            }
        });
    });

    describe('GTE', () => {
        it('should be valid for gte', async () => {
            const input = new CompareNumberInput({gte: 4});
            await input.validate();
            expect(input.gte).to.be.a('number');
        });

        it('should raise ValidationError for gte is Date', async () => {
            try {
                await new CompareNumberInput({gte: new Date()} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('gte', 'isNumber')).to.be.eq(true);
            }
        });

        it('should raise ValidationError for gte is not a number', async () => {
            try {
                await new CompareNumberInput({gte: 'asd'} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('gte', 'isNumber')).to.be.eq(true);
            }
        });
    });

    describe('LT', () => {
        it('should be valid for lt', async () => {
            const input = new CompareNumberInput({lt: 5});
            await input.validate();
            expect(input.lt).to.be.a('number');
        });

        it('should raise ValidationError for lt is Date', async () => {
            try {
                await new CompareNumberInput({lt: new Date()} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('lt', 'isNumber')).to.be.eq(true);
            }
        });

        it('should raise ValidationError for lt is not a number', async () => {
            try {
                await new CompareNumberInput({lt: 'asd'} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('lt', 'isNumber')).to.be.eq(true);
            }
        });
    });

    describe('LTE', () => {
        it('should be valid for lte', async () => {
            const input = new CompareNumberInput({lte: 6});
            await input.validate();
            expect(input.lte).to.be.a('number');
        });

        it('should raise ValidationError for lte is Date', async () => {
            try {
                await new CompareNumberInput({lte: new Date()} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('lte', 'isNumber')).to.be.eq(true);
            }
        });

        it('should raise ValidationError for lte is not a number', async () => {
            try {
                await new CompareNumberInput({lte: 'asd'} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('lte', 'isNumber')).to.be.eq(true);
            }
        });
    });
});
