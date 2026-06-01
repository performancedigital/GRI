import * as admin from 'firebase-admin';

function initAdmin() {
  if (!admin.apps.length) {
    try {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY;
      
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // Handle newline characters in the private key correctly
          privateKey: privateKey ? privateKey.replace(/\\n/g, '\n') : undefined,
        }),
      });
    } catch (error) {
      console.error('Firebase Admin Initialization Error:', error);
    }
  }
  return admin;
}

export const getAdminDb = () => initAdmin().firestore();
export const getAdminAuth = () => initAdmin().auth();
