import { describe, it } from 'mocha';
import { Logger } from '../../src/logger';

describe('Logger', () => {
    it('should log debug', () => {
        const logger = new Logger('TestLogger');
        logger.debug('Debug Log Message');
    });

    it('should log info', () => {
        const logger = new Logger('TestLogger');
        logger.info('Info Log Message');
    });

    it('should log warning', () => {
        const logger = new Logger('TestLogger');
        logger.warn('Warning Log Message');
    });

    it('should log error', () => {
        const logger = new Logger('TestLogger');
        try {
            throw new Error('TestError');
        } catch (e) {
            logger.error('Error Log Message', e);
        }
    });

    it('should log with labels', () => {
        const logger = new Logger('TestLogger', ['service']);
        logger.info('Info Log Message');
    });

    it('should log with data', () => {
        const logger = new Logger('TestLogger');
        logger.info('Info Log Message', {a: 1, b: 2});
    });

    it('should log http', () => {
        const logger = new Logger('TestLogger');
        const request = {body: {}, params: {p1: 1, p2: 2}} as any;
        logger.http('Http Log Message', request);
    });
});
