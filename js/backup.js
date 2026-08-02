// ======================================================
// MES CORE V27 Enterprise
// File: /js/backup.js
// Part 1 / 4
// ======================================================

import production from "./production.js";
import quality from "./quality.js";
import settings from "./api.js";
import storage from "./storage.js";
import { backupId } from "./utils.js";

class BackupManager {

    constructor() {

        this.version = "27";

    }

    async create() {

        return {

            id: backupId(),

            version: this.version,

            createdAt: new Date().toISOString(),

            production: production.toJSON(),

            quality: quality.toJSON(),

            settings: await settings.settings.get(),

            localStorage: storage.all()

        };

    }

    async saveLocal() {

        const backup = await this.create();

        storage.set(

            "mes-backup",

            backup

        );

        return backup;

    }

}

const backup = new BackupManager();


// ======================================================
// MES CORE V27 Enterprise
// File: /js/backup.js
// Part 2 / 4
// ======================================================

BackupManager.prototype.download = async function (

    filename = "MES_Backup.json"

) {

    const backup = await this.create();

    const blob = new Blob(

        [

            JSON.stringify(

                backup,

                null,

                2

            )

        ],

        {

            type: "application/json"

        }

    );

    const url = URL.createObjectURL(

        blob

    );

    const link = document.createElement("a");

    link.href = url;

    link.download = filename;

    link.click();

    URL.revokeObjectURL(url);

};

BackupManager.prototype.restore = async function (

    backup

) {

    if (typeof backup === "string") {

        backup = JSON.parse(

            backup

        );

    }

    await production.fromJSON(

        backup.production

    );

    await quality.fromJSON(

        backup.quality

    );

    if (backup.localStorage) {

        Object.entries(

            backup.localStorage

        ).forEach(

            ([key, value]) => {

                storage.set(

                    key,

                    value

                );

            }

        );

    }

    return true;

};

BackupManager.prototype.loadLocal = function () {

    return storage.get(

        "mes-backup"

    );

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/backup.js
// Part 3 / 4
// ======================================================

BackupManager.prototype.importFile = async function (

    file

) {

    const text = await file.text();

    return await this.restore(

        JSON.parse(text)

    );

};

BackupManager.prototype.exportText = async function () {

    const backup = await this.create();

    return JSON.stringify(

        backup,

        null,

        2

    );

};

BackupManager.prototype.info = async function () {

    const backup = await this.create();

    return {

        id: backup.id,

        version: backup.version,

        createdAt: backup.createdAt,

        productionRecords:

            JSON.parse(

                backup.production

            ).length,

        qualityRecords:

            JSON.parse(

                backup.quality

            ).length

    };

};

BackupManager.prototype.exists = function () {

    return !!storage.get(

        "mes-backup"

    );

};

BackupManager.prototype.removeLocal = function () {

    storage.remove(

        "mes-backup"

    );

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/backup.js
// Part 4 / 4
// ======================================================

BackupManager.prototype.validate = function (backup) {

    if (typeof backup === "string") {

        backup = JSON.parse(backup);

    }

    return (

        backup &&

        backup.version &&

        backup.production !== undefined &&

        backup.quality !== undefined

    );

};

BackupManager.prototype.clear = function () {

    this.removeLocal();

};

BackupManager.prototype.destroy = function () {

    this.clear();

};

export default backup;

export {

    backup,

    BackupManager

};
