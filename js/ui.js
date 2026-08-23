// ======================================================
// MES CORE V28 Enterprise - UI
// ======================================================

class UI {
    constructor() { this.views = {}; this.modals = {}; this.toasts = []; }
    $(selector) { return document.querySelector(selector); }
    $all(selector) { return [...document.querySelectorAll(selector)]; }
    registerView(name, selector) { this.views[name] = this.$(selector); }
    resolveView(name) { if (this.views[name]) return this.views[name]; const selectors = [`#${name}`, `#${name}-view`, `#${name}-screen`, `[data-view="${name}"]`]; const element = selectors.map(selector => this.$(selector)).find(Boolean) || null; if (element) this.views[name] = element; return element; }
    showView(name) { Object.values(this.views).forEach(view => { view?.classList.add("hidden"); view?.classList.add("d-none"); }); const view = this.resolveView(name); if (view) { view.classList.remove("hidden"); view.classList.remove("d-none"); } }
    html(selector, html) { const el = this.$(selector); if (el) el.innerHTML = html; }
    text(selector, text) { const el = this.$(selector); if (el) el.textContent = text; }
    value(selector, value = null) { const el = this.$(selector); if (!el) return null; if (value === null) return el.value; el.value = value; }
    clear(selector) { this.value(selector, ""); }
    show(selector) { const el = this.$(selector); if (el) { el.classList.remove("hidden"); el.classList.remove("d-none"); } }
    hide(selector) { const el = this.$(selector); if (el) { el.classList.add("hidden"); el.classList.add("d-none"); } }
    toggle(selector) { const el = this.$(selector); if (el) { el.classList.toggle("hidden"); el.classList.toggle("d-none"); } }
    enable(selector) { const el = this.$(selector); if (el) el.disabled = false; }
    disable(selector) { const el = this.$(selector); if (el) el.disabled = true; }
    addClass(selector, className) { this.$(selector)?.classList.add(className); }
    removeClass(selector, className) { this.$(selector)?.classList.remove(className); }
    toggleClass(selector, className) { this.$(selector)?.classList.toggle(className); }
    checked(selector, value = null) { const el = this.$(selector); if (!el) return false; if (value === null) return el.checked; el.checked = value; }
    focus(selector) { this.$(selector)?.focus(); }
    on(selector, event, callback) { this.$(selector)?.addEventListener(event, callback); }
    onAll(selector, event, callback) { this.$all(selector).forEach(el => el.addEventListener(event, callback)); }
    append(selector, html) { this.$(selector)?.insertAdjacentHTML("beforeend", html); }
    prepend(selector, html) { this.$(selector)?.insertAdjacentHTML("afterbegin", html); }
    empty(selector) { const el = this.$(selector); if (el) el.innerHTML = ""; }
    remove(selector) { this.$(selector)?.remove(); }
    attr(selector, name, value = null) { const el = this.$(selector); if (!el) return null; if (value === null) return el.getAttribute(name); el.setAttribute(name, value); }
    css(selector, property, value) { const el = this.$(selector); if (el) el.style[property] = value; }
    create(tag, className = "") { const element = document.createElement(tag); if (className) element.className = className; return element; }
    loading(selector, state = true) { const el = this.$(selector); if (!el) return; if (state) { el.dataset.originalText = el.innerHTML; el.disabled = true; el.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Loading...`; } else { el.disabled = false; if (el.dataset.originalText) el.innerHTML = el.dataset.originalText; } }
    toast(message, type = "primary") { const container = document.getElementById("toast-container"); if (!container) return; const toast = document.createElement("div"); toast.className = `toast align-items-center text-bg-${type} border-0 show mb-2`; toast.innerHTML = `<div class="d-flex"><div class="toast-body"></div><button type="button" class="btn-close btn-close-white me-2 m-auto"></button></div>`; toast.querySelector(".toast-body").textContent = message; toast.querySelector("button").addEventListener("click", () => toast.remove()); container.appendChild(toast); this.toasts.push(toast); setTimeout(() => { toast.remove(); this.toasts = this.toasts.filter(t => t !== toast); }, 3000); }
    alert(message) { window.alert(message); }
    confirm(message) { return window.confirm(message); }
    prompt(message, value = "") { return window.prompt(message, value); }
    modal(selector) { const element = this.$(selector); if (!element || typeof bootstrap === "undefined") return null; if (!this.modals[selector]) this.modals[selector] = new bootstrap.Modal(element); return this.modals[selector]; }
    openModal(selector) { this.modal(selector)?.show(); }
    closeModal(selector) { this.modal(selector)?.hide(); }
    loadingPage(state = true) { this.$("#page-loader")?.classList.toggle("hidden", !state); }
    scrollTop() { window.scrollTo({ top: 0, behavior: "smooth" }); }
    scrollBottom() { window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }); }
    renderOptions(selector, items, valueKey = "id", textKey = "name") { const element = this.$(selector); if (!element) return; element.innerHTML = ""; items.forEach(item => { const option = document.createElement("option"); option.value = item[valueKey]; option.textContent = item[textKey]; element.appendChild(option); }); }
    destroy() { this.views = {}; this.modals = {}; this.toasts = []; }
}

const ui = new UI();
export default ui;
export { ui, UI };
