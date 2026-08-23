// ======================================================
// MES CORE V28 Enterprise
// File: /js/firebase.js
// ======================================================

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "000000000",
    appId: "YOUR_APP_ID"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

const db = initializeFirestore(app, {
    localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
    })
});

const storage = getStorage(app);
const auth = getAuth(app);

export { app, auth, db, storage };
export default { app, auth, db, storage };
