// ======================================================
// MES CORE V27 Enterprise
// File: /js/notifications.js
// Part 1 / 4
// ======================================================

class NotificationManager {

    constructor() {

        this.permission = Notification.permission;

    }

    async request() {

        this.permission = await Notification.requestPermission();

        return this.permission;

    }

    async show(

        title,

        options = {}

    ) {

        if (this.permission !== "granted") {

            await this.request();

        }

        if (this.permission !== "granted") {

            return null;

        }

        return new Notification(

            title,

            options

        );

    }

}

const notifications = new NotificationManager();

export default notifications;

export {

    NotificationManager

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/notifications.js
// Part 2 / 4
// ======================================================

NotificationManager.prototype.success = function (

    message,

    title = "Success"

) {

    return this.show(

        title,

        {

            body: message,

            icon: "assets/icons/success.png"

        }

    );

};

NotificationManager.prototype.error = function (

    message,

    title = "Error"

) {

    return this.show(

        title,

        {

            body: message,

            icon: "assets/icons/error.png"

        }

    );

};

NotificationManager.prototype.warning = function (

    message,

    title = "Warning"

) {

    return this.show(

        title,

        {

            body: message,

            icon: "assets/icons/warning.png"

        }

    );

};

NotificationManager.prototype.info = function (

    message,

    title = "Information"

) {

    return this.show(

        title,

        {

            body: message,

            icon: "assets/icons/info.png"

        }

    );

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/notifications.js
// Part 3 / 4
// ======================================================

NotificationManager.prototype.progress = function (

    message,

    title = "Progress"

) {

    return this.show(

        title,

        {

            body: message,

            icon: "assets/icons/progress.png",

            tag: "progress"

        }

    );

};

NotificationManager.prototype.close = function (

    notification

) {

    if (

        notification &&

        typeof notification.close === "function"

    ) {

        notification.close();

    }

};

NotificationManager.prototype.schedule = function (

    title,

    options,

    delay = 1000

) {

    return setTimeout(() => {

        this.show(

            title,

            options

        );

    }, delay);

};

NotificationManager.prototype.isGranted = function () {

    return this.permission === "granted";

};

NotificationManager.prototype.isDenied = function () {

    return this.permission === "denied";

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/notifications.js
// Part 4 / 4
// ======================================================

NotificationManager.prototype.permissionStatus = function () {

    return this.permission;

};

NotificationManager.prototype.clear = function () {

    return true;

};

NotificationManager.prototype.destroy = function () {

    this.clear();

};

export default notifications;

export {

    notifications,

    NotificationManager

};
