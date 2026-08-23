// ======================================================
// MES CORE V28 Enterprise - Application Shell
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
    constructor() { this.version = "28.0.0"; this.initialized = false; }
    async init() {
        if (this.initialized) return;
        logger.info("Initializing MES CORE V28...");
        theme.load();
        await auth.waitForAuth();
        this.registerPermissions();
        this.registerRoutes();
        this.registerEvents();
        router.beforeEach(route => {
            if (!auth.isAuthenticated() && route !== "/login") { router.replace("/login"); return false; }
            if (auth.isAuthenticated() && route === "/login") { router.replace("/dashboard"); return false; }
            return true;
        });
        await sync.start();
        if (auth.isAuthenticated()) await notifications.request();
        router.start(auth.isAuthenticated() ? "/dashboard" : "/login");
        this.initialized = true;
        logger.success("MES CORE V28 Ready");
    }
    registerRoutes() {
        router.add("/login", () => ui.showView("login"))
            .add("/dashboard", () => ui.showView("dashboard"))
            .add("/production", () => ui.showView("production"))
            .add("/quality", () => ui.showView("quality"))
            .add("/waste", () => ui.showView("waste"))
            .add("/tpm", () => ui.showView("tpm"))
            .add("/reports", () => ui.showView("reports"))
            .add("/settings", () => ui.showView("settings"))
            .add("/users", () => ui.showView("users"));
    }
    registerPermissions() {
        permissions.define("admin", ["*"]);
        permissions.define("production_manager", ["dashboard", "production", "quality", "waste", "tpm", "reports", "settings", "users"]);
        permissions.define("engineer", ["dashboard", "production", "quality", "waste", "tpm", "reports"]);
        permissions.define("supervisor", ["dashboard", "production", "quality", "waste", "tpm"]);
        permissions.define("operator", ["production", "quality", "waste"]);
        permissions.define("viewer", ["dashboard", "reports"]);
    }
    registerEvents() {
        events.on("theme:toggle", () => theme.toggle());
        events.on("sync:start", () => sync.start());
        events.on("sync:stop", () => sync.stop());
        events.on("notify", message => notifications.info(message));
        events.on("dashboard:refresh", () => analytics.dashboard());
        events.on("charts:destroy", () => charts.destroyAll());
        events.on("logout", async () => { await auth.logout(); router.navigate("/login"); });
    }
    async refresh() { await sync.start(); events.emit("dashboard:refresh"); }
    async registerServiceWorker() { if (!("serviceWorker" in navigator)) return; try { await navigator.serviceWorker.register("/js/sw.js"); logger.success("Service Worker Registered"); } catch (error) { logger.error("Service Worker Error", error.message); } }
    versionInfo() { return { version: this.version, initialized: this.initialized, online: navigator.onLine, userAgent: navigator.userAgent }; }
    isReady() { return this.initialized; }
    async start() { await this.registerServiceWorker(); await this.init(); }
    async restart() { this.initialized = false; await this.start(); }
    stop() { charts.destroyAll(); sync.stop(); events.clear(); this.initialized = false; }
    status() { return { version: this.version, initialized: this.initialized, online: navigator.onLine, authenticated: auth.isAuthenticated(), role: auth.role(), route: router.currentRoute() }; }
    emit(event, ...args) { events.emit(event, ...args); }
    destroy() { this.stop(); logger.info("Application destroyed"); }
}

const app = new App();
window.addEventListener("DOMContentLoaded", async () => { await app.start(); });
export default app;
export { app, App };
