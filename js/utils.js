// ======================================================
// MES CORE V27 Enterprise
// File: /js/utils.js
// ======================================================

import { SHIFTS } from "./config.js";

export function uuid() {
    return crypto.randomUUID();
}

export function now() {
    return new Date();
}

export function today() {
    return new Date().toISOString().split("T")[0];
}

export function timeNow() {
    return new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

export function timestamp() {
    return Date.now();
}

export function clone(value) {
    return structuredClone(value);
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function isEmpty(value) {

    if (value === null) return true;

    if (value === undefined) return true;

    if (value === "") return true;

    if (Array.isArray(value) && value.length === 0) return true;

    if (typeof value === "object" &&
        Object.keys(value).length === 0)
        return true;

    return false;
}

export function number(value) {

    const n = Number(value);

    return Number.isNaN(n) ? 0 : n;

}

export function round(value, digits = 2) {

    return Number(number(value).toFixed(digits));

}

export function percent(value, total) {

    if (total === 0) return 0;

    return round((value / total) * 100);

}

export function formatDate(date) {

    return new Date(date).toLocaleDateString("en-GB");

}

export function formatDateTime(date) {

    return new Date(date).toLocaleString("en-GB");

}

export function shiftHours(shift) {

    return shift === 1
        ? SHIFTS.SHIFT_1.hours
        : SHIFTS.SHIFT_2.hours;

}

export function documentId(date, shift, hour) {

    return `${date}_${shift}_${hour}`;

}

export function productionId(model, date, shift, hour) {

    return `${model}_${date}_${shift}_${hour}`;

}

export function qualityId(serial) {

    return `Q_${serial}_${timestamp()}`;

}

export function backupId() {

    return `BACKUP_${today()}_${timestamp()}`;

}
