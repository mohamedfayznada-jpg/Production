// ======================================================
// MES CORE V27 Enterprise
// File: /js/events.js
// Part 1 / 5
// ======================================================

class EventBus {

    constructor() {

        this.events = {};

    }

    on(event, callback) {

        if (!this.events[event]) {

            this.events[event] = [];

        }

        this.events[event].push(callback);

        return callback;

    }

    once(event, callback) {

        const wrapper = (...args) => {

            callback(...args);

            this.off(event, wrapper);

        };

        this.on(event, wrapper);

    }

    emit(event, ...args) {

        if (!this.events[event]) return;

        this.events[event].forEach(callback => {

            callback(...args);

        });

    }

}

const events = new EventBus();


// ======================================================
// MES CORE V27 Enterprise
// File: /js/events.js
// Part 2 / 5
// ======================================================

EventBus.prototype.off = function (

    event,

    callback

) {

    if (!this.events[event]) return;

    this.events[event] =

        this.events[event].filter(

            fn => fn !== callback

        );

};

EventBus.prototype.clear = function (

    event = null

) {

    if (event) {

        delete this.events[event];

        return;

    }

    this.events = {};

};

EventBus.prototype.listeners = function (

    event

) {

    return this.events[event] || [];

};

EventBus.prototype.listenerCount = function (

    event

) {

    return this.listeners(event).length;

};

EventBus.prototype.has = function (

    event

) {

    return Object.prototype.hasOwnProperty.call(

        this.events,

        event

    );

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/events.js
// Part 3 / 5
// ======================================================

EventBus.prototype.eventNames = function () {

    return Object.keys(

        this.events

    );

};

EventBus.prototype.removeAllListeners = function (

    event

) {

    if (!event) {

        this.events = {};

        return;

    }

    delete this.events[event];

};

EventBus.prototype.subscribe = function (

    event,

    callback

) {

    this.on(

        event,

        callback

    );

    return () =>

        this.off(

            event,

            callback

        );

};

EventBus.prototype.wait = function (

    event

) {

    return new Promise(resolve => {

        this.once(

            event,

            (...args) => resolve(args)

        );

    });

};

EventBus.prototype.emitAsync = async function (

    event,

    ...args

) {

    if (!this.events[event]) return;

    for (const callback of this.events[event]) {

        await callback(...args);

    }

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/events.js
// Part 4 / 5
// ======================================================

EventBus.prototype.pipe = function (

    source,

    target

) {

    this.on(

        source,

        (...args) => this.emit(

            target,

            ...args

        )

    );

};

EventBus.prototype.offAll = function (

    event

) {

    if (!this.events[event]) return;

    this.events[event] = [];

};

EventBus.prototype.emitIf = function (

    condition,

    event,

    ...args

) {

    if (condition) {

        this.emit(

            event,

            ...args

        );

    }

};

EventBus.prototype.emitForEach = function (

    event,

    items = []

) {

    items.forEach(item =>

        this.emit(

            event,

            item

        )

    );

};

EventBus.prototype.size = function () {

    return Object.values(

        this.events

    ).reduce(

        (total, listeners) =>

            total + listeners.length,

        0

    );

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/events.js
// Part 5 / 5
// ======================================================

EventBus.prototype.destroy = function () {

    this.events = {};

};

EventBus.prototype.debug = function () {

    return Object.entries(

        this.events

    ).map(

        ([event, listeners]) => ({

            event,

            listeners: listeners.length

        })

    );

};

EventBus.prototype.export = function () {

    return structuredClone(

        this.events

    );

};

EventBus.prototype.import = function (

    events = {}

) {

    this.events = structuredClone(

        events

    );

};

export default events;

export {

    events,

    EventBus

};
