// ======================================================
// MES CORE V27 Enterprise
// File: /js/config.js
// ======================================================

export const APP = Object.freeze({
    NAME: "MES CORE",
    VERSION: "27.0.0",
    ENV: "production",
    DEBUG: true,
    TIMEZONE: "Africa/Cairo",
    LANGUAGE: "en",
    DATE_FORMAT: "YYYY-MM-DD",
    TIME_FORMAT: "HH:mm",
    DEFAULT_PAGE: "dashboard",
    AUTO_SAVE_INTERVAL: 30000,
    SYNC_INTERVAL: 10000
});

export const FIREBASE = Object.freeze({
    COLLECTIONS: {

        PRODUCTION: "production",

        QUALITY: "quality",

        USERS: "users",

        SHIFTS: "shifts",

        SETTINGS: "settings",

        REPORTS: "reports",

        LOGS: "logs",

        BACKUPS: "backups"

    }
});

export const STORAGE = Object.freeze({

    CACHE_PREFIX: "MESCORE",

    CACHE_KEYS: {

        USER: "CURRENT_USER",

        SETTINGS: "SETTINGS",

        LAST_SYNC: "LAST_SYNC",

        NETWORK: "NETWORK",

        QUEUE: "QUEUE"

    }

});

export const SHIFTS = Object.freeze({

    SHIFT_1: {

        id: 1,

        name: "Shift A",

        hours: [

            "08:30",
            "09:30",
            "10:30",
            "11:30",
            "12:45",
            "13:30",
            "14:30",
            "15:30",
            "16:15"

        ]

    },

    SHIFT_2: {

        id: 2,

        name: "Shift B",

        hours: [

            "17:30",
            "18:30",
            "19:30",
            "20:30",
            "21:30",
            "22:30",
            "23:30",
            "00:15"

        ]

    }

});

export const ROLES = Object.freeze({

    ADMIN: "admin",

    PRODUCTION_MANAGER: "production_manager",

    ENGINEER: "engineer",

    SUPERVISOR: "supervisor",

    OPERATOR: "operator",

    VIEWER: "viewer"

});

export const STATUS = Object.freeze({

    ONLINE: "online",

    OFFLINE: "offline",

    SYNCING: "syncing",

    ERROR: "error"

});

export const QUALITY = Object.freeze({

    IMAGE_MAX_SIZE: 1920,

    IMAGE_QUALITY: 0.85,

    MAX_IMAGES: 5

});

export const LOGGER = Object.freeze({

    ENABLED: true,

    MAX_ITEMS: 1000,

    LEVELS: {

        INFO: "INFO",

        SUCCESS: "SUCCESS",

        WARNING: "WARNING",

        ERROR: "ERROR",

        NETWORK: "NETWORK",

        FIREBASE: "FIREBASE",

        CACHE: "CACHE",

        SYNC: "SYNC"

    }

});

export const QUEUE = Object.freeze({

    MAX_RETRY: 5,

    RETRY_DELAY: 3000,

    MAX_ITEMS: 5000

});

export const PAGES = Object.freeze({

    LOGIN: "login",

    DASHBOARD: "dashboard",

    PRODUCTION: "production",

    QUALITY: "quality",

    REPORTS: "reports",

    SETTINGS: "settings"

});

export default {

    APP,

    FIREBASE,

    STORAGE,

    SHIFTS,

    ROLES,

    STATUS,

    QUALITY,

    LOGGER,

    QUEUE,

    PAGES

};
