// ======================================================
// MES CORE V27 Enterprise
// File: /js/network.js
// ======================================================

import logger from "./logger.js";

class NetworkManager {

    constructor() {

        this.online = navigator.onLine;

        this.listeners = [];

        window.addEventListener("online", () => {

            this.online = true;

            logger.network("Connection Restored");

            this.emit();

        });

        window.addEventListener("offline", () => {

            this.online = false;

            logger.network("Connection Lost");

            this.emit();

        });

    }

    isOnline() {

        return this.online;

    }

    isOffline() {

        return !this.online;

    }

    onChange(callback) {

        this.listeners.push(callback);

    }

    emit() {

        this.listeners.forEach(callback => {

            callback(this.online);

        });

    }

    async waitUntilOnline() {

        if (this.online) return;

        return new Promise(resolve => {

            const handler = () => {

                if (this.online) {

                    resolve();

                }

            };

            this.onChange(handler);

        });

    }

}

const network = new NetworkManager();

export default network;
export { NetworkManager };
