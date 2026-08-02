// ======================================================
// MES CORE V27 Enterprise
// File: /js/analytics.js
// Part 1 / 4
// ======================================================

import production from "./production.js";
import quality from "./quality.js";
import { round } from "./utils.js";

class AnalyticsService {

    dashboard() {

        const p = production.summary();

        const q = quality.summary();

        return {

            plan: p.plan,

            actual: p.actual,

            defects: q.defects,

            operators: p.operators,

            achievement: p.achievement,

            yield: p.yield,

            fpy: p.fpy

        };

    }

    hourly() {

        return production.hourly();

    }

    models() {

        return production.models().map(model =>

            production.modelSummary(model)

        );

    }

    pareto() {

        return quality.pareto();

    }

    stations() {

        return quality.stationSummary();

    }

    categories() {

        return quality.categorySummary();

    }

    shift(shift) {

        return production.shiftSummary(shift);

    }

    statistics() {

        return {

            production: production.statistics(),

            quality: quality.statistics()

        };

    }

}

const analytics = new AnalyticsService();


// ======================================================
// MES CORE V27 Enterprise
// File: /js/analytics.js
// Part 2 / 4
// ======================================================

AnalyticsService.prototype.productionTrend = function () {

    return production.hourly().map(row => ({

        hour: row.hour,

        plan: row.plan,

        actual: row.actual,

        defects: row.defects,

        achievement:

            row.plan === 0

                ? 0

                : round((row.actual / row.plan) * 100)

    }));

};

AnalyticsService.prototype.modelTrend = function () {

    return production.models().map(model => {

        const rows = production.byModel(model);

        return {

            model,

            hours: rows.length,

            plan: rows.reduce((s, r) => s + Number(r.plan || 0), 0),

            actual: rows.reduce((s, r) => s + Number(r.actual || 0), 0),

            defects: rows.reduce((s, r) => s + Number(r.defects || 0), 0)

        };

    });

};

AnalyticsService.prototype.topDefects = function (limit = 10) {

    return quality

        .defectSummary()

        .slice(0, limit);

};

AnalyticsService.prototype.topStations = function (limit = 10) {

    return quality

        .stationSummary()

        .slice(0, limit);

};

AnalyticsService.prototype.topCategories = function (limit = 10) {

    return quality

        .categorySummary()

        .slice(0, limit);

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/analytics.js
// Part 3 / 4
// ======================================================

AnalyticsService.prototype.kpis = function () {

    const productionStats = production.statistics();

    const qualityStats = quality.statistics();

    return {

        plan: productionStats.totalPlan,

        actual: productionStats.totalActual,

        defects: productionStats.totalDefects,

        achievement: productionStats.achievement,

        yield: productionStats.yield,

        averagePlan: productionStats.averagePlan,

        averageActual: productionStats.averageActual,

        averageDefects: productionStats.averageDefects,

        records: qualityStats.totalRecords

    };

};

AnalyticsService.prototype.chartProduction = function () {

    return production.hourly().map(row => ({

        label: row.hour,

        value: row.actual

    }));

};

AnalyticsService.prototype.chartPlan = function () {

    return production.hourly().map(row => ({

        label: row.hour,

        value: row.plan

    }));

};

AnalyticsService.prototype.chartDefects = function () {

    return production.hourly().map(row => ({

        label: row.hour,

        value: row.defects

    }));

};

AnalyticsService.prototype.chartYield = function () {

    return production.hourly().map(row => ({

        label: row.hour,

        value:

            row.actual === 0

                ? 0

                : round(

                    ((row.actual - row.defects) / row.actual) * 100

                )

    }));

};

AnalyticsService.prototype.chartOperators = function () {

    return production.hourly().map(row => ({

        label: row.hour,

        value: row.operators

    }));

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/analytics.js
// Part 4 / 4
// ======================================================

AnalyticsService.prototype.exportDashboard = function () {

    return {

        generatedAt: new Date().toISOString(),

        dashboard: this.dashboard(),

        kpis: this.kpis(),

        production: this.chartProduction(),

        plan: this.chartPlan(),

        defects: this.chartDefects(),

        yield: this.chartYield(),

        operators: this.chartOperators(),

        pareto: this.pareto(),

        stations: this.stations(),

        categories: this.categories(),

        models: this.models()

    };

};

AnalyticsService.prototype.refresh = async function (date) {

    await production.reload(date);

    await quality.reload(date);

    return this.dashboard();

};

AnalyticsService.prototype.clear = function () {

    production.reset();

    quality.clear();

};

AnalyticsService.prototype.toJSON = function () {

    return JSON.stringify(

        this.exportDashboard(),

        null,

        2

    );

};

export default analytics;

export {

    analytics,

    AnalyticsService

};
