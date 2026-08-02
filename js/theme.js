// ======================================================
// MES CORE V27 Enterprise
// File: /js/theme.js
// Part 1 / 4
// ======================================================

import storage from "./storage.js";

class ThemeManager {

    constructor() {

        this.theme = storage.get("theme") || "light";

    }

    init() {

        this.apply(this.theme);

    }

    apply(theme) {

        this.theme = theme;

        document.documentElement.setAttribute(

            "data-theme",

            theme

        );

        storage.set("theme", theme);

    }

    light() {

        this.apply("light");

    }

    dark() {

        this.apply("dark");

    }

    toggle() {

        this.apply(

            this.theme === "light"

                ? "dark"

                : "light"

        );

    }

}

const theme = new ThemeManager();


// ======================================================
// MES CORE V27 Enterprise
// File: /js/theme.js
// Part 2 / 4
// ======================================================

ThemeManager.prototype.current = function () {

    return this.theme;

};

ThemeManager.prototype.isDark = function () {

    return this.theme === "dark";

};

ThemeManager.prototype.isLight = function () {

    return this.theme === "light";

};

ThemeManager.prototype.setPrimaryColor = function (color) {

    document.documentElement.style.setProperty(

        "--primary",

        color

    );

    storage.set("primary-color", color);

};

ThemeManager.prototype.loadPrimaryColor = function () {

    const color = storage.get("primary-color");

    if (!color) return;

    document.documentElement.style.setProperty(

        "--primary",

        color

    );

};

ThemeManager.prototype.setAccentColor = function (color) {

    document.documentElement.style.setProperty(

        "--accent",

        color

    );

    storage.set("accent-color", color);

};

ThemeManager.prototype.loadAccentColor = function () {

    const color = storage.get("accent-color");

    if (!color) return;

    document.documentElement.style.setProperty(

        "--accent",

        color

    );

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/theme.js
// Part 3 / 4
// ======================================================

ThemeManager.prototype.setFontSize = function (size) {

    document.documentElement.style.setProperty(

        "--font-size",

        size

    );

    storage.set("font-size", size);

};

ThemeManager.prototype.loadFontSize = function () {

    const size = storage.get("font-size");

    if (!size) return;

    document.documentElement.style.setProperty(

        "--font-size",

        size

    );

};

ThemeManager.prototype.setBorderRadius = function (radius) {

    document.documentElement.style.setProperty(

        "--border-radius",

        radius

    );

    storage.set("border-radius", radius);

};

ThemeManager.prototype.loadBorderRadius = function () {

    const radius = storage.get("border-radius");

    if (!radius) return;

    document.documentElement.style.setProperty(

        "--border-radius",

        radius

    );

};

ThemeManager.prototype.reset = function () {

    storage.remove("primary-color");

    storage.remove("accent-color");

    storage.remove("font-size");

    storage.remove("border-radius");

    this.apply("light");

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/theme.js
// Part 4 / 4
// ======================================================

ThemeManager.prototype.load = function () {

    this.init();

    this.loadPrimaryColor();

    this.loadAccentColor();

    this.loadFontSize();

    this.loadBorderRadius();

};

ThemeManager.prototype.export = function () {

    return {

        theme: this.theme,

        primary: storage.get("primary-color"),

        accent: storage.get("accent-color"),

        fontSize: storage.get("font-size"),

        borderRadius: storage.get("border-radius")

    };

};

ThemeManager.prototype.import = function (settings = {}) {

    if (settings.theme) {

        this.apply(settings.theme);

    }

    if (settings.primary) {

        this.setPrimaryColor(settings.primary);

    }

    if (settings.accent) {

        this.setAccentColor(settings.accent);

    }

    if (settings.fontSize) {

        this.setFontSize(settings.fontSize);

    }

    if (settings.borderRadius) {

        this.setBorderRadius(settings.borderRadius);

    }

};

ThemeManager.prototype.destroy = function () {

    this.theme = "light";

};

export default theme;

export {

    theme,

    ThemeManager

};
