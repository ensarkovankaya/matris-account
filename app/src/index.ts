import * as http from 'http';
import "reflect-metadata";
import { connect } from './database';
import { Logger } from './logger';  // Required for TypeGraphQL and Typedi
import Server from "./server";

const logger = new Logger('bootstrap');

const bootstrap = async () => {
    await connect();

    const port = parseInt(process.env.PORT || '3000', 10);
    const host = process.env.HOST || '0.0.0.0';

    const server = http.createServer(Server);

    server.listen(port, host, () => logger.info(`Server listening on host ${host} port ${port}.`, {host, port}));
};

bootstrap().catch(err => {
    logger.error('Server start failed.', err);
    process.exit(1);
});
