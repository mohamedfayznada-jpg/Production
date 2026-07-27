// ======================================================
// MES CORE V27 Enterprise
// File: /js/logger.js
// ======================================================

import { LOGGER } from "./config.js";

class Logger {

    constructor() {

        this.logs = [];

    }

    write(level, message, data = null) {

        if (!LOGGER.ENABLED) return;

        const item = {

            id: crypto.randomUUID(),

            level,

            message,

            data,

            time: new Date().toISOString()

        };

        this.logs.unshift(item);

        if (this.logs.length > LOGGER.MAX_ITEMS) {

            this.logs.pop();

        }

        console.log(
            `[${item.level}] ${item.time} - ${item.message}`,
            item.data ?? ""
        );

    }

    info(message, data = null) {

        this.write(LOGGER.LEVELS.INFO, message, data);

    }

    success(message, data = null) {

        this.write(LOGGER.LEVELS.SUCCESS, message, data);

    }

    warning(message, data = null) {

        this.write(LOGGER.LEVELS.WARNING, message, data);

    }

    error(message, data = null) {

        this.write(LOGGER.LEVELS.ERROR, message, data);

    }

    network(message, data = null) {

        this.write(LOGGER.LEVELS.NETWORK, message, data);

    }

    firebase(message, data = null) {

        this.write(LOGGER.LEVELS.FIREBASE, message, data);

    }

    cache(message, data = null) {

        this.write(LOGGER.LEVELS.CACHE, message, data);

    }

    sync(message, data = null) {

        this.write(LOGGER.LEVELS.SYNC, message, data);

    }

    all() {

        return [...this.logs];

    }

    clear() {

        this.logs = [];

    }

}

const logger = new Logger();

export default logger;
export { Logger };
