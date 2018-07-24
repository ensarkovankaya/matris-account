import { expect } from 'chai';
import { describe, it } from 'mocha';
import "reflect-metadata";
import { DeleteInput } from '../../../../src/graphql/inputs/delete.input';

class ShouldNotSucceed extends Error {
    public name = 'ShouldNotSucceed';
}

describe('DeleteInput', () => {
    it('should validate', async () => {
        const input = new DeleteInput({id: '5b4b57f1fc13ae1730000646'});
        await input.validate();
        expect(input).to.have.key('id');
        expect(input.id).to.be.eq('5b4b57f1fc13ae1730000646');
    });

    it('should raise ArgumentValidationError', async () => {
        try {
            await new DeleteInput({id: 'notaid'}).validate();
            throw new ShouldNotSucceed();
        } catch (e) {
            expect(e.name).to.be.eq('ArgumentValidationError');
            expect(e.validationErrors).to.be.an('array');
            expect(e.validationErrors).to.have.lengthOf(1);
            const err = e.validationErrors[0];
            expect(err).to.have.keys(['target', 'value', 'property', 'children', 'constraints']);
            expect(err.property).to.be.eq('id');
        }
    });
});
