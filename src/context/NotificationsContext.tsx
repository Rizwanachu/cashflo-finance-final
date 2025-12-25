import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export interface Notification {
  id: string;
  type: "budget_warning" | "budget_exceeded" | "payment_due" | "info";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationsContextValue {
  notifications: Notification[];
  unreadCount: number;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  resetNotifications: () => void;
  requestPermission: () => Promise<void>;
  permissionStatus: NotificationPermission;
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);

const NOTIFICATIONS_KEY = "cashflo-notifications-v1";
const NOTIFICATIONS_ENABLED_KEY = "cashflo-notifications-enabled-v1";

function loadNotifications(): Notification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(NOTIFICATIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Notification[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveNotifications(notifications: Notification[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  } catch {
    // ignore
  }
}

function loadEnabled(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const raw = window.localStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
    if (!raw) return true;
    return JSON.parse(raw) === true;
  } catch {
    return true;
  }
}

function saveEnabled(enabled: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(NOTIFICATIONS_ENABLED_KEY, JSON.stringify(enabled));
  } catch {
    // ignore
  }
}

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => loadNotifications());
  const [enabled, setEnabledState] = useState<boolean>(() => loadEnabled());
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  useEffect(() => {
    saveNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    saveEnabled(enabled);
  }, [enabled]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const requestPermission = async () => {
    if (typeof window === 'undefined') return;
    
    // Check for Safari/iOS PWA specific support
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isPWA = window.matchMedia('(display-mode: standalone)').matches;

    if (typeof Notification === 'undefined') {
      if (isIOS && !isPWA) {
        alert("To enable notifications on iPhone, please 'Add to Home Screen' first.");
      } else {
        alert("Notifications are not supported on this device/browser.");
      }
      return;
    }
    
    try {
      // iOS Safari requires a user gesture and specifically the PWA environment
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      
      if (permission === 'granted') {
        new Notification("Notifications Enabled", {
          body: "You'll now receive alerts for budgets and payments.",
          icon: "/logo.png"
        });
      }
    } catch (err) {
      console.error('Error requesting notification permission:', err);
      // Fallback for some older iOS versions
      try {
        Notification.requestPermission((result) => {
          setPermissionStatus(result);
        });
      } catch (e) {
        console.error('Callback fallback failed:', e);
      }
    }
  };

  const addNotification = useCallback((notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    if (!enabled) return;
    
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      read: false
    };

    // Show system notification
    if (permissionStatus === 'granted' && typeof Notification !== 'undefined') {
      try {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/logo.png', // Ensure this path is correct
          silent: false, // Use system default sound
        });
      } catch (err) {
        console.error('System notification error:', err);
      }
    }

    setNotifications((prev) => [newNotification, ...prev].slice(0, 50)); // Keep max 50
  }, [enabled, permissionStatus]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const setEnabled = (value: boolean) => {
    setEnabledState(value);
  };

  const resetNotifications = () => {
    setNotifications([]);
    setEnabledState(true);
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        enabled,
        setEnabled,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
        resetNotifications,
        requestPermission,
        permissionStatus
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export function useNotifications(): NotificationsContextValue {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within NotificationsProvider");
  }
  return ctx;
}

