import { expect } from 'chai';
import { describe, it } from 'mocha';
import { DatabaseService } from './database.service';

describe('Database Service', () => {

    it('Initialize', () => {
        const db = new DatabaseService();
    });

    describe('Generate Username', () => {
        it('Random username from empty initial', () => {
            const db = new DatabaseService();
            const username = db.generateUsername();
            expect(username).to.be.an('string');
            expect(username).to.have.lengthOf.within(5, 20);
        });
        it('Random username from initial string', () => {
            const db = new DatabaseService();
            const initial = 'Elliot' + 'Alderson';
            const username = db.generateUsername(initial);
            expect(username).to.contain('elliotalderson');
        });
    });

});
