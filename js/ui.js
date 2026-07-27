// ======================================================
// MES CORE V27 Enterprise
// File: /js/ui.js
// Part 1 / 5
// ======================================================

class UI {

    constructor() {

        this.views = {};

        this.modals = {};

        this.toasts = [];

    }

    $(selector) {

        return document.querySelector(selector);

    }

    $all(selector) {

        return [...document.querySelectorAll(selector)];

    }

    registerView(name, selector) {

        this.views[name] = this.$(selector);

    }

    showView(name) {

        Object.values(this.views).forEach(view => {

            if (view) {

                view.classList.add("hidden");

            }

        });

        if (this.views[name]) {

            this.views[name].classList.remove("hidden");

        }

    }

    html(selector, html) {

        const el = this.$(selector);

        if (!el) return;

        el.innerHTML = html;

    }

    text(selector, text) {

        const el = this.$(selector);

        if (!el) return;

        el.textContent = text;

    }

    value(selector, value = null) {

        const el = this.$(selector);

        if (!el) return null;

        if (value === null) {

            return el.value;

        }

        el.value = value;

    }

    clear(selector) {

        this.value(selector, "");

    }

}

const ui = new UI();

export default ui;

export { UI };
// ======================================================
// MES CORE V27 Enterprise
// File: /js/ui.js
// Part 2 / 5
// ======================================================

UI.prototype.show = function (selector) {

    const el = this.$(selector);

    if (!el) return;

    el.classList.remove("hidden");

};

UI.prototype.hide = function (selector) {

    const el = this.$(selector);

    if (!el) return;

    el.classList.add("hidden");

};

UI.prototype.toggle = function (selector) {

    const el = this.$(selector);

    if (!el) return;

    el.classList.toggle("hidden");

};

UI.prototype.enable = function (selector) {

    const el = this.$(selector);

    if (!el) return;

    el.disabled = false;

};

UI.prototype.disable = function (selector) {

    const el = this.$(selector);

    if (!el) return;

    el.disabled = true;

};

UI.prototype.addClass = function (selector, className) {

    const el = this.$(selector);

    if (!el) return;

    el.classList.add(className);

};

UI.prototype.removeClass = function (selector, className) {

    const el = this.$(selector);

    if (!el) return;

    el.classList.remove(className);

};

UI.prototype.toggleClass = function (selector, className) {

    const el = this.$(selector);

    if (!el) return;

    el.classList.toggle(className);

};

UI.prototype.checked = function (selector, value = null) {

    const el = this.$(selector);

    if (!el) return false;

    if (value === null) {

        return el.checked;

    }

    el.checked = value;

};

UI.prototype.focus = function (selector) {

    const el = this.$(selector);

    if (!el) return;

    el.focus();

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/ui.js
// Part 3 / 5
// ======================================================

UI.prototype.on = function (selector, event, callback) {

    const el = this.$(selector);

    if (!el) return;

    el.addEventListener(event, callback);

};

UI.prototype.onAll = function (selector, event, callback) {

    this.$all(selector).forEach(el => {

        el.addEventListener(event, callback);

    });

};

UI.prototype.append = function (selector, html) {

    const el = this.$(selector);

    if (!el) return;

    el.insertAdjacentHTML("beforeend", html);

};

UI.prototype.prepend = function (selector, html) {

    const el = this.$(selector);

    if (!el) return;

    el.insertAdjacentHTML("afterbegin", html);

};

UI.prototype.empty = function (selector) {

    const el = this.$(selector);

    if (!el) return;

    el.innerHTML = "";

};

UI.prototype.remove = function (selector) {

    const el = this.$(selector);

    if (!el) return;

    el.remove();

};

UI.prototype.attr = function (selector, name, value = null) {

    const el = this.$(selector);

    if (!el) return null;

    if (value === null) {

        return el.getAttribute(name);

    }

    el.setAttribute(name, value);

};

UI.prototype.css = function (selector, property, value) {

    const el = this.$(selector);

    if (!el) return;

    el.style[property] = value;

};

UI.prototype.create = function (tag, className = "") {

    const element = document.createElement(tag);

    if (className) {

        element.className = className;

    }

    return element;

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/ui.js
// Part 4 / 5
// ======================================================

UI.prototype.loading = function (selector, state = true) {

    const el = this.$(selector);

    if (!el) return;

    if (state) {

        el.dataset.originalText = el.innerHTML;

        el.disabled = true;

        el.innerHTML = `
            <span class="spinner-border spinner-border-sm me-2"></span>
            Loading...
        `;

    } else {

        el.disabled = false;

        if (el.dataset.originalText) {

            el.innerHTML = el.dataset.originalText;

        }

    }

};

UI.prototype.toast = function (message, type = "primary") {

    const container = document.getElementById("toast-container");

    if (!container) return;

    const toast = document.createElement("div");

    toast.className = `toast align-items-center text-bg-${type} border-0 show mb-2`;

    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button
                type="button"
                class="btn-close btn-close-white me-2 m-auto"
                data-bs-dismiss="toast">
            </button>
        </div>
    `;

    container.appendChild(toast);

    this.toasts.push(toast);

    setTimeout(() => {

        toast.remove();

        this.toasts = this.toasts.filter(t => t !== toast);

    }, 3000);

};

UI.prototype.alert = function (message) {

    window.alert(message);

};

UI.prototype.confirm = function (message) {

    return window.confirm(message);

};

UI.prototype.prompt = function (message, value = "") {

    return window.prompt(message, value);

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/ui.js
// Part 5 / 5
// ======================================================

UI.prototype.modal = function (selector) {

    const element = this.$(selector);

    if (!element) return null;

    if (!this.modals[selector]) {

        this.modals[selector] = new bootstrap.Modal(element);

    }

    return this.modals[selector];

};

UI.prototype.openModal = function (selector) {

    const modal = this.modal(selector);

    if (modal) {

        modal.show();

    }

};

UI.prototype.closeModal = function (selector) {

    const modal = this.modal(selector);

    if (modal) {

        modal.hide();

    }

};

UI.prototype.loadingPage = function (state = true) {

    const loader = this.$("#page-loader");

    if (!loader) return;

    loader.classList.toggle("hidden", !state);

};

UI.prototype.scrollTop = function () {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

};

UI.prototype.scrollBottom = function () {

    window.scrollTo({

        top: document.body.scrollHeight,

        behavior: "smooth"

    });

};

UI.prototype.renderOptions = function (selector, items, valueKey = "id", textKey = "name") {

    const element = this.$(selector);

    if (!element) return;

    element.innerHTML = "";

    items.forEach(item => {

        const option = document.createElement("option");

        option.value = item[valueKey];

        option.textContent = item[textKey];

        element.appendChild(option);

    });

};

UI.prototype.destroy = function () {

    this.views = {};

    this.modals = {};

    this.toasts = [];

};

export default ui;

export {

    ui,

    UI

};
