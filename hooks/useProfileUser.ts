import { User } from "@prisma/client";
import { create } from "zustand";

interface Props {
  user: User | undefined;
}

interface ProfileUserStore {
  isOpen: boolean;
  user: User | undefined;
  onOpen: ({ user }: Props) => void;
  onClose: () => void;
}

const useProfileUser = create<ProfileUserStore>((set) => ({
  isOpen: false,
  user: undefined,
  onOpen: ({ user }) => set({ isOpen: true, user }),
  onClose: () => set({ isOpen: false }),
}));

export default useProfileUser;
