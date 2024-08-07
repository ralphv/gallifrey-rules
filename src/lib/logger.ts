import log4js from 'log4js';
import Config from './Config';

const config = new Config();

const l = log4js.getLogger(`gallifrey-rules`);
l.level = config.getLogLevel();
export const logger = l;
