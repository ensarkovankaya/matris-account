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
const DATA = JSON.parse(readFileSync(PATH, {encoding: 'utf8'}));

const database = new MockDatabase();

const express = new Server();
const server = createServer(express.app);

database.load(DATA).then(() => {
    console.info('Mock data loaded.');
    Container.set(DatabaseService, database);
    server.listen(PORT, HOST, () => console.info(`Test Server start on host ${HOST} port ${PORT}.`));
}).catch(error => {
    console.error('Mock data can not loaded', error);
    throw error;
});
