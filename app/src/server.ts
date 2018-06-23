import * as bodyParser from "body-parser";
import * as compression from "compression";
import * as cors from "cors";
import * as express from "express";
import * as expressValidator from 'express-validator';
import * as helmet from "helmet";
import * as mongoose from "mongoose";
import * as morgan from "morgan";
import { getGraphQLHTTPServer } from './graphql';

class Server {
    // set app to be of type express.Application
    public app: express.Application;

    constructor() {
        this.app = express();
        this.connectDatabase().then().catch(() => process.exit(1));
        this.config();
        this.routes();
    }

    public async connectDatabase() {
        try {
            const username = process.env.MONGODB_USERNAME;
            const password = process.env.MONGODB_PASSWORD;
            const host = process.env.MONGODB_HOST;
            const port = process.env.MONGODB_PORT;
            await mongoose.connect(`mongodb://${username}:${password}@${host}:${port}`);
        } catch (err) {
            console.error('Database Connection Failed', err);
            throw err;
        }
    }

    // application config
    public config() {
        // express middleware
        // this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(bodyParser.json());
        this.app.use(morgan("dev"));
        this.app.use(compression());
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(expressValidator());

        // cors
        this.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            res.header(
                "Access-Control-Allow-Headers",
                "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials",
            );
            res.header("Access-Control-Allow-Credentials", "true");
            next();
        });
    }

    // application routes
    public routes(): void {
        this.app.use('/graphql', getGraphQLHTTPServer());
    }
}

export default new Server().app;
