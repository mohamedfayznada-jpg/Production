// ======================================================
// MES CORE V27 Enterprise
// File: /js/storage.js
// ======================================================

import { STORAGE } from "./config.js";

const PREFIX = STORAGE.CACHE_PREFIX;

class StorageManager {

    key(name) {
        return `${PREFIX}_${name}`;
    }

    set(name, value) {
        try {

            localStorage.setItem(
                this.key(name),
                JSON.stringify(value)
            );

            return true;

        } catch (error) {

            console.error(error);

            return false;

        }
    }

    get(name, defaultValue = null) {

        try {

            const value = localStorage.getItem(this.key(name));

            if (value === null) return defaultValue;

            return JSON.parse(value);

        } catch {

            return defaultValue;

        }

    }

    remove(name) {

        localStorage.removeItem(this.key(name));

    }

    clear() {

        Object.keys(localStorage).forEach(key => {

            if (key.startsWith(PREFIX + "_")) {

                localStorage.removeItem(key);

            }

        });

    }

    exists(name) {

        return localStorage.getItem(this.key(name)) !== null;

    }

    push(name, item) {

        const list = this.get(name, []);

        list.push(item);

        this.set(name, list);

        return list;

    }

    replace(name, value) {

        this.set(name, value);

        return value;

    }

}

const storage = new StorageManager();

export default storage;
export { StorageManager };
