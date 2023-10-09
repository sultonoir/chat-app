import { Group, Message } from "@prisma/client";
import { create } from "zustand";

interface Props {
  group: Group & {
    message: Message[];
  };
}

interface ProfileGroupStore {
  isOpen: boolean;
  group:
    | (Group & {
        message: Message[];
      })
    | null;
  onOpen: ({ group }: Props) => void;
  onClose: () => void;
}

const useProfileGroup = create<ProfileGroupStore>((set) => ({
  isOpen: false,
  group: null,
  onOpen: ({ group }) => set({ isOpen: true, group }),
  onClose: () => set({ isOpen: false }),
}));

export default useProfileGroup;
