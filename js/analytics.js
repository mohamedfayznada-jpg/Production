// ======================================================
// MES CORE V28 Enterprise - Analytics
// ======================================================

import production from "./production.js";
import quality from "./quality.js";
import waste from "./waste.js";
import tpm from "./tpm.js";
import { round } from "./utils.js";

class AnalyticsService {
    dashboard() {
        const p = production.summary(); const q = quality.summary(); const w = waste.summary(); const t = tpm.summary();
        const actual = p.actual; const defects = q.defects;
        const yieldValue = actual ? round(((actual - defects) / actual) * 100) : 0;
        return { plan: p.plan, actual, defects, operators: p.operators, achievement: p.achievement, yield: yieldValue, fpy: yieldValue, wasteQuantity: w.quantity, wasteCost: w.cost, tpmOpen: t.open, tpmOverdue: t.overdue };
    }
    hourly() { return production.hourly(); }
    models() { return production.models().map(model => production.modelSummary(model)); }
    pareto() { return quality.pareto(); }
    stations() { return quality.stationSummary(); }
    categories() { return quality.categorySummary(); }
    shift(shift) { return production.shiftSummary(shift); }
    statistics() { return { production: production.statistics(), quality: quality.statistics(), waste: waste.summary(), tpm: tpm.summary() }; }

    productionTrend() { return production.hourly().map(row => ({ hour: row.hour, plan: row.plan, actual: row.actual, defects: row.defects, achievement: row.plan ? round((row.actual / row.plan) * 100) : 0 })); }
    modelTrend() { return production.models().map(model => { const rows = production.byModel(model); return { model, hours: rows.length, plan: rows.reduce((s,r)=>s+Number(r.plan||0),0), actual: rows.reduce((s,r)=>s+Number(r.actual||0),0), defects: rows.reduce((s,r)=>s+Number(r.defects||0),0) }; }); }
    topDefects(limit=10) { return quality.defectSummary().slice(0, limit); }
    topStations(limit=10) { return quality.stationSummary().slice(0, limit); }
    topCategories(limit=10) { return quality.categorySummary().slice(0, limit); }

    kpis() {
        const p = production.statistics(); const q = quality.statistics(); const w = waste.summary(); const t = tpm.summary();
        return { plan: p.totalPlan, actual: p.totalActual, defects: q.totalDefects, achievement: p.achievement, yield: this.dashboard().yield, averagePlan: p.averagePlan, averageActual: p.averageActual, averageDefects: p.averageDefects, qualityRecords: q.totalRecords, wasteQuantity: w.quantity, wasteCost: w.cost, tpmOpen: t.open, tpmOverdue: t.overdue };
    }
    chartProduction() { return production.hourly().map(row => ({ label: row.hour, value: row.actual })); }
    chartPlan() { return production.hourly().map(row => ({ label: row.hour, value: row.plan })); }
    chartDefects() { return quality.all().reduce((m,row)=>{ const key=row.hour||""; m[key]=(m[key]||0)+Number(row.quantity||0); return m; },{}); }
    chartYield() { return production.hourly().map(row => ({ label: row.hour, value: row.actual ? round(((row.actual - row.defects) / row.actual) * 100) : 0 })); }
    chartOperators() { return production.hourly().map(row => ({ label: row.hour, value: row.operators })); }
    exportDashboard() { return { generatedAt: new Date().toISOString(), dashboard: this.dashboard(), kpis: this.kpis(), production: this.chartProduction(), plan: this.chartPlan(), defects: this.chartDefects(), yield: this.chartYield(), operators: this.chartOperators(), pareto: this.pareto(), stations: this.stations(), categories: this.categories(), models: this.models(), waste: waste.summary(), tpm: tpm.summary() }; }

    async refresh(date) { await production.reload(date); await quality.reload(date); await waste.load(date); await tpm.load(date); return this.dashboard(); }
    clear() { production.reset(); quality.clear(); waste.clear(); tpm.clear(); }
    toJSON() { return JSON.stringify(this.exportDashboard(), null, 2); }
}

const analytics = new AnalyticsService();
export default analytics;
export { analytics, AnalyticsService };
