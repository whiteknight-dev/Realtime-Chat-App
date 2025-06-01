import { create } from "zustand";

export const useChatStore = create((set) => ({
  messages: [],
  addNewMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },
}));
