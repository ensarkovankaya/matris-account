import * as http from 'http';
import "reflect-metadata";  // Required for TypeGraphQL and Typedi
import Server from "./server";

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

const server = http.createServer(Server);

server.listen(PORT, HOST, () => console.log(`Server listening on host ${HOST} port ${PORT}.`));
