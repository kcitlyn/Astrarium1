"use client";

import { useEffect } from "react";
import { astrariumClient } from "@/lib/api/astrarium-client";
import { createClient } from "@/utils/supabase/client";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const supabase = createClient();

    // Check if user is logged in and sync with Astrarium
    const syncAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user?.email) {
        // Try to login to Astrarium backend
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: session.user.email,
                // Note: We don't have the password here, backend needs to handle this
                password: "temp", // This is a limitation - backend should support session tokens
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            astrariumClient.setToken(data.access_token);
          }
        } catch (error) {
          console.error("Failed to sync with Astrarium:", error);
        }
      } else {
        astrariumClient.clearToken();
      }
    };

    syncAuth();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user?.email) {
        syncAuth();
      } else if (event === "SIGNED_OUT") {
        astrariumClient.clearToken();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <>{children}</>;
}
