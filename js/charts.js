// ======================================================
// MES CORE V27 Enterprise
// File: /js/charts.js
// Part 1 / 5
// ======================================================

class ChartManager {

    constructor() {

        this.charts = {};

    }

    create(id, config) {

        const canvas = document.getElementById(id);

        if (!canvas) return null;

        this.destroy(id);

        this.charts[id] = new Chart(

            canvas,

            config

        );

        return this.charts[id];

    }

    get(id) {

        return this.charts[id] || null;

    }

    exists(id) {

        return !!this.charts[id];

    }

    destroy(id) {

        if (!this.charts[id]) return;

        this.charts[id].destroy();

        delete this.charts[id];

    }

}

const charts = new ChartManager();


// ======================================================
// MES CORE V27 Enterprise
// File: /js/charts.js
// Part 2 / 5
// ======================================================

ChartManager.prototype.line = function (

    id,

    labels,

    data,

    label = "Series"

) {

    return this.create(id, {

        type: "line",

        data: {

            labels,

            datasets: [

                {

                    label,

                    data,

                    tension: 0.3,

                    fill: false

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false

        }

    });

};

ChartManager.prototype.bar = function (

    id,

    labels,

    data,

    label = "Series"

) {

    return this.create(id, {

        type: "bar",

        data: {

            labels,

            datasets: [

                {

                    label,

                    data

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false

        }

    });

};

ChartManager.prototype.pie = function (

    id,

    labels,

    data

) {

    return this.create(id, {

        type: "pie",

        data: {

            labels,

            datasets: [

                {

                    data

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false

        }

    });

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/charts.js
// Part 3 / 5
// ======================================================

ChartManager.prototype.doughnut = function (

    id,

    labels,

    data

) {

    return this.create(id, {

        type: "doughnut",

        data: {

            labels,

            datasets: [

                {

                    data

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false

        }

    });

};

ChartManager.prototype.radar = function (

    id,

    labels,

    data,

    label = "Series"

) {

    return this.create(id, {

        type: "radar",

        data: {

            labels,

            datasets: [

                {

                    label,

                    data

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false

        }

    });

};

ChartManager.prototype.polarArea = function (

    id,

    labels,

    data

) {

    return this.create(id, {

        type: "polarArea",

        data: {

            labels,

            datasets: [

                {

                    data

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false

        }

    });

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/charts.js
// Part 4 / 5
// ======================================================

ChartManager.prototype.scatter = function (

    id,

    data,

    label = "Series"

) {

    return this.create(id, {

        type: "scatter",

        data: {

            datasets: [

                {

                    label,

                    data

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false

        }

    });

};

ChartManager.prototype.bubble = function (

    id,

    data,

    label = "Series"

) {

    return this.create(id, {

        type: "bubble",

        data: {

            datasets: [

                {

                    label,

                    data

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false

        }

    });

};

ChartManager.prototype.update = function (

    id,

    labels,

    data

) {

    const chart = this.get(id);

    if (!chart) return;

    chart.data.labels = labels;

    chart.data.datasets[0].data = data;

    chart.update();

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/charts.js
// Part 5 / 5
// ======================================================

ChartManager.prototype.resize = function (id) {

    const chart = this.get(id);

    if (!chart) return;

    chart.resize();

};

ChartManager.prototype.clear = function () {

    Object.keys(this.charts).forEach(id => {

        this.destroy(id);

    });

};

ChartManager.prototype.export = function (id) {

    const chart = this.get(id);

    if (!chart) return null;

    return chart.toBase64Image();

};

ChartManager.prototype.destroyAll = function () {

    this.clear();

};

ChartManager.prototype.count = function () {

    return Object.keys(this.charts).length;

};

export default charts;

export {

    charts,

    ChartManager

};
