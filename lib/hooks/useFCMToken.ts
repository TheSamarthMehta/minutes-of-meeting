"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/lib/store/authStore";

/**
 * Initialises Firebase Messaging in the browser, requests notification
 * permission, retrieves the FCM token, and registers it with the backend.
 *
 * Drop this hook inside any client component that is mounted after login
 * (e.g., the main layout).
 *
 * Required env vars (NEXT_PUBLIC_*):
 *   NEXT_PUBLIC_FIREBASE_API_KEY
 *   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
 *   NEXT_PUBLIC_FIREBASE_PROJECT_ID
 *   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
 *   NEXT_PUBLIC_FIREBASE_APP_ID
 *   NEXT_PUBLIC_FIREBASE_VAPID_KEY
 */
export function useFCMToken() {
  const { data: session, status } = useSession();
  const { token: jwtToken } = useAuthStore();

  useEffect(() => {
    if (status !== "authenticated" && !jwtToken) return;
    if (typeof window === "undefined" || !("Notification" in window)) return;

    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const senderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
    const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

    if (!apiKey || !senderId || !appId || !vapidKey) {
      console.warn(
        "[FCM] Client Firebase config is not set. " +
          "Add NEXT_PUBLIC_FIREBASE_* env vars to enable push notifications."
      );
      return;
    }

    async function registerFCMToken() {
      try {
        const { initializeApp, getApps } = await import("firebase/app");
        const { getMessaging, getToken } = await import("firebase/messaging");

        const firebaseConfig = {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        };

        const fbApp =
          getApps().length > 0
            ? getApps()[0]
            : initializeApp(firebaseConfig);

        const messaging = getMessaging(fbApp);

        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.info("[FCM] Notification permission not granted.");
          return;
        }

        const fcmToken = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });

        if (!fcmToken) {
          console.warn("[FCM] Could not retrieve FCM token.");
          return;
        }

        // Persist token to the backend
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (jwtToken) {
          headers["Authorization"] = `Bearer ${jwtToken}`;
        }

        await fetch("/api/users/fcm-token", {
          method: "POST",
          headers,
          body: JSON.stringify({ token: fcmToken }),
        });

        console.log("[FCM] Token registered with backend.");
      } catch (err: any) {
        console.error("[FCM] Token registration failed:", err?.message ?? err);
      }
    }

    registerFCMToken();
  }, [status, jwtToken]);
}
