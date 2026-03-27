import pino from "pino";

const pinoLogger = pino({
  level: process.env.LOG_LEVEL || "info",
});

function writeLog(level, message, context = {}) {
  if (Object.keys(context).length === 0) {
    pinoLogger[level](message);
    return;
  }

  pinoLogger[level](context, message);
}

export function logger(message, context = {}) {
  writeLog("info", message, context);
}

logger.info = (message, context = {}) => writeLog("info", message, context);
logger.warn = (message, context = {}) => writeLog("warn", message, context);
logger.error = (message, context = {}) => writeLog("error", message, context);
logger.debug = (message, context = {}) => writeLog("debug", message, context);
