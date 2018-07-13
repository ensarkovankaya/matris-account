import { Logger, RootLogger } from 'matris-logger';

const rootLogger = new RootLogger({name: 'services/account'});
const getLogger = (name: string, labels: string[] = []) => rootLogger.getLogger(name, labels);

export { getLogger, Logger };
