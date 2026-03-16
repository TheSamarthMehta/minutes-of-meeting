"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/lib/store/authStore";
import { getFirebaseAnalytics, getFirebaseClientApp } from "@/lib/firebaseClient";
import { getMessaging, getToken } from "firebase/messaging";

const DEFAULT_VAPID_PUBLIC_KEY =
  "BGBfiW65OKGVW8Gj0PZuxJ6Gi9NGhUJUX4OiW1vevzrsJOgB8EPctjUCUu_FaN1No23xChamiYmhX1AFHyT2mMA";

export function useFCMToken() {
  const { status } = useSession();
  const { token: jwtToken } = useAuthStore();

  useEffect(() => {
    if (status !== "authenticated" && !jwtToken) return;
    if (typeof window === "undefined" || !("Notification" in window)) return;

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || DEFAULT_VAPID_PUBLIC_KEY;

    async function registerFCMToken() {
      try {
        if (!("serviceWorker" in navigator)) {
          console.warn("[FCM] Service Worker is not supported in this browser.");
          return;
        }

        void getFirebaseAnalytics();

        const fbApp = getFirebaseClientApp();
        const messaging = getMessaging(fbApp);

        const swRegistration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js"
        );
        await navigator.serviceWorker.ready;

        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.info("[FCM] Notification permission not granted.");
          return;
        }

        const fcmToken = await getToken(messaging, {
          vapidKey,
          serviceWorkerRegistration: swRegistration,
        });

        if (!fcmToken) {
          console.warn("[FCM] Could not retrieve FCM token.");
          return;
        }

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
