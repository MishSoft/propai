import { create } from "zustand"

export interface AppNotification {
  id: string;
  isRead: boolean;
  isDone?: boolean;
  message: string;
  type: string;
  createdAt: string;
  buyerId?: string | null;
}

interface NotificationStoreProps {
  notifications: AppNotification[];
  setNotifications: (notifications: AppNotification[]) => void;
  isOpen: boolean;
  openNotifications: () => void;
  closeNotifications: () => void;
}

export const useNotificationStore = create<NotificationStoreProps>((set) => ({
  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
  isOpen: false,
  openNotifications: () => set({ isOpen: true }),
  closeNotifications: () => set({ isOpen: false }),
}))
