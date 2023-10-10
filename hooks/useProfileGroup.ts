import { Group, Member, Message, User } from "@prisma/client";
import { create } from "zustand";

interface Props {
  group:
    | (Group & {
        message: Array<
          Message & {
            user: User;
          }
        >;
        member: Array<
          Member & {
            user: User;
          }
        >;
      })
    | undefined;
}

interface ProfileGroupStore {
  isOpen: boolean;
  group:
    | (Group & {
        message: Array<
          Message & {
            user: User;
          }
        >;
        member: Array<
          Member & {
            user: User;
          }
        >;
      })
    | undefined;
  onOpen: ({ group }: Props) => void;
  onClose: () => void;
}

const useProfileGroup = create<ProfileGroupStore>((set) => ({
  isOpen: false,
  group: undefined,
  onOpen: ({ group }) => set({ isOpen: true, group }),
  onClose: () => set({ isOpen: false }),
}));

export default useProfileGroup;
