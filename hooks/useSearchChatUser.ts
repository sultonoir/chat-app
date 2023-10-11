import { create } from "zustand";

interface Props {
  chatId: string;
}

interface SearchChatUserStore {
  isOpen: boolean;
  chatId: string;
  onOpen: ({ chatId }: Props) => void;
  onClose: () => void;
}

const useSearchChatUser = create<SearchChatUserStore>((set) => ({
  isOpen: false,
  chatId: "",
  onOpen: ({ chatId }) => set({ isOpen: true, chatId }),
  onClose: () => set({ isOpen: false, chatId: "" }),
}));

export default useSearchChatUser;
