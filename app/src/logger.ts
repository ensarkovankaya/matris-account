import { Logger, LogLevel, RootLogger } from 'matris-logger';

const level = process.env.LOG_LEVEL || 'info';

const rootLogger = new RootLogger({level} as any);
const getLogger = (name: string, labels: string[] = []) => rootLogger.getLogger(name, labels);

export { getLogger, Logger };
