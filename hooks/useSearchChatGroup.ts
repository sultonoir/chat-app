import { create } from "zustand";

interface Props {
  groupId: string;
}

interface SearchChatGroupStore {
  isOpen: boolean;
  groupId: string;
  onOpen: ({ groupId }: Props) => void;
  onClose: () => void;
}

const useSearchChatGroup = create<SearchChatGroupStore>((set) => ({
  isOpen: false,
  groupId: "",
  onOpen: ({ groupId }) => set({ isOpen: true, groupId }),
  onClose: () => set({ isOpen: false, groupId: "" }),
}));

export default useSearchChatGroup;
