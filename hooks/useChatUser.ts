import { create } from "zustand";

interface Props {
  chatId: string;
}

interface ChatUserStore {
  isOpen: boolean;
  chatId: string;
  onOpen: ({ chatId }: Props) => void;
  onClose: () => void;
}

const useChatUser = create<ChatUserStore>((set) => ({
  isOpen: false,
  chatId: "",
  onOpen: ({ chatId }) => set({ isOpen: true, chatId }),
  onClose: () => set({ isOpen: false }),
}));

export default useChatUser;
