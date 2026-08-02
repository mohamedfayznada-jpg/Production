// ======================================================
// MES CORE V27 Enterprise
// File: /js/permissions.js
// Part 1 / 4
// ======================================================

import auth from "./auth.js";

class PermissionManager {

    constructor() {

        this.permissions = {};

    }

    define(role, permissions = []) {

        this.permissions[role] = permissions;

    }

    role() {

        const user = auth.cachedUser();

        return user?.role || "guest";

    }

    can(permission) {

        const role = this.role();

        return (

            this.permissions[role] || []

        ).includes(permission);

    }

    cannot(permission) {

        return !this.can(permission);

    }

}

const permissions = new PermissionManager();


// ======================================================
// MES CORE V27 Enterprise
// File: /js/permissions.js
// Part 2 / 4
// ======================================================

PermissionManager.prototype.any = function (

    permissions

) {

    return permissions.some(

        permission => this.can(permission)

    );

};

PermissionManager.prototype.all = function (

    permissions

) {

    return permissions.every(

        permission => this.can(permission)

    );

};

PermissionManager.prototype.grant = function (

    role,

    permission

) {

    if (!this.permissions[role]) {

        this.permissions[role] = [];

    }

    if (!this.permissions[role].includes(permission)) {

        this.permissions[role].push(permission);

    }

};

PermissionManager.prototype.revoke = function (

    role,

    permission

) {

    if (!this.permissions[role]) return;

    this.permissions[role] =

        this.permissions[role].filter(

            p => p !== permission

        );

};

PermissionManager.prototype.list = function (

    role = null

) {

    if (role) {

        return this.permissions[role] || [];

    }

    return this.permissions;

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/permissions.js
// Part 3 / 4
// ======================================================

PermissionManager.prototype.hasRole = function (

    role

) {

    return this.role() === role;

};

PermissionManager.prototype.isAdmin = function () {

    return this.hasRole("admin");

};

PermissionManager.prototype.isManager = function () {

    return this.hasRole("manager");

};

PermissionManager.prototype.isSupervisor = function () {

    return this.hasRole("supervisor");

};

PermissionManager.prototype.isOperator = function () {

    return this.hasRole("operator");

};

PermissionManager.prototype.isGuest = function () {

    return this.hasRole("guest");

};

PermissionManager.prototype.roles = function () {

    return Object.keys(

        this.permissions

    );

};

PermissionManager.prototype.exists = function (

    role

) {

    return Object.prototype.hasOwnProperty.call(

        this.permissions,

        role

    );

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/permissions.js
// Part 4 / 4
// ======================================================

PermissionManager.prototype.clear = function () {

    this.permissions = {};

};

PermissionManager.prototype.export = function () {

    return structuredClone(

        this.permissions

    );

};

PermissionManager.prototype.import = function (

    permissions

) {

    this.permissions =

        structuredClone(

            permissions || {}

        );

};

PermissionManager.prototype.destroy = function () {

    this.clear();

};

export default permissions;

export {

    permissions,

    PermissionManager

};
