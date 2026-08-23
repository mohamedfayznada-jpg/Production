// ======================================================
// MES CORE V28 Enterprise
// File: /js/queue.js
// ======================================================

import storage from "./storage.js";
import { STORAGE, QUEUE } from "./config.js";
import logger from "./logger.js";

const KEY = STORAGE.CACHE_KEYS.QUEUE;

class QueueManager {
    constructor() { this.items = storage.get(KEY, []); }
    save() { storage.set(KEY, this.items); }
    all() { return structuredClone(this.items); }
    count() { return this.items.length; }

    add(action, payload) {
        if (!action) throw new Error("Queue action is required");
        if (this.items.length >= QUEUE.MAX_ITEMS) throw new Error("Offline queue limit reached");
        const item = { id: crypto.randomUUID(), action, payload, retry: 0, createdAt: new Date().toISOString(), nextAttemptAt: 0 };
        this.items.push(item);
        this.save();
        logger.sync("Queue Added", item);
        return item;
    }

    remove(id) { this.items = this.items.filter(x => x.id !== id); this.save(); }
    clear() { this.items = []; this.save(); }
    first() { return this.items[0] || null; }
    hasItems() { return this.items.length > 0; }

    async process(processor) {
        while (this.items.length) {
            const item = this.items[0];
            if (item.nextAttemptAt && Date.now() < item.nextAttemptAt) break;
            try {
                await processor(item);
                this.remove(item.id);
            } catch (error) {
                item.retry += 1;
                item.nextAttemptAt = Date.now() + Math.min(30000, QUEUE.RETRY_DELAY * Math.max(1, item.retry));
                logger.error("Queue Failed", { action: item.action, retry: item.retry, error: error?.message || String(error) });
                if (item.retry >= QUEUE.MAX_RETRY) {
                    logger.error("Queue Removed After Max Retry", item);
                    this.remove(item.id);
                } else {
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
