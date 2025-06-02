import { create } from "zustand";

export const useConnectionStore = create((set) => ({
  socket: null,
  isConnected: false,
  nickname: "",
  hasJoinedChat: false,
  changeConnectionStatus: (status) => {
    set({
      isConnected: status,
    });
  },
  changeHasJoinedChatStatus: (status) => set({ hasJoinedChat: status }),
  setNickname: (newNickname) => set({ nickname: newNickname }),
  setSocket: (newSocket) => set({ socket: newSocket }),
}));
