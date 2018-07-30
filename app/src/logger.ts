import { Logger, LogLevel, RootLogger } from 'matris-logger';

const level = process.env.LOG_LEVEL as LogLevel || 'info';

const rootLogger = new RootLogger({level});
const getLogger = (name: string, labels: string[] = []) => rootLogger.getLogger(name, labels);

export { getLogger, Logger };
