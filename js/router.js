// ======================================================
// MES CORE V27 Enterprise
// File: /js/router.js
// Part 1 / 4
// ======================================================

import ui from "./ui.js";
import logger from "./logger.js";

class Router {

    constructor() {

        this.routes = {};

        this.current = "";

        window.addEventListener("hashchange", () => {

            this.resolve();

        });

    }

    add(path, callback) {

        this.routes[path] = callback;

        return this;

    }

    start(defaultRoute = "/") {

        if (!location.hash) {

            location.hash = defaultRoute;

        }

        this.resolve();

    }

    navigate(path) {

        location.hash = path;

    }

    resolve() {

        const route = location.hash.replace("#", "") || "/";

        this.current = route;

        if (this.routes[route]) {

            this.routes[route]();

            logger.info(`Route: ${route}`);

        } else {

            this.notFound();

        }

    }

    currentRoute() {

        return this.current;

    }

}

const router = new Router();

export default router;

export { Router };
// ======================================================
// MES CORE V27 Enterprise
// File: /js/router.js
// Part 2 / 4
// ======================================================

Router.prototype.back = function () {

    history.back();

};

Router.prototype.forward = function () {

    history.forward();

};

Router.prototype.reload = function () {

    this.resolve();

};

Router.prototype.exists = function (path) {

    return Object.prototype.hasOwnProperty.call(

        this.routes,

        path

    );

};

Router.prototype.remove = function (path) {

    delete this.routes[path];

};

Router.prototype.clear = function () {

    this.routes = {};

};

Router.prototype.redirect = function (from, to) {

    this.add(from, () => {

        this.navigate(to);

    });

};

Router.prototype.notFound = function () {

    logger.warning("Route not found");

    ui.html(

        "#app",

        `
        <div class="container py-5 text-center">
            <h1 class="display-5">404</h1>
            <p class="lead">Page Not Found</p>
        </div>
        `
    );

};

Router.prototype.list = function () {

    return Object.keys(this.routes);

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/router.js
// Part 3 / 4
// ======================================================

Router.prototype.beforeEach = function (callback) {

    this.beforeHook = callback;

};

Router.prototype.afterEach = function (callback) {

    this.afterHook = callback;

};

Router.prototype.resolve = function () {

    const route = location.hash.replace("#", "") || "/";

    const previous = this.current;

    if (this.beforeHook) {

        const result = this.beforeHook(route, previous);

        if (result === false) {

            return;

        }

    }

    this.current = route;

    if (this.routes[route]) {

        this.routes[route]();

        logger.info(`Route: ${route}`);

    } else {

        this.notFound();

    }

    if (this.afterHook) {

        this.afterHook(route, previous);

    }

};

Router.prototype.params = function () {

    const hash = location.hash.replace("#", "");

    const parts = hash.split("?");

    if (parts.length < 2) {

        return {};

    }

    return Object.fromEntries(

        new URLSearchParams(parts[1])

    );

};

Router.prototype.path = function () {

    return location.hash

        .replace("#", "")

        .split("?")[0];

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/router.js
// Part 4 / 4
// ======================================================

Router.prototype.query = function (key = null) {

    const params = this.params();

    if (key === null) {

        return params;

    }

    return params[key] ?? null;

};

Router.prototype.replace = function (path) {

    history.replaceState(

        null,

        "",

        `#${path}`

    );

    this.resolve();

};

Router.prototype.refresh = function () {

    this.resolve();

};

Router.prototype.destroy = function () {

    this.routes = {};

    this.beforeHook = null;

    this.afterHook = null;

    this.current = "";

};

export default router;

export {

    router,

    Router

};
