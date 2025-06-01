import { create } from "zustand";

export const useUserStore = create((set) => ({
  connectedUsers: [],
  updateConnectedUsers: (actualUsers) => set({ connectedUsers: actualUsers }),
}));
