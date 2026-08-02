// ======================================================
// MES CORE V27 Enterprise
// File: /js/api.js
// Part 1 / 4
// ======================================================

import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    writeBatch,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import { db } from "./firebase.js";
import { FIREBASE } from "./config.js";
import logger from "./logger.js";

class FirestoreRepository {

    constructor(collectionName) {

        this.collectionName = collectionName;
        this.ref = collection(db, collectionName);

    }

    document(id) {

        return doc(db, this.collectionName, id);

    }

    async exists(id) {

        const snapshot = await getDoc(this.document(id));

        return snapshot.exists();

    }

    async get(id) {

        const snapshot = await getDoc(this.document(id));

        if (!snapshot.exists()) return null;

        return {

            id: snapshot.id,

            ...snapshot.data()

        };

    }

    async save(id, data) {

        await setDoc(
            this.document(id),
            {
                ...data,
                updatedAt: serverTimestamp()
            },
            {
                merge: true
            }
        );

        logger.firebase(`${this.collectionName} saved`, id);

        return id;

    }

    async create(id, data) {

        await setDoc(this.document(id), {

            ...data,

            createdAt: serverTimestamp(),

            updatedAt: serverTimestamp()

        });

        logger.firebase(`${this.collectionName} created`, id);

        return id;

    }

    async update(id, data) {

        await updateDoc(this.document(id), {

            ...data,

            updatedAt: serverTimestamp()

        });

        logger.firebase(`${this.collectionName} updated`, id);

    }

    async remove(id) {

        await deleteDoc(this.document(id));

        logger.firebase(`${this.collectionName} deleted`, id);

    }

    async all(orderField = "updatedAt") {

        const q = query(
            this.ref,
            orderBy(orderField, "desc")
        );

        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({

            id: doc.id,

            ...doc.data()

        }));

    }

    async where(field, operator, value) {

        const q = query(
            this.ref,
            where(field, operator, value)
        );

        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({

            id: doc.id,

            ...doc.data()

        }));

    }

    batch() {

        return writeBatch(db);

    }

}

export const ProductionRepository =
    new FirestoreRepository(
        FIREBASE.COLLECTIONS.PRODUCTION
    );

export const QualityRepository =
    new FirestoreRepository(
        FIREBASE.COLLECTIONS.QUALITY
    );

export const UsersRepository =
    new FirestoreRepository(
        FIREBASE.COLLECTIONS.USERS
    );

export const ReportsRepository =
    new FirestoreRepository(
        FIREBASE.COLLECTIONS.REPORTS
    );

export const SettingsRepository =
    new FirestoreRepository(
        FIREBASE.COLLECTIONS.SETTINGS
    );


// ======================================================
// MES CORE V27 Enterprise
// File: /js/api.js
// Part 2 / 4
// ======================================================

import {
    documentId,
    qualityId
} from "./utils.js";

import logger from "./logger.js";

export class ProductionAPI {

    static async save(record) {

        const id = documentId(

            record.date,

            record.shift,

            record.hour

        );

        const data = {

            ...record,

            id

        };

        await ProductionRepository.save(id, data);

        return id;

    }

    static async get(date, shift, hour) {

        const id = documentId(date, shift, hour);

        return await ProductionRepository.get(id);

    }

    static async getShift(date, shift) {

        return await ProductionRepository.where(

            "shift",

            "==",

            shift

        );

    }

    static async getDay(date) {

        return await ProductionRepository.where(

            "date",

            "==",

            date

        );

    }

    static async delete(date, shift, hour) {

        const id = documentId(date, shift, hour);

        await ProductionRepository.remove(id);

    }

}

export class QualityAPI {

    static async save(defect) {

        const id = qualityId(

            defect.serial ||

            crypto.randomUUID()

        );

        await QualityRepository.create(id, {

            id,

            ...defect

        });

        return id;

    }

    static async update(id, data) {

        await QualityRepository.update(id, data);

    }

    static async get(id) {

        return await QualityRepository.get(id);

    }

    static async getByDate(date) {

        return await QualityRepository.where(

            "date",

            "==",

            date

        );

    }

    static async remove(id) {

        await QualityRepository.remove(id);

    }

}

export class UserAPI {

    static async save(user) {

        await UsersRepository.save(

            user.id,

            user

        );

    }

    static async get(id) {

        return await UsersRepository.get(id);

    }

    static async all() {

        return await UsersRepository.all();

    }

    static async remove(id) {

        await UsersRepository.remove(id);

    }

}

logger.info("API Part 2 Loaded");
// ======================================================
// MES CORE V27 Enterprise
// File: /js/api.js
// Part 3 / 4
// ======================================================

import logger from "./logger.js";

export class SettingsAPI {

    static async save(settings) {

        await SettingsRepository.save(
            "SYSTEM_SETTINGS",
            settings
        );

    }

    static async load() {

        return await SettingsRepository.get(
            "SYSTEM_SETTINGS"
        );

    }

}

export class ReportsAPI {

    static async save(report) {

        await ReportsRepository.save(

            report.id,

            report

        );

    }

    static async get(id) {

        return await ReportsRepository.get(id);

    }

    static async all() {

        return await ReportsRepository.all();

    }

    static async remove(id) {

        await ReportsRepository.remove(id);

    }

}

export class BatchAPI {

    static async saveProduction(records) {

        const batch = ProductionRepository.batch();

        for (const record of records) {

            const id = documentId(

                record.date,

                record.shift,

                record.hour

            );

            batch.set(

                ProductionRepository.document(id),

                {

                    ...record,

                    id

                },

                {

                    merge: true

                }

            );

        }

        await batch.commit();

        logger.firebase(

            "Production Batch Saved",

            records.length

        );

    }

    static async deleteProduction(records) {

        const batch = ProductionRepository.batch();

        for (const record of records) {

            const id = documentId(

                record.date,

                record.shift,

                record.hour

            );

            batch.delete(

                ProductionRepository.document(id)

            );

        }

        await batch.commit();

        logger.firebase(

            "Production Batch Deleted",

            records.length

        );

    }

}

logger.info("API Part 3 Loaded");
// ======================================================
// MES CORE V27 Enterprise
// File: /js/api.js
// Part 4 / 4
// ======================================================

import queue from "./queue.js";
import network from "./network.js";
import logger from "./logger.js";

export class SyncAPI {

    static async enqueue(action, payload) {

        queue.add(action, payload);

    }

    static async process() {

        if (network.isOffline()) return;

        await queue.process(async (item) => {

            switch (item.action) {

                case "SAVE_PRODUCTION":

                    await ProductionAPI.save(item.payload);

                    break;

                case "DELETE_PRODUCTION":

                    await ProductionAPI.delete(

                        item.payload.date,

                        item.payload.shift,

                        item.payload.hour

                    );

                    break;

                case "SAVE_QUALITY":

                    await QualityAPI.save(item.payload);

                    break;

                case "UPDATE_QUALITY":

                    await QualityAPI.update(

                        item.payload.id,

                        item.payload.data

                    );

                    break;

                case "DELETE_QUALITY":

                    await QualityAPI.remove(item.payload.id);

                    break;

                case "SAVE_USER":

                    await UserAPI.save(item.payload);

                    break;

                case "DELETE_USER":

                    await UserAPI.remove(item.payload.id);

                    break;

                case "SAVE_SETTINGS":

                    await SettingsAPI.save(item.payload);

                    break;

                case "SAVE_REPORT":

                    await ReportsAPI.save(item.payload);

                    break;

                default:

                    logger.warning(
                        "Unknown Queue Action",
                        item.action
                    );

            }

        });

    }

}

network.onChange(async (online) => {

    if (online) {

        await SyncAPI.process();

    }

});

export {

    ProductionAPI,

    QualityAPI,

    UserAPI,

    SettingsAPI,

    ReportsAPI,

    BatchAPI,

    SyncAPI

};

export default {

    ProductionAPI,

    QualityAPI,

    UserAPI,

    SettingsAPI,

    ReportsAPI,

    BatchAPI,

    SyncAPI

};

logger.success("MES CORE API Ready");
