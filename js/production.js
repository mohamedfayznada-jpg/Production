// ======================================================
// MES CORE V28 Enterprise
// File: /js/production.js
// ======================================================

import { ProductionAPI, SyncAPI } from "./api.js";
import { documentId, today, percent, round } from "./utils.js";
import network from "./network.js";
import logger from "./logger.js";

class ProductionService {
    constructor() { this.records = new Map(); }
    key(date, shift, hour) { return documentId(date, shift, hour); }
    async loadDay(date = today()) {
        const data = await ProductionAPI.getDay(date);
        this.records.clear();
        data.forEach(item => this.records.set(item.id, item));
        logger.info("Production Loaded", data.length);
        return data;
    }
    get(date, shift, hour) { return this.records.get(this.key(date, shift, hour)) || null; }
    all() { return [...this.records.values()]; }
    normalize(record) {
        return { id: this.key(record.date, record.shift, record.hour), date: record.date, shift: Number(record.shift), hour: record.hour, model: record.model || "", plan: Number(record.plan || 0), actual: Number(record.actual || 0), defects: Number(record.defects || 0), operators: Number(record.operators || 0), remarks: record.remarks || "" };
    }
    async save(record) {
        const data = this.normalize(record);
        if (network.isOffline()) {
            await SyncAPI.enqueue("SAVE_PRODUCTION", data);
            this.records.set(data.id, data);
            logger.sync("Production queued offline", data.id);
            return data;
        }
        await ProductionAPI.save(data);
        this.records.set(data.id, data);
        logger.success("Production Saved", data.id);
        return data;
    }
    async update(date, shift, hour, values) {
        const current = this.get(date, shift, hour);
        if (!current) throw new Error("Production Record Not Found");
        return this.save({ ...current, ...values, date, shift, hour });
    }
    async remove(date, shift, hour) {
        const id = this.key(date, shift, hour);
        const offline = network.isOffline();
        if (offline) await SyncAPI.enqueue("DELETE_PRODUCTION", { date, shift, hour });
        else await ProductionAPI.delete(date, shift, hour);
        this.records.delete(id);
        logger.warning(offline ? "Production Delete Queued" : "Production Deleted", id);
    }
    totalPlan() { return this.all().reduce((sum, row) => sum + Number(row.plan || 0), 0); }
    totalActual() { return this.all().reduce((sum, row) => sum + Number(row.actual || 0), 0); }
    totalDefects() { return this.all().reduce((sum, row) => sum + Number(row.defects || 0), 0); }
    totalOperators() { return this.all().reduce((sum, row) => sum + Number(row.operators || 0), 0); }
    achievement() { return percent(this.totalActual(), this.totalPlan()); }
    yield() { const actual = this.totalActual(); return actual === 0 ? 0 : round(((actual - this.totalDefects()) / actual) * 100); }
    fpy() { return this.yield(); }
    hourly() { return this.all().sort((a, b) => String(a.hour).localeCompare(String(b.hour))); }
    summary() { return { plan: this.totalPlan(), actual: this.totalActual(), defects: this.totalDefects(), operators: this.totalOperators(), achievement: this.achievement(), yield: this.yield(), fpy: this.fpy() }; }
    models() { return [...new Set(this.all().map(x => x.model).filter(Boolean))]; }
    byModel(model) { return this.all().filter(x => x.model === model); }
    modelSummary(model) {
        const rows = this.byModel(model);
        const plan = rows.reduce((s, r) => s + Number(r.plan || 0), 0);
        const actual = rows.reduce((s, r) => s + Number(r.actual || 0), 0);
        const defects = rows.reduce((s, r) => s + Number(r.defects || 0), 0);
        return { model, plan, actual, defects, achievement: percent(actual, plan), yield: actual === 0 ? 0 : round(((actual - defects) / actual) * 100) };
    }
    shiftSummary(shift) {
        const rows = this.all().filter(row => Number(row.shift) === Number(shift));
        const plan = rows.reduce((s, r) => s + Number(r.plan || 0), 0);
        const actual = rows.reduce((s, r) => s + Number(r.actual || 0), 0);
        const defects = rows.reduce((s, r) => s + Number(r.defects || 0), 0);
        const operators = rows.reduce((s, r) => s + Number(r.operators || 0), 0);
        return { shift: Number(shift), plan, actual, defects, operators, achievement: percent(actual, plan), yield: actual === 0 ? 0 : round(((actual - defects) / actual) * 100) };
    }
    find(id) { return this.records.get(id) || null; }
    exists(date, shift, hour) { return this.records.has(this.key(date, shift, hour)); }
    clear() { this.records.clear(); }
    export() { return structuredClone(this.all()); }
    async import(records = []) { for (const record of records) await this.save(record); return true; }
    async refresh(date) { return this.loadDay(date); }
    statistics() {
        const rows = this.all(); const plan = this.totalPlan(); const actual = this.totalActual(); const defects = this.totalDefects(); const hours = rows.length;
        return { totalHours: hours, totalPlan: plan, totalActual: actual, totalDefects: defects, averagePlan: hours ? round(plan / hours) : 0, averageActual: hours ? round(actual / hours) : 0, averageDefects: hours ? round(defects / hours) : 0, achievement: percent(actual, plan), yield: actual ? round(((actual - defects) / actual) * 100) : 0 };
    }
    reset() { this.records.clear(); }
    async reload(date = today()) { this.reset(); return this.loadDay(date); }
    toJSON() { return JSON.stringify(this.all(), null, 2); }
    async fromJSON(json) { return this.import(JSON.parse(json)); }
}

const production = new ProductionService();
export default production;
export { production, ProductionService };
