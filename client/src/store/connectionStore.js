import { create } from "zustand";

export const useConnectionStore = create((set) => ({
  socket: null,
  isConnected: false,
  nickname: "",
  hasJoinedChat: false,
  changeConnectionStatus: () => {
    set((state) => ({
      isConnected: !state.isConnected,
    }));
  },
  changeHasJoinedChatStatus: () =>
    set((state) => ({ hasJoinedChat: !state.hasJoinedChat })),
  setNickname: (newNickname) => set({ nickname: newNickname }),
  setSocket: (newSocket) => set({ socket: newSocket }),
}));
