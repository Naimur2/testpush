import admin from "firebase-admin";
const serviceAccount = require("../easyresult-cda44-firebase-adminsdk-dg0d9-e7eab06777.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export const db = admin.firestore();

export default admin;
