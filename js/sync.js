// ======================================================
// MES CORE V27 Enterprise
// File: /js/sync.js
// ======================================================

import network from "./network.js";
import queue from "./queue.js";
import storage from "./storage.js";
import logger from "./logger.js";
import { SyncAPI } from "./api.js";
import { STORAGE, APP } from "./config.js";

class SyncEngine {

    constructor() {

        this.running = false;
        this.timer = null;

    }

    start() {

        if (this.timer) return;

        this.timer = setInterval(() => {

            this.sync();

        }, APP.SYNC_INTERVAL);

        logger.sync("Sync Engine Started");

    }

    stop() {

        clearInterval(this.timer);

        this.timer = null;

        logger.sync("Sync Engine Stopped");

    }

    async sync() {

        if (this.running) return;

        if (network.isOffline()) return;

        if (!queue.hasItems()) return;

        this.running = true;

        try {

            await SyncAPI.process();

            storage.set(

                STORAGE.CACHE_KEYS.LAST_SYNC,

                new Date().toISOString()

            );

            logger.sync("Sync Completed");

        }

        catch (error) {

            logger.error("Sync Error", error);

        }

        finally {

            this.running = false;

        }

    }

    async force() {

        await this.sync();

    }

    lastSync() {

        return storage.get(

            STORAGE.CACHE_KEYS.LAST_SYNC,

            null

        );

    }

}

const sync = new SyncEngine();

network.onChange(async online => {

    if (online) {

        await sync.force();

    }

});

export default sync;
export { SyncEngine };
