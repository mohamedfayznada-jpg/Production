// ======================================================
// MES CORE V27 Enterprise
// File: /js/auth.js
// Part 1 / 5
// ======================================================

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { auth } from "./firebase.js";
import storage from "./storage.js";
import logger from "./logger.js";
import { STORAGE } from "./config.js";

class AuthService {

    constructor() {

        this.user = null;

        this.listeners = [];

        this.initialize();

    }

    initialize() {

        onAuthStateChanged(auth, user => {

            this.user = user || null;

            if (user) {

                storage.set(STORAGE.USER, {

                    uid: user.uid,

                    email: user.email,

                    name: user.displayName || ""

                });

                logger.success("User authenticated");

            } else {

                storage.remove(STORAGE.USER);

                logger.warning("User signed out");

            }

            this.listeners.forEach(callback => callback(user));

        });

    }

    current() {

        return this.user;

    }

    isAuthenticated() {

        return !!this.user;

    }

    onChange(callback) {

        this.listeners.push(callback);

    }

}

const authService = new AuthService();

// ======================================================
// MES CORE V27 Enterprise
// File: /js/auth.js
// Part 2 / 5
// ======================================================

AuthService.prototype.login = async function (email, password) {

    try {

        const credential = await signInWithEmailAndPassword(

            auth,

            email,

            password

        );

        this.user = credential.user;

        logger.success("Login successful");

        return credential.user;

    } catch (error) {

        logger.error(error.message);

        throw error;

    }

};

AuthService.prototype.register = async function (

    name,

    email,

    password

) {

    try {

        const credential = await createUserWithEmailAndPassword(

            auth,

            email,

            password

        );

        await updateProfile(credential.user, {

            displayName: name

        });

        this.user = credential.user;

        logger.success("Account created");

        return credential.user;

    } catch (error) {

        logger.error(error.message);

        throw error;

    }

};

AuthService.prototype.logout = async function () {

    try {

        await signOut(auth);

        this.user = null;

        storage.remove(STORAGE.USER);

        logger.success("Logout successful");

    } catch (error) {

        logger.error(error.message);

        throw error;

    }

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/auth.js
// Part 3 / 5
// ======================================================

AuthService.prototype.updateName = async function (name) {

    try {

        if (!this.user) {

            throw new Error("User not authenticated");

        }

        await updateProfile(this.user, {

            displayName: name

        });

        storage.set(STORAGE.USER, {

            uid: this.user.uid,

            email: this.user.email,

            name

        });

        logger.success("Profile updated");

        return this.user;

    } catch (error) {

        logger.error(error.message);

        throw error;

    }

};

AuthService.prototype.userInfo = function () {

    if (!this.user) {

        return null;

    }

    return {

        uid: this.user.uid,

        email: this.user.email,

        name: this.user.displayName || "",

        verified: this.user.emailVerified,

        anonymous: this.user.isAnonymous,

        phone: this.user.phoneNumber,

        photo: this.user.photoURL

    };

};

AuthService.prototype.uid = function () {

    return this.user ? this.user.uid : null;

};

AuthService.prototype.email = function () {

    return this.user ? this.user.email : null;

};

AuthService.prototype.name = function () {

    return this.user ? this.user.displayName || "" : "";

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/auth.js
// Part 4 / 5
// ======================================================

AuthService.prototype.waitForAuth = function () {

    return new Promise(resolve => {

        if (this.user !== null) {

            resolve(this.user);

            return;

        }

        const unsubscribe = onAuthStateChanged(auth, user => {

            unsubscribe();

            this.user = user || null;

            resolve(this.user);

        });

    });

};

AuthService.prototype.requireAuth = function () {

    if (!this.isAuthenticated()) {

        throw new Error("Authentication required");

    }

    return this.user;

};

AuthService.prototype.hasVerifiedEmail = function () {

    return this.user ? this.user.emailVerified : false;

};

AuthService.prototype.isAnonymous = function () {

    return this.user ? this.user.isAnonymous : false;

};

AuthService.prototype.photoURL = function () {

    return this.user ? this.user.photoURL : null;

};

AuthService.prototype.refresh = async function () {

    if (!this.user) {

        return null;

    }

    await this.user.reload();

    this.user = auth.currentUser;

    return this.user;

};

AuthService.prototype.token = async function (forceRefresh = false) {

    this.requireAuth();

    return await this.user.getIdToken(forceRefresh);

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/auth.js
// Part 5 / 5
// ======================================================

AuthService.prototype.cachedUser = function () {

    return storage.get(STORAGE.USER);

};

AuthService.prototype.clearCache = function () {

    storage.remove(STORAGE.USER);

};

AuthService.prototype.isAdmin = function () {

    const user = this.cachedUser();

    return user?.role === "admin";

};

AuthService.prototype.isSupervisor = function () {

    const user = this.cachedUser();

    return user?.role === "supervisor";

};

AuthService.prototype.isOperator = function () {

    const user = this.cachedUser();

    return user?.role === "operator";

};

AuthService.prototype.destroy = function () {

    this.user = null;

    this.listeners = [];

};

export default authService;

export {

    authService,

    AuthService

};
