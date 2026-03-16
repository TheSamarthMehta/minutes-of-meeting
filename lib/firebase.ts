import * as admin from "firebase-admin";

let app: admin.app.App | null = null;

function getFirebaseApp(): admin.app.App {
  if (app) return app;

  if (admin.apps.length > 0) {
    app = admin.apps[0]!;
    return app;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin credentials are not set. " +
        "Add FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY to .env"
    );
  }

  app = admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
  });

  return app;
}

export interface FCMPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
}

export async function sendPushNotification(
  fcmToken: string,
  payload: FCMPayload
): Promise<void> {
  try {
    const messaging = getFirebaseApp().messaging();
    await messaging.send({
      token: fcmToken,
      notification: { title: payload.title, body: payload.body },
      data: payload.data,
      android: { priority: "high" },
      apns: { payload: { aps: { contentAvailable: true } } },
    });
    console.log(`[FCM] Notification sent to token ${fcmToken.slice(0, 20)}...`);
  } catch (err: any) {
    console.error("[FCM] sendPushNotification error:", err?.message ?? err);
  }
}

export async function sendPushToMany(
  tokens: string[],
  payload: FCMPayload
): Promise<void> {
  await Promise.allSettled(tokens.map((t) => sendPushNotification(t, payload)));
}
