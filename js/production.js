// ======================================================
// MES CORE V27 Enterprise
// File: /js/production.js
// Part 1 / 5
// ======================================================

import {
    ProductionAPI
} from "./api.js";

import {
    documentId,
    today
} from "./utils.js";

import logger from "./logger.js";

class ProductionService {

    constructor() {

        this.records = new Map();

    }

    key(date, shift, hour) {

        return documentId(date, shift, hour);

    }

    async loadDay(date = today()) {

        const data = await ProductionAPI.getDay(date);

        this.records.clear();

        data.forEach(item => {

            this.records.set(item.id, item);

        });

        logger.info("Production Loaded", data.length);

        return data;

    }

    get(date, shift, hour) {

        return this.records.get(

            this.key(date, shift, hour)

        ) || null;

    }

    all() {

        return [...this.records.values()];

    }

    async save(record) {

        const id = this.key(

            record.date,

            record.shift,

            record.hour

        );

        const data = {

            id,

            date: record.date,

            shift: record.shift,

            hour: record.hour,

            model: record.model,

            plan: Number(record.plan || 0),

            actual: Number(record.actual || 0),

            defects: Number(record.defects || 0),

            operators: Number(record.operators || 0),

            remarks: record.remarks || ""

        };

        await ProductionAPI.save(data);

        this.records.set(id, data);

        logger.success("Production Saved", id);

        return data;

    }

}

const production = new ProductionService();

export default production;
export { ProductionService };
// ======================================================
// MES CORE V27 Enterprise
// File: /js/production.js
// Part 2 / 5
// ======================================================

import {
    percent,
    round
} from "./utils.js";

ProductionService.prototype.update = async function (
    date,
    shift,
    hour,
    values
) {

    const current = this.get(date, shift, hour);

    if (!current) {

        throw new Error("Production Record Not Found");

    }

    const updated = {

        ...current,

        ...values

    };

    await ProductionAPI.save(updated);

    this.records.set(updated.id, updated);

    logger.success("Production Updated", updated.id);

    return updated;

};

ProductionService.prototype.remove = async function (
    date,
    shift,
    hour
) {

    const id = this.key(date, shift, hour);

    await ProductionAPI.delete(date, shift, hour);

    this.records.delete(id);

    logger.warning("Production Deleted", id);

};

ProductionService.prototype.totalPlan = function () {

    return this.all().reduce(

        (sum, row) => sum + Number(row.plan || 0),

        0

    );

};

ProductionService.prototype.totalActual = function () {

    return this.all().reduce(

        (sum, row) => sum + Number(row.actual || 0),

        0

    );

};

ProductionService.prototype.totalDefects = function () {

    return this.all().reduce(

        (sum, row) => sum + Number(row.defects || 0),

        0

    );

};

ProductionService.prototype.totalOperators = function () {

    return this.all().reduce(

        (sum, row) => sum + Number(row.operators || 0),

        0

    );

};

ProductionService.prototype.achievement = function () {

    return percent(

        this.totalActual(),

        this.totalPlan()

    );

};

ProductionService.prototype.yield = function () {

    const actual = this.totalActual();

    const defects = this.totalDefects();

    if (actual === 0) return 0;

    return round(

        ((actual - defects) / actual) * 100

    );

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/production.js
// Part 3 / 5
// ======================================================

ProductionService.prototype.fpy = function () {

    const actual = this.totalActual();

    const defects = this.totalDefects();

    if (actual === 0) return 0;

    return round(

        ((actual - defects) / actual) * 100

    );

};

ProductionService.prototype.hourly = function () {

    return this.all()

        .sort((a, b) =>

            a.hour.localeCompare(b.hour)

        );

};

ProductionService.prototype.summary = function () {

    return {

        plan: this.totalPlan(),

        actual: this.totalActual(),

        defects: this.totalDefects(),

        operators: this.totalOperators(),

        achievement: this.achievement(),

        yield: this.yield(),

        fpy: this.fpy()

    };

};

ProductionService.prototype.models = function () {

    return [

        ...new Set(

            this.all().map(

                x => x.model

            )

        )

    ];

};

ProductionService.prototype.byModel = function (model) {

    return this.all()

        .filter(

            x => x.model === model

        );

};

ProductionService.prototype.modelSummary = function (model) {

    const rows = this.byModel(model);

    const plan = rows.reduce(

        (s, r) => s + Number(r.plan || 0),

        0

    );

    const actual = rows.reduce(

        (s, r) => s + Number(r.actual || 0),

        0

    );

    const defects = rows.reduce(

        (s, r) => s + Number(r.defects || 0),

        0

    );

    return {

        model,

        plan,

        actual,

        defects,

        achievement: percent(actual, plan),

        yield:

            actual === 0

                ? 0

                : round(

                    ((actual - defects) / actual) * 100

                )

    };

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/production.js
// Part 4 / 5
// ======================================================

ProductionService.prototype.shiftSummary = function (shift) {

    const rows = this.all().filter(

        row => row.shift === shift

    );

    const plan = rows.reduce(

        (sum, row) => sum + Number(row.plan || 0),

        0

    );

    const actual = rows.reduce(

        (sum, row) => sum + Number(row.actual || 0),

        0

    );

    const defects = rows.reduce(

        (sum, row) => sum + Number(row.defects || 0),

        0

    );

    const operators = rows.reduce(

        (sum, row) => sum + Number(row.operators || 0),

        0

    );

    return {

        shift,

        plan,

        actual,

        defects,

        operators,

        achievement: percent(actual, plan),

        yield:

            actual === 0

                ? 0

                : round(

                    ((actual - defects) / actual) * 100

                )

    };

};

ProductionService.prototype.find = function (id) {

    return this.records.get(id) || null;

};

ProductionService.prototype.exists = function (
    date,
    shift,
    hour
) {

    return this.records.has(

        this.key(

            date,

            shift,

            hour

        )

    );

};

ProductionService.prototype.clear = function () {

    this.records.clear();

};

ProductionService.prototype.export = function () {

    return JSON.parse(

        JSON.stringify(

            this.all()

        )

    );

};

ProductionService.prototype.import = async function (records = []) {

    for (const record of records) {

        await this.save(record);

    }

    return true;

};

ProductionService.prototype.refresh = async function (date) {

    return await this.loadDay(date);

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/production.js
// Part 5 / 5
// ======================================================

ProductionService.prototype.statistics = function () {

    const rows = this.all();

    const hours = rows.length;

    const plan = this.totalPlan();

    const actual = this.totalActual();

    const defects = this.totalDefects();

    return {

        totalHours: hours,

        totalPlan: plan,

        totalActual: actual,

        totalDefects: defects,

        averagePlan:

            hours === 0

                ? 0

                : round(plan / hours),

        averageActual:

            hours === 0

                ? 0

                : round(actual / hours),

        averageDefects:

            hours === 0

                ? 0

                : round(defects / hours),

        achievement:

            percent(actual, plan),

        yield:

            actual === 0

                ? 0

                : round(

                    ((actual - defects) / actual) * 100

                )

    };

};

ProductionService.prototype.reset = function () {

    this.records.clear();

    logger.warning("Production Cache Reset");

};

ProductionService.prototype.reload = async function (date = today()) {

    this.reset();

    return await this.loadDay(date);

};

ProductionService.prototype.toJSON = function () {

    return JSON.stringify(

        this.all(),

        null,

        2

    );

};

ProductionService.prototype.fromJSON = async function (json) {

    const data = JSON.parse(json);

    for (const row of data) {

        await this.save(row);

    }

};

export default production;

export {

    production,

    ProductionService

};

logger.success("Production Service Ready");
