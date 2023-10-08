import { create } from "zustand";

interface Props {
  groupId: string;
}

interface ChatGroupStore {
  isOpen: boolean;
  groupId: string;
  onOpen: ({ groupId }: Props) => void;
  onClose: () => void;
}

const useChatGroup = create<ChatGroupStore>((set) => ({
  isOpen: false,
  groupId: "",
  onOpen: ({ groupId }) => set({ isOpen: true, groupId }),
  onClose: () => set({ isOpen: false }),
}));

export default useChatGroup;
