import { readFileSync } from "fs";
import { createServer, Server as HttpServer } from 'http';
import "reflect-metadata";
import { Container } from 'typedi';
import { Server } from '../../src/server';
import { DatabaseService } from '../../src/services/database.service';
import { MockDatabase } from '../mocks/mock.database';

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

const PATH: string = process.env.MOCK_DATA || __dirname + '/../data/db.json';
const DATA = JSON.parse(readFileSync(PATH, { encoding: 'utf8' }));

const database = new MockDatabase();

const express = new Server();
/**
 * Resets database data.
 * @param req Request
 * @param res Response
 */
const resetRoute = async (req, res) => {
    try {
        await database.load(DATA);
        return res.status(200).send({ message: 'Data Loaded' });
    } catch (e) {
        console.error('Database reset failed!', e);
        return res.status(500).send({ message: 'Server Error' });
    }
};

express.app.use('/reset', resetRoute);

const server: HttpServer = createServer(express.app);

const initialize = async () => {
    try {
        console.info('Mock data loading...');
        await database.load(DATA);
        console.info('Mock data loaded.');
        Container.set(DatabaseService, database);
        return server.listen(PORT, HOST, () => console.info(`Test Server start on host ${HOST} port ${PORT}.`));
    } catch (e) {
        console.error('Mock data can not loaded', e);
        throw e;
    }
};

initialize();
