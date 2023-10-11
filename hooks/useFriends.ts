import { create } from "zustand";

interface FriendsStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useFriends = create<FriendsStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useFriends;
