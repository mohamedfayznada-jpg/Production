// ======================================================
// MES CORE V28 Enterprise
// File: /js/permissions.js
// ======================================================

import auth from "./auth.js";

class PermissionManager {
    constructor() { this.permissions = {}; }
    define(role, permissions = []) { this.permissions[role] = [...new Set(permissions)]; }
    role() { return auth.role(); }
    can(permission) {
        const granted = this.permissions[this.role()] || [];
        return granted.includes("*") || granted.includes(permission);
    }
    cannot(permission) { return !this.can(permission); }
    any(items = []) { return items.some(permission => this.can(permission)); }
    all(items = []) { return items.every(permission => this.can(permission)); }
    grant(role, permission) {
        if (!this.permissions[role]) this.permissions[role] = [];
        if (!this.permissions[role].includes(permission)) this.permissions[role].push(permission);
    }
    revoke(role, permission) {
        if (!this.permissions[role]) return;
        this.permissions[role] = this.permissions[role].filter(p => p !== permission);
    }
    list(role = null) { return role ? [...(this.permissions[role] || [])] : structuredClone(this.permissions); }
    hasRole(role) { return this.role() === role; }
    isAdmin() { return this.hasRole("admin"); }
    isManager() { return this.hasRole("manager") || this.hasRole("production_manager"); }
    isSupervisor() { return this.hasRole("supervisor"); }
    isOperator() { return this.hasRole("operator"); }
    isGuest() { return this.hasRole("guest"); }
    roles() { return Object.keys(this.permissions); }
    exists(role) { return Object.prototype.hasOwnProperty.call(this.permissions, role); }
    clear() { this.permissions = {}; }
    export() { return structuredClone(this.permissions); }
    import(value) { this.permissions = structuredClone(value || {}); }
    destroy() { this.clear(); }
}

const permissions = new PermissionManager();
export default permissions;
export { permissions, PermissionManager };
