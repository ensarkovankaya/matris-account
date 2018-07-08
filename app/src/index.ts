import * as http from 'http';
import "reflect-metadata";
import { Logger } from './logger';  // Required for TypeGraphQL and Typedi
import Server from "./server";

const port = parseInt(process.env.PORT || '3000', 10);
const host = process.env.HOST || '0.0.0.0';

const logger = new Logger('Index');
const server = http.createServer(Server);

server.listen(port, host, () => logger.info(`Server listening on host ${host} port ${port}.`, {host, port}));
