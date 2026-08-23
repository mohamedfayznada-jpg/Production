// ======================================================
// MES CORE V28 Enterprise - TPM Service
// ======================================================

import { TPMAPI, SyncAPI } from "./api.js";
import { today, uuid } from "./utils.js";
import network from "./network.js";

class TPMService {
    constructor() { this.records = new Map(); }
    normalize(item) { return { id: item.id || `TPM_${uuid()}`, date: item.date || today(), pillar: item.pillar || "Autonomous Maintenance", area: item.area || "", activity: item.activity || "", owner: item.owner || "", status: item.status || "Open", priority: item.priority || "Medium", dueDate: item.dueDate || "", evidence: item.evidence || "", notes: item.notes || "" }; }
    async load(date = today()) { const data = await TPMAPI.getByDate(date); this.records = new Map(data.map(x => [x.id, x])); return data; }
    async save(item) { const data = this.normalize(item); if (network.isOffline()) { await SyncAPI.enqueue("SAVE_TPM", data); this.records.set(data.id, { ...data, _pendingSync: true }); return data; } await TPMAPI.save(data); this.records.set(data.id, data); return data; }
    async remove(id) { if (network.isOffline()) await SyncAPI.enqueue("DELETE_TPM", { id }); else await TPMAPI.remove(id); this.records.delete(id); }
    all() { return [...this.records.values()]; }
    byPillar(pillar) { return this.all().filter(x => x.pillar === pillar); }
    byStatus(status) { return this.all().filter(x => x.status === status); }
    summary() { const all = this.all(); return { records: all.length, open: all.filter(x => x.status === "Open").length, inProgress: all.filter(x => x.status === "In Progress").length, closed: all.filter(x => x.status === "Closed").length, overdue: all.filter(x => x.dueDate && x.dueDate < today() && x.status !== "Closed").length, pillars: new Set(all.map(x => x.pillar)).size }; }
    clear() { this.records.clear(); }
}

const tpm = new TPMService();
export default tpm;
export { tpm, TPMService };
