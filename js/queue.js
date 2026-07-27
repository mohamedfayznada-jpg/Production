// ======================================================
// MES CORE V27 Enterprise
// File: /js/queue.js
// ======================================================

import storage from "./storage.js";
import { STORAGE, QUEUE } from "./config.js";
import logger from "./logger.js";

const KEY = STORAGE.CACHE_KEYS.QUEUE;

class QueueManager {

    constructor() {

        this.items = storage.get(KEY, []);

    }

    save() {

        storage.set(KEY, this.items);

    }

    all() {

        return [...this.items];

    }

    count() {

        return this.items.length;

    }

    add(action, payload) {

        const item = {

            id: crypto.randomUUID(),

            action,

            payload,

            retry: 0,

            createdAt: new Date().toISOString()

        };

        this.items.push(item);

        this.save();

        logger.sync("Queue Added", item);

        return item;

    }

    remove(id) {

        this.items = this.items.filter(x => x.id !== id);

        this.save();

    }

    clear() {

        this.items = [];

        this.save();

    }

    first() {

        return this.items.length
            ? this.items[0]
            : null;

    }

    hasItems() {

        return this.items.length > 0;

    }

    async process(processor) {

        while (this.items.length) {

            const item = this.items[0];

            try {

                await processor(item);

                this.remove(item.id);

            }

            catch (error) {

                item.retry++;

                logger.error("Queue Failed", error);

                if (item.retry >= QUEUE.MAX_RETRY) {

                    logger.error("Queue Removed", item);

                    this.remove(item.id);

                }

                else {

                    this.save();

                }

                break;

            }

        }

    }

}

const queue = new QueueManager();

export default queue;

export { QueueManager };
