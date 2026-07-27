// ======================================================
// MES CORE V27 Enterprise
// File: /js/quality.js
// Part 1 / 5
// ======================================================

import { QualityAPI } from "./api.js";
import logger from "./logger.js";

class QualityService {

    constructor() {

        this.records = new Map();

    }

    async load(date) {

        const data = await QualityAPI.getByDate(date);

        this.records.clear();

        data.forEach(item => {

            this.records.set(item.id, item);

        });

        logger.info("Quality Loaded", data.length);

        return data;

    }

    async save(defect) {

        const data = {

            serial: defect.serial,

            date: defect.date,

            shift: defect.shift,

            hour: defect.hour,

            model: defect.model,

            defect: defect.defect,

            station: defect.station,

            category: defect.category,

            quantity: Number(defect.quantity || 1),

            image: defect.image || "",

            remarks: defect.remarks || ""

        };

        const id = await QualityAPI.save(data);

        this.records.set(id, {

            id,

            ...data

        });

        logger.success("Quality Saved", id);

        return id;

    }

    get(id) {

        return this.records.get(id) || null;

    }

    all() {

        return [...this.records.values()];

    }

}

const quality = new QualityService();

export default quality;
export { QualityService };
// ======================================================
// MES CORE V27 Enterprise
// File: /js/quality.js
// Part 2 / 5
// ======================================================

import { round, percent } from "./utils.js";

QualityService.prototype.update = async function (id, values) {

    const current = this.get(id);

    if (!current) {

        throw new Error("Quality Record Not Found");

    }

    const updated = {

        ...current,

        ...values

    };

    await QualityAPI.update(id, updated);

    this.records.set(id, updated);

    logger.success("Quality Updated", id);

    return updated;

};

QualityService.prototype.remove = async function (id) {

    await QualityAPI.remove(id);

    this.records.delete(id);

    logger.warning("Quality Deleted", id);

};

QualityService.prototype.totalDefects = function () {

    return this.all().reduce(

        (sum, row) => sum + Number(row.quantity || 0),

        0

    );

};

QualityService.prototype.totalRecords = function () {

    return this.records.size;

};

QualityService.prototype.byModel = function (model) {

    return this.all().filter(

        row => row.model === model

    );

};

QualityService.prototype.byShift = function (shift) {

    return this.all().filter(

        row => row.shift === shift

    );

};

QualityService.prototype.byHour = function (hour) {

    return this.all().filter(

        row => row.hour === hour

    );

};

QualityService.prototype.byStation = function (station) {

    return this.all().filter(

        row => row.station === station

    );

};

QualityService.prototype.byCategory = function (category) {

    return this.all().filter(

        row => row.category === category

    );

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/quality.js
// Part 3 / 5
// ======================================================

QualityService.prototype.byDefect = function (defect) {

    return this.all().filter(

        row => row.defect === defect

    );

};

QualityService.prototype.defectSummary = function () {

    const summary = {};

    this.all().forEach(row => {

        if (!summary[row.defect]) {

            summary[row.defect] = 0;

        }

        summary[row.defect] += Number(row.quantity || 0);

    });

    return Object.entries(summary)

        .map(([defect, quantity]) => ({

            defect,

            quantity

        }))

        .sort((a, b) => b.quantity - a.quantity);

};

QualityService.prototype.stationSummary = function () {

    const summary = {};

    this.all().forEach(row => {

        if (!summary[row.station]) {

            summary[row.station] = 0;

        }

        summary[row.station] += Number(row.quantity || 0);

    });

    return Object.entries(summary)

        .map(([station, quantity]) => ({

            station,

            quantity

        }))

        .sort((a, b) => b.quantity - a.quantity);

};

QualityService.prototype.categorySummary = function () {

    const summary = {};

    this.all().forEach(row => {

        if (!summary[row.category]) {

            summary[row.category] = 0;

        }

        summary[row.category] += Number(row.quantity || 0);

    });

    return Object.entries(summary)

        .map(([category, quantity]) => ({

            category,

            quantity

        }))

        .sort((a, b) => b.quantity - a.quantity);

};

QualityService.prototype.pareto = function () {

    const data = this.defectSummary();

    const total = this.totalDefects();

    let cumulative = 0;

    return data.map(item => {

        cumulative += item.quantity;

        return {

            ...item,

            percent: percent(item.quantity, total),

            cumulative: round(

                (cumulative / total) * 100

            )

        };

    });

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/quality.js
// Part 4 / 5
// ======================================================

QualityService.prototype.summary = function () {

    return {

        records: this.totalRecords(),

        defects: this.totalDefects(),

        stations: [

            ...new Set(

                this.all().map(

                    x => x.station

                )

            )

        ].length,

        categories: [

            ...new Set(

                this.all().map(

                    x => x.category

                )

            )

        ].length,

        models: [

            ...new Set(

                this.all().map(

                    x => x.model

                )

            )

        ].length

    };

};

QualityService.prototype.export = function () {

    return JSON.parse(

        JSON.stringify(

            this.all()

        )

    );

};

QualityService.prototype.clear = function () {

    this.records.clear();

    logger.warning("Quality Cache Cleared");

};

QualityService.prototype.find = function (id) {

    return this.records.get(id) || null;

};

QualityService.prototype.exists = function (id) {

    return this.records.has(id);

};

QualityService.prototype.images = function () {

    return this.all()

        .filter(

            row => row.image

        )

        .map(

            row => row.image

        );

};

QualityService.prototype.withImages = function () {

    return this.all()

        .filter(

            row => row.image

        );

};

QualityService.prototype.withoutImages = function () {

    return this.all()

        .filter(

            row => !row.image

        );

};

QualityService.prototype.search = function (text) {

    const keyword = text.toLowerCase();

    return this.all().filter(row =>

        Object.values(row)

            .join(" ")

            .toLowerCase()

            .includes(keyword)

    );

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/quality.js
// Part 5 / 5
// ======================================================

QualityService.prototype.statistics = function () {

    const defects = this.totalDefects();

    const records = this.totalRecords();

    return {

        totalRecords: records,

        totalDefects: defects,

        averageDefects:

            records === 0

                ? 0

                : round(defects / records),

        pareto: this.pareto(),

        topDefect:

            this.defectSummary()[0] || null,

        topStation:

            this.stationSummary()[0] || null,

        topCategory:

            this.categorySummary()[0] || null

    };

};

QualityService.prototype.reload = async function (date) {

    this.clear();

    return await this.load(date);

};

QualityService.prototype.toJSON = function () {

    return JSON.stringify(

        this.all(),

        null,

        2

    );

};

QualityService.prototype.fromJSON = async function (json) {

    const data = JSON.parse(json);

    for (const item of data) {

        await this.save(item);

    }

};

export default quality;

export {

    quality,

    QualityService

};

logger.success("Quality Service Ready");
