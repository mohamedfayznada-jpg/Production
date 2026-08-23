// ======================================================
// MES CORE V28 Enterprise
// File: /js/utils.js
// ======================================================

import { SHIFTS } from "./config.js";

export function uuid() { return crypto.randomUUID(); }
export function now() { return new Date(); }

export function today() {
    const date = new Date();
    const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Cairo", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
    const values = Object.fromEntries(parts.map(x => [x.type, x.value]));
    return `${values.year}-${values.month}-${values.day}`;
}

export function timeNow() {
    return new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Cairo", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
}

export function timestamp() { return Date.now(); }
export function clone(value) { return structuredClone(value); }
export function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

export function isEmpty(value) {
    if (value === null || value === undefined || value === "") return true;
    if (Array.isArray(value) && value.length === 0) return true;
    return typeof value === "object" && Object.keys(value).length === 0;
}

export function number(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
}

export function round(value, digits = 2) { return Number(number(value).toFixed(digits)); }
export function percent(value, total) { return number(total) === 0 ? 0 : round((number(value) / number(total)) * 100); }
export function formatDate(date) { return new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Cairo" }).format(new Date(date)); }
export function formatDateTime(date) { return new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Cairo", dateStyle: "short", timeStyle: "medium" }).format(new Date(date)); }
export function shiftHours(shift) { return Number(shift) === 1 ? SHIFTS.SHIFT_1.hours : SHIFTS.SHIFT_2.hours; }
export function documentId(date, shift, hour) { return `${date}_${Number(shift)}_${hour}`; }
export function productionId(model, date, shift, hour) { return `${model}_${date}_${Number(shift)}_${hour}`; }
export function qualityId(serial) { return `Q_${serial || "NO_SERIAL"}_${timestamp()}_${crypto.randomUUID().slice(0, 8)}`; }
export function backupId() { return `BACKUP_${today()}_${timestamp()}`; }
