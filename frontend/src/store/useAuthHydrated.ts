import { useSyncExternalStore } from "react";
import { useAuthStore } from "@/store/authStore";

function subscribe(callback: () => void) {
  const stopHydrating = useAuthStore.persist.onHydrate(callback);
  const finishHydrating = useAuthStore.persist.onFinishHydration(callback);
  return () => {
    stopHydrating();
    finishHydrating();
  };
}

function getSnapshot() {
  return useAuthStore.persist.hasHydrated();
}

function getServerSnapshot() {
  return false;
}

export function useAuthHydrated() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}