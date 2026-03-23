import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "../../shared/models/auth";

async function fetchUser(): Promise<User | null> {
  const token = localStorage.getItem("auth_token");
  if (!token) return null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch("/api/auth/me", {
      headers: { "Authorization": `Bearer ${token}` },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("auth_token");
      }
      console.error("User fetch failed", response.status);
      return null;
    }

    return response.json();
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      console.warn("Auth check timed out — proceeding without server auth.");
      return null;
    }
    console.error("Auth fetch error:", err);
    return null;
  }
}

export function useAuth() {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: fetchUser,
    retry: false,
  });

  const loginWithGoogleToken = async (idToken: string) => {
    console.log("Google credential received");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    let res: Response;
    try {
      res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ idToken }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === "AbortError") {
        throw new Error("Sign-in timed out. Please try again.");
      }
      console.error("Network error during sign-in:", err);
      throw new Error("Network error — check your connection and try again.");
    }

    if (!res.ok) {
      const text = await res.text();
      console.error("Auth server error:", res.status, text);
      let errorMessage = "Google Sign-In failed";
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `Error ${res.status}: ${text || res.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await res.json();
    console.log("Google Sign-In success", data.email);

    if (data.token) {
      localStorage.setItem("auth_token", data.token);
    }

    if (data.user) {
      localStorage.setItem("spendory-auth-user", JSON.stringify(data.user));
      queryClient.setQueryData(["/api/auth/user"], data.user);

      if (data.user.isPro) {
        localStorage.setItem(`pro_status_${data.user.id}`, JSON.stringify({
          isPro: true,
          plan: data.user.proPlan || "Pro",
          validUntil: null,
          lastVerifiedAt: new Date().toISOString()
        }));
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("spendory-auth-user");
    queryClient.setQueryData(["/api/auth/user"], null);
    window.location.reload();
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    loginWithGoogleToken,
    logout,
  };
}
