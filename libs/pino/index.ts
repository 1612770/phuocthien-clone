import pino, { Logger } from 'pino';
import LOG_LEVELS from './constants/log-levels';

const logLevels = new Map<string, string>(Object.entries(LOG_LEVELS));

function getLogLevel(logger: string): string {
  return logLevels.get(logger) || logLevels.get('*') || 'info';
}

export function getLogger(name: keyof typeof LOG_LEVELS): Logger {
  return pino({
    name,
    level: getLogLevel(name),
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: true,
        levelFirst: true,
      },
    },
  });
}
