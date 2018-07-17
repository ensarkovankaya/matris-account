import { expect } from 'chai';
import { describe, it } from 'mocha';
import { generateRandomUsername, normalizeUsername } from '../../src/utils';

describe('Utils', () => {
    describe('normalizeUsername', () => {
        it('should return same value for normalized input', () => {
            const output = normalizeUsername('abcdefgh');
            expect(output).to.be.eq('abcdefgh');
        });
        it('should remove empty spaces', () => {
            expect(normalizeUsername('ab cd  fg ')).to.be.eq('abcdfg');
            expect(normalizeUsername(' ab   cd  fg ')).to.be.eq('abcdfg');
        });
        it('should make letter lowercase', () => {
            expect(normalizeUsername('ABCDEFG')).to.be.eq('abcdefg');
            expect(normalizeUsername('ABCDEFGh')).to.be.eq('abcdefgh');
        });
        it('should replace all Ğ with g', () => {
            const output = normalizeUsername('aaĞaaĞaĞaaĞ');
            expect(output).to.be.eq('aagaagagaag');
        });
        it('should replace all ğ with g', () => {
            const output = normalizeUsername('aağaağağaağ');
            expect(output).to.be.eq('aagaagagaag');
        });
        it('should replace all ü with u', () => {
            const output = normalizeUsername('aaüaaüaüaaü');
            expect(output).to.be.eq('aauaauauaau');
        });
        it('should replace all Ü with u', () => {
            const output = normalizeUsername('aaÜaaÜaÜaaÜ');
            expect(output).to.be.eq('aauaauauaau');
        });
        it('should replace all ç with c', () => {
            const output = normalizeUsername('aaçaçaaça');
            expect(output).to.be.eq('aacacaaca');
        });
        it('should replace all Ç with c', () => {
            const output = normalizeUsername('aaÇaÇaaÇa');
            expect(output).to.be.eq('aacacaaca');
        });
        it('should replace all ş with s', () => {
            const output = normalizeUsername('aaşaşaaşa');
            expect(output).to.be.eq('aasasaasa');
        });
        it('should replace all Ş with s', () => {
            const output = normalizeUsername('aaŞaŞaaŞa');
            expect(output).to.be.eq('aasasaasa');
        });
        it('should replace all ı with i', () => {
            const output = normalizeUsername('aaıaıaaıa');
            expect(output).to.be.eq('aaiaiaaia');
        });
        it('should replace all I with i', () => {
            const output = normalizeUsername('aaIaIaaIa');
            expect(output).to.be.eq('aaiaiaaia');
        });
        it('should replace all ö with o', () => {
            const output = normalizeUsername('aaöaöaaöa');
            expect(output).to.be.eq('aaoaoaaoa');
        });
        it('should replace all Ö with o', () => {
            const output = normalizeUsername('aaÖaÖaaÖa');
            expect(output).to.be.eq('aaoaoaaoa');
        });
    });

    describe('generateRandomUsername', () => {
        it('should generate random string length of 5', () => {
            const username = generateRandomUsername(5);
            expect(username).to.be.a('string');
            expect(username).to.have.lengthOf(5);
        });
        it('should generate random string length of 10', () => {
            const username = generateRandomUsername(10);
            expect(username).to.be.a('string');
            expect(username).to.have.lengthOf(10);
        });
        it('should generate random string length of 0', () => {
            const username = generateRandomUsername(0);
            expect(username).to.be.a('string');
            expect(username).to.have.lengthOf(0);
        });
        it('should generate random string length of 20', () => {
            const username = generateRandomUsername(20);
            expect(username).to.be.a('string');
            expect(username).to.have.lengthOf(20);
        });
    });
});
