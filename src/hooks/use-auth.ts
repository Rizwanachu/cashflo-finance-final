import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "../../shared/models/auth";

async function fetchUser(): Promise<User | null> {
  const token = localStorage.getItem("auth_token");
  if (!token) return null;

  const response = await fetch("/api/auth/me", {
    headers: { "Authorization": `Bearer ${token}` }
  });

  if (response.status === 401) {
    localStorage.removeItem("auth_token");
    return null;
  }

  return response.json();
}

export function useAuth() {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: fetchUser,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: any) => {
      console.log("Executing login mutation for:", credentials.email);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "no-cache"
        },
        body: JSON.stringify(credentials)
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Login API error:", errorData);
        throw new Error(errorData.message || "Login failed");
      }
      const data = await res.json();
      console.log("Login successful, token received");
      localStorage.setItem("auth_token", data.token);
      return data.user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/auth/user"], user);
      // Sync local Pro status with server on login
      if (user.isPro) {
        localStorage.setItem("spendory_pro_status", "true");
        localStorage.setItem(`pro_status_${user.id}`, JSON.stringify({
          isPro: true,
          plan: user.proPlan || "Pro (Unlocked)",
          validUntil: null,
          lastVerifiedAt: new Date().toISOString()
        }));
      } else {
        localStorage.setItem("spendory_pro_status", "false");
      }
    },
    onSettled: () => {
      // Re-fetch Pro status context or trigger a refresh if needed
      window.location.reload(); 
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: any) => {
      console.log("Executing register mutation for:", userData.email);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Registration API error:", errorData);
        throw new Error(errorData.message || "Registration failed");
      }
      const data = await res.json();
      console.log("Registration successful, token received");
      localStorage.setItem("auth_token", data.token);
      return data.user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/auth/user"], user);
      // Sync local Pro status with server on login
      if (user.isPro) {
        localStorage.setItem("spendory_pro_status", "true");
        localStorage.setItem(`pro_status_${user.id}`, JSON.stringify({
          isPro: true,
          plan: user.proPlan || "Pro (Unlocked)",
          validUntil: null,
          lastVerifiedAt: new Date().toISOString()
        }));
      } else {
        localStorage.setItem("spendory_pro_status", "false");
      }
    },
    onSettled: () => {
      // Re-fetch Pro status context or trigger a refresh if needed
      window.location.reload(); 
    }
  });

  const logout = () => {
    localStorage.removeItem("auth_token");
    queryClient.setQueryData(["/api/auth/user"], null);
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
  };
}
