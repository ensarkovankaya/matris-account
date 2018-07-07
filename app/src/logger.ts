import { Request } from 'express';
import { createLogger, format, Logger as WinstonLogger, transports } from 'winston';

const isTest = (): boolean => process.env.NODE_ENV.toLowerCase() === 'test';

const isDevelopment = (): boolean => {
    const env = process.env.NODE_ENV.toLowerCase();
    return env === 'dev' || env === 'development';
};

export class Logger {
    private logger: WinstonLogger;

    constructor(private name: string, private labels: string[] = []) {
        this.logger = createLogger({
            level: isDevelopment() ? 'debug' : 'info',
            levels: {
                error: 0,
                warn: 1,
                info: 2,
                http: 4,
                debug: 5
            },
            format: format.combine(format.timestamp(), format.json()),
            transports: isDevelopment() ? [
                new transports.Console(),
                new transports.File({
                    filename: 'debug.log',
                    dirname: 'logs',
                    level: 'debug',
                    maxsize: 1024 * 50, // 50 MB
                    maxFiles: 10,
                    tailable: true
                }),
                new transports.File({
                    filename: 'info.log',
                    dirname: 'logs',
                    level: 'info',
                    maxsize: 1024 * 10, // 10 MB
                    maxFiles: 10,
                    tailable: true
                }),
                new transports.File({
                    filename: 'error.log',
                    dirname: 'logs',
                    level: 'error',
                    maxsize: 1024 * 10, // 10 MB
                    maxFiles: 10,
                    tailable: true
                })
            ] : [
                new transports.Console(),
                new transports.File({
                    filename: 'info.log',
                    dirname: 'logs',
                    level: 'info',
                    maxsize: 1024 * 10, // 10 MB
                    maxFiles: 10,
                    tailable: true
                }),
                new transports.File({
                    filename: 'error.log',
                    dirname: 'logs',
                    level: 'error',
                    maxsize: 1024 * 10, // 10 MB
                    maxFiles: 10,
                    tailable: true
                })
            ],
            silent: isTest()
        });
    }

    public error(message: string, err: Error, data?: object) {
        this.logger.log('error', message, {
            name: this.name,
            labels: this.labels,
            data,
            error: {name: err.name, message: err.message, stack: err.stack}
        });
    }

    public warn(message: string, data?: object) {
        this.logger.log('warning', message, {name: this.name, labels: this.labels, data});
    }

    public info(message: string, data?: object) {
        this.logger.log('info', message, {name: this.name, labels: this.labels, data});
    }

    public debug(message: string, data?: object) {
        this.logger.log('debug', message, {name: this.name, labels: this.labels, data});
    }

    public http(message: string, req: Request, data?: object) {
        this.logger.log('http', message, {name: this.name, labels: this.labels, request: req, data});
    }
}
