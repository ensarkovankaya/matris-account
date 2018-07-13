import * as http from 'http';
import "reflect-metadata";
import { getLogger } from './logger';  // Required for TypeGraphQL and Typedi
import { Server } from "./server";

const logger = getLogger('bootstrap');

const bootstrap = async () => {
    const express = new Server();
    await express.connect();

    const port = parseInt(process.env.PORT || '3000', 10);
    const host = process.env.HOST || '0.0.0.0';

    const server = http.createServer(express.app);

    server.listen(port, host, () => logger.info(`Server listening on host ${host} port ${port}.`, {host, port}));
};

bootstrap()
    .catch(err => {
        logger.error('Server starting failed.', err);
        process.exit(1);
    });
