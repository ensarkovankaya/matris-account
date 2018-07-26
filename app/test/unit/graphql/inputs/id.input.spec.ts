import { expect } from 'chai';
import { describe, it } from 'mocha';
import "reflect-metadata";
import { IDInput } from '../../../../src/graphql/inputs/id.Input';

class ShouldNotSucceed extends Error {
    public name = 'ShouldNotSucceed';
}

describe('GraphQL -> Inputs -> IDInput', () => {
    it('should validate', async () => {
        const input = new IDInput('5b4b57f1fc13ae1730000646');
        await input.validate();
        expect(input).to.have.key('id');
        expect(input.id).to.be.eq('5b4b57f1fc13ae1730000646');
    });

    it('should raise ArgumentValidationError', async () => {
        try {
            await new IDInput('notaid').validate();
            throw new ShouldNotSucceed();
        } catch (e) {
            expect(e.name).to.be.eq('ArgumentValidationError');
            expect(e.hasError('id')).to.be.eq(true);
        }
    });
});
