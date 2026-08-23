// ======================================================
// MES CORE V28 Enterprise
// File: /js/quality.js
// ======================================================

import { QualityAPI, SyncAPI } from "./api.js";
import { round, percent } from "./utils.js";
import network from "./network.js";
import logger from "./logger.js";

class QualityService {
    constructor() { this.records = new Map(); }

    async load(date) {
        const data = await QualityAPI.getByDate(date);
        this.records.clear();
        data.forEach(item => this.records.set(item.id, item));
        logger.info("Quality Loaded", data.length);
        return data;
    }

    normalize(defect) {
        return {
            serial: defect.serial || "",
            date: defect.date,
            shift: Number(defect.shift),
            hour: defect.hour || "",
            model: defect.model || "",
            defect: defect.defect || "",
            station: defect.station || "",
            category: defect.category || "",
            quantity: Math.max(1, Number(defect.quantity || 1)),
            image: defect.image || "",
            remarks: defect.remarks || ""
        };
    }

    async save(defect) {
        const data = this.normalize(defect);
        if (network.isOffline()) {
            await SyncAPI.enqueue("SAVE_QUALITY", data);
            const tempId = `LOCAL_${crypto.randomUUID()}`;
            this.records.set(tempId, { id: tempId, ...data, _pendingSync: true });
            logger.sync("Quality queued offline", tempId);
            return tempId;
        }
        const id = await QualityAPI.save(data);
        this.records.set(id, { id, ...data });
        logger.success("Quality Saved", id);
        return id;
    }

    get(id) { return this.records.get(id) || null; }
    all() { return [...this.records.values()]; }

    async update(id, values) {
        const current = this.get(id);
        if (!current) throw new Error("Quality Record Not Found");
        if (String(id).startsWith("LOCAL_")) {
            const updated = { ...current, ...values };
            this.records.set(id, updated);
            return updated;
        }
        const updated = { ...current, ...values };
        if (network.isOffline()) await SyncAPI.enqueue("UPDATE_QUALITY", { id, data: updated });
        else await QualityAPI.update(id, updated);
        this.records.set(id, updated);
        return updated;
    }

    async remove(id) {
        if (String(id).startsWith("LOCAL_")) {
            this.records.delete(id);
            return;
        }
        if (network.isOffline()) await SyncAPI.enqueue("DELETE_QUALITY", { id });
        else await QualityAPI.remove(id);
        this.records.delete(id);
    }

    totalDefects() { return this.all().reduce((sum, row) => sum + Number(row.quantity || 0), 0); }
    totalRecords() { return this.records.size; }
    byModel(model) { return this.all().filter(row => row.model === model); }
    byShift(shift) { return this.all().filter(row => Number(row.shift) === Number(shift)); }
    byHour(hour) { return this.all().filter(row => row.hour === hour); }
    byStation(station) { return this.all().filter(row => row.station === station); }
    byCategory(category) { return this.all().filter(row => row.category === category); }
    byDefect(defect) { return this.all().filter(row => row.defect === defect); }

    aggregate(field) {
        const summary = {};
        this.all().forEach(row => {
            const key = row[field] || "Unspecified";
            summary[key] = (summary[key] || 0) + Number(row.quantity || 0);
        });
        return Object.entries(summary).map(([key, quantity]) => ({ [field]: key, quantity })).sort((a, b) => b.quantity - a.quantity);
    }

    defectSummary() { return this.aggregate("defect").map(x => ({ defect: x.defect, quantity: x.quantity })); }
    stationSummary() { return this.aggregate("station").map(x => ({ station: x.station, quantity: x.quantity })); }
    categorySummary() { return this.aggregate("category").map(x => ({ category: x.category, quantity: x.quantity })); }

    pareto() {
        const data = this.defectSummary(); const total = this.totalDefects(); let cumulative = 0;
        return data.map(item => {
            cumulative += item.quantity;
            return { ...item, percent: percent(item.quantity, total), cumulative: total ? round((cumulative / total) * 100) : 0 };
        });
    }

    summary() {
        return {
            records: this.totalRecords(),
            defects: this.totalDefects(),
            stations: new Set(this.all().map(x => x.station).filter(Boolean)).size,
            categories: new Set(this.all().map(x => x.category).filter(Boolean)).size,
            models: new Set(this.all().map(x => x.model).filter(Boolean)).size,
            pendingSync: this.all().filter(x => x._pendingSync).length
        };
    }

    export() { return structuredClone(this.all()); }
    clear() { this.records.clear(); }
    find(id) { return this.get(id); }
    exists(id) { return this.records.has(id); }
    images() { return this.all().filter(row => row.image).map(row => row.image); }
    withImages() { return this.all().filter(row => row.image); }
    withoutImages() { return this.all().filter(row => !row.image); }
    search(text = "") { const keyword = String(text).toLowerCase(); return this.all().filter(row => Object.values(row).join(" ").toLowerCase().includes(keyword)); }

    statistics() {
        const defects = this.totalDefects(); const records = this.totalRecords();
        return { totalRecords: records, totalDefects: defects, averageDefects: records ? round(defects / records) : 0, pareto: this.pareto(), topDefect: this.defectSummary()[0] || null, topStation: this.stationSummary()[0] || null, topCategory: this.categorySummary()[0] || null };
    }

    async reload(date) { this.clear(); return this.load(date); }
    toJSON() { return JSON.stringify(this.all(), null, 2); }
    async fromJSON(json) { for (const item of JSON.parse(json)) await this.save(item); }
}

const quality = new QualityService();
export default quality;
export { quality, QualityService };
