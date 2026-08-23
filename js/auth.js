// ======================================================
// MES CORE V28 Enterprise
// File: /js/auth.js
// ======================================================

import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { UsersRepository } from "./api.js";
import { auth } from "./firebase.js";
import storage from "./storage.js";
import logger from "./logger.js";
import { STORAGE, ROLES } from "./config.js";

class AuthService {
    constructor() {
        this.user = null;
        this.profile = null;
        this.listeners = [];
        this.ready = false;
        this.initialize();
    }

    async hydrateProfile(user) {
        if (!user) {
            this.profile = null;
            storage.remove(STORAGE.USER);
            return null;
        }
        try {
            const profile = await UsersRepository.get(user.uid);
            this.profile = { uid: user.uid, email: user.email || "", name: user.displayName || "", ...(profile || {}) };
        } catch (error) {
            logger.warning("User profile unavailable", error.message);
            this.profile = { uid: user.uid, email: user.email || "", name: user.displayName || "" };
        }
        storage.set(STORAGE.USER, this.profile);
        return this.profile;
    }

    initialize() {
        onAuthStateChanged(auth, async user => {
            this.user = user || null;
            await this.hydrateProfile(user);
            this.ready = true;
            logger[user ? "success" : "warning"](user ? "User authenticated" : "User signed out");
            this.listeners.forEach(callback => callback(user, this.profile));
        });
    }

    current() { return this.user; }
    currentProfile() { return this.profile; }
    isAuthenticated() { return !!this.user; }
    onChange(callback) { this.listeners.push(callback); return () => { this.listeners = this.listeners.filter(x => x !== callback); }; }

    async login(email, password) {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        this.user = credential.user;
        await this.hydrateProfile(this.user);
        logger.success("Login successful");
        return this.user;
    }

    async register(name, email, password) {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(credential.user, { displayName: name });
        this.user = credential.user;
        this.profile = { uid: credential.user.uid, email, name, role: ROLES.VIEWER, active: true };
        await UsersRepository.save(credential.user.uid, this.profile);
        storage.set(STORAGE.USER, this.profile);
        logger.success("Account created");
        return credential.user;
    }

    async logout() {
        await signOut(auth);
        this.user = null;
        this.profile = null;
        storage.remove(STORAGE.USER);
        logger.success("Logout successful");
    }

    async updateName(name) {
        this.requireAuth();
        await updateProfile(this.user, { displayName: name });
        this.profile = { ...(this.profile || {}), name };
        await UsersRepository.save(this.user.uid, this.profile);
        storage.set(STORAGE.USER, this.profile);
        return this.user;
    }

    userInfo() {
        if (!this.user) return null;
        return { uid: this.user.uid, email: this.user.email, name: this.user.displayName || this.profile?.name || "", role: this.profile?.role || "guest", verified: this.user.emailVerified, anonymous: this.user.isAnonymous, phone: this.user.phoneNumber, photo: this.user.photoURL };
    }

    uid() { return this.user?.uid || null; }
    email() { return this.user?.email || null; }
    name() { return this.user?.displayName || this.profile?.name || ""; }

    waitForAuth() {
        if (this.ready) return Promise.resolve(this.user);
        return new Promise(resolve => {
            const unsubscribe = onAuthStateChanged(auth, user => { unsubscribe(); resolve(user || null); });
        });
    }

    requireAuth() {
        if (!this.isAuthenticated()) throw new Error("Authentication required");
        return this.user;
    }

    hasVerifiedEmail() { return !!this.user?.emailVerified; }
    isAnonymous() { return !!this.user?.isAnonymous; }
    photoURL() { return this.user?.photoURL || null; }

    async refresh() {
        if (!this.user) return null;
        await this.user.reload();
        this.user = auth.currentUser;
        await this.hydrateProfile(this.user);
        return this.user;
    }

    async token(forceRefresh = false) { this.requireAuth(); return this.user.getIdToken(forceRefresh); }
    cachedUser() { return this.profile || storage.get(STORAGE.USER); }
    clearCache() { this.profile = null; storage.remove(STORAGE.USER); }
    role() { return this.cachedUser()?.role || "guest"; }
    isAdmin() { return this.role() === ROLES.ADMIN; }
    isSupervisor() { return this.role() === ROLES.SUPERVISOR; }
    isOperator() { return this.role() === ROLES.OPERATOR; }
    destroy() { this.user = null; this.profile = null; this.listeners = []; }
}

const authService = new AuthService();
export default authService;
export { authService, AuthService };
