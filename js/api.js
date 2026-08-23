// ======================================================
// MES CORE V28 Enterprise
// File: /js/api.js
// ======================================================

import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy, writeBatch, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { db } from "./firebase.js";
import { FIREBASE } from "./config.js";
import logger from "./logger.js";
import { documentId, qualityId } from "./utils.js";
import queue from "./queue.js";
import network from "./network.js";

class FirestoreRepository {
    constructor(collectionName) {
        this.collectionName = collectionName;
        this.ref = collection(db, collectionName);
    }

    document(id) { return doc(db, this.collectionName, id); }

    async exists(id) {
        const snapshot = await getDoc(this.document(id));
        return snapshot.exists();
    }

    async get(id) {
        const snapshot = await getDoc(this.document(id));
        return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    }

    async save(id, data) {
        await setDoc(this.document(id), { ...data, updatedAt: serverTimestamp() }, { merge: true });
        logger.firebase(`${this.collectionName} saved`, id);
        return id;
    }

    async create(id, data) {
        await setDoc(this.document(id), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
        logger.firebase(`${this.collectionName} created`, id);
        return id;
    }

    async update(id, data) {
        await updateDoc(this.document(id), { ...data, updatedAt: serverTimestamp() });
        logger.firebase(`${this.collectionName} updated`, id);
    }

    async remove(id) {
        await deleteDoc(this.document(id));
        logger.firebase(`${this.collectionName} deleted`, id);
    }

    async all(orderField = "updatedAt") {
        const snapshot = await getDocs(query(this.ref, orderBy(orderField, "desc")));
        return snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
    }

    async where(field, operator, value) {
        const snapshot = await getDocs(query(this.ref, where(field, operator, value)));
        return snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
    }

    batch() { return writeBatch(db); }
}

export const ProductionRepository = new FirestoreRepository(FIREBASE.COLLECTIONS.PRODUCTION);
export const QualityRepository = new FirestoreRepository(FIREBASE.COLLECTIONS.QUALITY);
export const UsersRepository = new FirestoreRepository(FIREBASE.COLLECTIONS.USERS);
export const ReportsRepository = new FirestoreRepository(FIREBASE.COLLECTIONS.REPORTS);
export const SettingsRepository = new FirestoreRepository(FIREBASE.COLLECTIONS.SETTINGS);

class ProductionAPI {
    static async save(record) {
        const id = documentId(record.date, record.shift, record.hour);
        await ProductionRepository.save(id, { ...record, id });
        return id;
    }

    static async get(date, shift, hour) {
        return ProductionRepository.get(documentId(date, shift, hour));
    }

    static async getShift(date, shift) {
        return ProductionRepository.where("date", "==", date).then(rows => rows.filter(row => Number(row.shift) === Number(shift)));
    }

    static async getDay(date) {
        return ProductionRepository.where("date", "==", date);
    }

    static async delete(date, shift, hour) {
        await ProductionRepository.remove(documentId(date, shift, hour));
    }
}

class QualityAPI {
    static async save(defect) {
        const id = qualityId(defect.serial || crypto.randomUUID());
        await QualityRepository.create(id, { id, ...defect });
        return id;
    }

    static async update(id, data) { await QualityRepository.update(id, data); }
    static async get(id) { return QualityRepository.get(id); }
    static async getByDate(date) { return QualityRepository.where("date", "==", date); }
    static async remove(id) { await QualityRepository.remove(id); }
}

class UserAPI {
    static async save(user) { await UsersRepository.save(user.id, user); }
    static async get(id) { return UsersRepository.get(id); }
    static async all() { return UsersRepository.all(); }
    static async remove(id) { await UsersRepository.remove(id); }
}

class SettingsAPI {
    static async save(settings) { await SettingsRepository.save("SYSTEM_SETTINGS", settings); }
    static async load() { return SettingsRepository.get("SYSTEM_SETTINGS"); }
}

class ReportsAPI {
    static async save(report) { await ReportsRepository.save(report.id, report); }
    static async get(id) { return ReportsRepository.get(id); }
    static async all() { return ReportsRepository.all(); }
    static async remove(id) { await ReportsRepository.remove(id); }
}

class BatchAPI {
    static async saveProduction(records) {
        const batch = ProductionRepository.batch();
        for (const record of records) {
            const id = documentId(record.date, record.shift, record.hour);
            batch.set(ProductionRepository.document(id), { ...record, id }, { merge: true });
        }
        await batch.commit();
        logger.firebase("Production Batch Saved", records.length);
    }

    static async deleteProduction(records) {
        const batch = ProductionRepository.batch();
        for (const record of records) batch.delete(ProductionRepository.document(documentId(record.date, record.shift, record.hour)));
        await batch.commit();
        logger.firebase("Production Batch Deleted", records.length);
    }
}

class SyncAPI {
    static async enqueue(action, payload) { queue.add(action, payload); }

    static async process() {
        if (network.isOffline()) return;
        await queue.process(async item => {
            switch (item.action) {
                case "SAVE_PRODUCTION": await ProductionAPI.save(item.payload); break;
                case "DELETE_PRODUCTION": await ProductionAPI.delete(item.payload.date, item.payload.shift, item.payload.hour); break;
                case "SAVE_QUALITY": await QualityAPI.save(item.payload); break;
                case "UPDATE_QUALITY": await QualityAPI.update(item.payload.id, item.payload.data); break;
                case "DELETE_QUALITY": await QualityAPI.remove(item.payload.id); break;
                case "SAVE_USER": await UserAPI.save(item.payload); break;
                case "DELETE_USER": await UserAPI.remove(item.payload.id); break;
                case "SAVE_SETTINGS": await SettingsAPI.save(item.payload); break;
                case "SAVE_REPORT": await ReportsAPI.save(item.payload); break;
                default: logger.warning("Unknown Queue Action", item.action);
            }
        });
    }
}

network.onChange(async online => { if (online) await SyncAPI.process(); });

export { ProductionAPI, QualityAPI, UserAPI, SettingsAPI, ReportsAPI, BatchAPI, SyncAPI };
export default { ProductionAPI, QualityAPI, UserAPI, SettingsAPI, ReportsAPI, BatchAPI, SyncAPI };
