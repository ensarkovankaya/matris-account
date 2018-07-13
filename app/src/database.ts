import * as mongoose from "mongoose";
import { Logger } from './logger';

const logger = new Logger('database');

/**
 * Connects database
 * @return {Promise<void>}
 */
export const connect = async () => {
    const username = process.env.MONGODB_USERNAME;
    const password = process.env.MONGODB_PASSWORD;
    const host = process.env.MONGODB_HOST;
    const port = process.env.MONGODB_PORT;
    try {
        await mongoose.connect(`mongodb://${username}:${password}@${host}:${port}`);
    } catch (err) {
        logger.error('Database Connection Failed', err, {host, port, username});
        throw err;
    }
};
