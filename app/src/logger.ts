import { Logger, RootLogger } from 'matris-logger';

const rootLogger = new RootLogger();
const getLogger = (name: string, labels: string[] = []) => rootLogger.getLogger(name, labels);

export { getLogger, Logger };
