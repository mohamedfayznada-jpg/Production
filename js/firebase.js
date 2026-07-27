// ======================================================
// MES CORE V27 Enterprise
// File: /js/firebase.js
// ======================================================

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {
    initializeFirestore,
    persistentLocalCache,
    persistentMultipleTabManager
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import {
    getStorage
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js";

const firebaseConfig = {

    apiKey: "YOUR_API_KEY",

    authDomain: "YOUR_PROJECT.firebaseapp.com",

    projectId: "YOUR_PROJECT",

    storageBucket: "YOUR_PROJECT.appspot.com",

    messagingSenderId: "000000000",

    appId: "YOUR_APP_ID"

};

const app = getApps().length
    ? getApps()[0]
    : initializeApp(firebaseConfig);

const db = initializeFirestore(app, {

    localCache: persistentLocalCache({

        tabManager: persistentMultipleTabManager()

    })

});

const storage = getStorage(app);

export {

    app,

    db,

    storage

};

export default {

    app,

    db,

    storage

};
