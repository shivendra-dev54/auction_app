"use client";

import { useAuthStore } from "@/store/authStore";
import { useAuthHydrated } from "@/store/useAuthHydrated";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function AuthGuard(
  { children }: { children: React.ReactNode }
) {
  const router = useRouter();
  const hasLoadedStore = useAuthHydrated();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    if (!hasLoadedStore) return;
    if (!user) {
      logout();
      router.push("/auth");
    }
  }, [hasLoadedStore, logout, router, user]);


  if (!hasLoadedStore || !user) {
    return (
      <div className="bg-slate-900 text-white flex justify-center align-middle flex-col flex-1 text-center">
        Loading your profile...
      </div>
    );
  }

  return <>{children}</>
}