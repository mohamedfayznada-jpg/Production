// ======================================================
// MES CORE V28 Enterprise - Waste Service
// ======================================================

import { SyncAPI } from "./api.js";
import { today, round, uuid } from "./utils.js";
import network from "./network.js";

class WasteService {
    constructor() { this.records = new Map(); }
    normalize(item) {
        const quantity = Math.max(0, Number(item.quantity || 0));
        const unitCost = Math.max(0, Number(item.unitCost || 0));
        return { id: item.id || `W_${uuid()}`, date: item.date || today(), shift: Number(item.shift || 1), hour: item.hour || "", model: item.model || "", category: item.category || "Other", material: item.material || "", quantity, unitCost, totalCost: round(quantity * unitCost, 2), reason: item.reason || "", remarks: item.remarks || "" };
    }
    async load(date = today()) { const data = await this.api().getByDate(date); this.records = new Map(data.map(x => [x.id, x])); return data; }
    async save(item) { const data = this.normalize(item); if (network.isOffline()) { await SyncAPI.enqueue("SAVE_WASTE", data); this.records.set(data.id, { ...data, _pendingSync: true }); return data; } await this.api().save(data); this.records.set(data.id, data); return data; }
    async remove(id) { if (network.isOffline()) await SyncAPI.enqueue("DELETE_WASTE", { id }); else await this.api().remove(id); this.records.delete(id); }
    all() { return [...this.records.values()]; }
    totalQuantity() { return this.all().reduce((s, x) => s + Number(x.quantity || 0), 0); }
    totalCost() { return round(this.all().reduce((s, x) => s + Number(x.totalCost || 0), 0), 2); }
    byCategory() { const m = {}; this.all().forEach(x => { m[x.category] = (m[x.category] || 0) + Number(x.quantity || 0); }); return Object.entries(m).map(([category, quantity]) => ({ category, quantity })).sort((a,b) => b.quantity-a.quantity); }
    byReason() { const m = {}; this.all().forEach(x => { m[x.reason || "Unspecified"] = (m[x.reason || "Unspecified"] || 0) + Number(x.quantity || 0); }); return Object.entries(m).map(([reason, quantity]) => ({ reason, quantity })).sort((a,b) => b.quantity-a.quantity); }
    summary() { return { records: this.all().length, quantity: this.totalQuantity(), cost: this.totalCost(), topCategory: this.byCategory()[0] || null, topReason: this.byReason()[0] || null }; }
    api() { return WasteService.api; }
}

WasteService.api = null;
const waste = new WasteService();
export default waste;
export { waste, WasteService };
