// ======================================================
// MES CORE V27 Enterprise
// File: /js/app.js
// Part 1 / 6
// ======================================================

import auth from "./auth.js";
import router from "./router.js";
import theme from "./theme.js";
import ui from "./ui.js";
import events from "./events.js";
import sync from "./sync.js";
import analytics from "./analytics.js";
import charts from "./charts.js";
import notifications from "./notifications.js";
import permissions from "./permissions.js";
import logger from "./logger.js";

class App {

    constructor() {

        this.version = "27.0.0";

        this.initialized = false;

    }

    async init() {

        if (this.initialized) {

            return;

        }

        logger.info("Initializing MES CORE...");

        theme.load();

        await auth.waitForAuth();

        await sync.start();

        await notifications.request();

        this.registerPermissions();

        this.registerRoutes();

        this.registerEvents();

        router.start("/dashboard");

        this.initialized = true;

        logger.success("MES CORE Ready");

    }

}

const app = new App();

export default app;

export {

    App

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/app.js
// Part 2 / 6
// ======================================================

App.prototype.registerRoutes = function () {

    router

        .add("/dashboard", () => {

            ui.showView("dashboard");

        })

        .add("/production", () => {

            ui.showView("production");

        })

        .add("/quality", () => {

            ui.showView("quality");

        })

        .add("/reports", () => {

            ui.showView("reports");

        })

        .add("/settings", () => {

            ui.showView("settings");

        })

        .add("/users", () => {

            ui.showView("users");

        });

};

App.prototype.registerPermissions = function () {

    permissions.define("admin", [

        "*"

    ]);

    permissions.define("manager", [

        "dashboard",

        "production",

        "quality",

        "reports",

        "settings"

    ]);

    permissions.define("supervisor", [

        "dashboard",

        "production",

        "quality"

    ]);

    permissions.define("operator", [

        "production"

    ]);

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/app.js
// Part 3 / 6
// ======================================================

App.prototype.registerEvents = function () {

    events.on(

        "theme:toggle",

        () => theme.toggle()

    );

    events.on(

        "sync:start",

        () => sync.start()

    );

    events.on(

        "sync:stop",

        () => sync.stop()

    );

    events.on(

        "notify",

        message =>

            notifications.info(message)

    );

    events.on(

        "dashboard:refresh",

        () => {

            analytics.dashboard();

        }

    );

    events.on(

        "charts:destroy",

        () => charts.destroyAll()

    );

    events.on(

        "logout",

        async () => {

            await auth.logout();

            router.navigate("/login");

        }

    );

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/app.js
// Part 4 / 6
// ======================================================

App.prototype.refresh = async function () {

    logger.info("Refreshing application...");

    await sync.start();

    events.emit(

        "dashboard:refresh"

    );

};

App.prototype.registerServiceWorker = async function () {

    if (

        !("serviceWorker" in navigator)

    ) {

        return;

    }

    try {

        await navigator.serviceWorker.register(

            "/js/sw.js"

        );

        logger.success(

            "Service Worker Registered"

        );

    } catch (error) {

        logger.error(

            error.message

        );

    }

};

App.prototype.versionInfo = function () {

    return {

        version: this.version,

        initialized: this.initialized,

        online: navigator.onLine,

        userAgent: navigator.userAgent

    };

};

App.prototype.isReady = function () {

    return this.initialized;

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/app.js
// Part 5 / 6
// ======================================================

App.prototype.start = async function () {

    await this.registerServiceWorker();

    await this.init();

};

App.prototype.restart = async function () {

    this.initialized = false;

    await this.start();

};

App.prototype.stop = function () {

    charts.destroyAll();

    sync.stop();

    events.clear();

    this.initialized = false;

};

App.prototype.status = function () {

    return {

        version: this.version,

        initialized: this.initialized,

        online: navigator.onLine,

        authenticated: auth.isAuthenticated(),

        route: router.currentRoute()

    };

};

App.prototype.emit = function (

    event,

    ...args

) {

    events.emit(

        event,

        ...args

    );

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/app.js
// Part 6 / 6
// ======================================================

App.prototype.destroy = function () {

    this.stop();

    logger.info(

        "Application destroyed"

    );

};

window.addEventListener(

    "DOMContentLoaded",

    async () => {

        await app.start();

    }

);

export default app;

export {

    app,

    App

};
