import useProfile from "@/hooks/useProfle";
import { Avatar, Button } from "@nextui-org/react";
import { User } from "@prisma/client";
import React from "react";
import { GroupIcons, NewChat } from "../icons";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { signOut } from "next-auth/react";
import useCreateGroup from "@/hooks/useCreateGroup";
import useFriends from "@/hooks/useFriends";
interface Props {
  user: User;
}

const Navbar: React.FC<Props> = ({ user }) => {
  const createGroup = useCreateGroup();
  const profile = useProfile();
  const friend = useFriends();
  return (
    <div className="flex w-full items-center justify-between bg-bs py-2">
      <div className="flex cursor-pointer items-center px-4">
        <div className="h-[49] w-[49]">
          <Avatar
            src={user.image || ""}
            alt="Avatar"
            size="md"
            onClick={profile.onOpen}
            showFallback
          />
        </div>
      </div>
      <div className="flex w-full basis-1/2 items-center justify-evenly gap-x-2">
        <GroupIcons
          className="cursor-pointer"
          onClick={createGroup.onOpen}
        />
        <Button
          onPress={() => friend.onOpen()}
          isIconOnly
          variant="light"
          radius="full"
        >
          <NewChat />
        </Button>
        <BiDotsVerticalRounded
          size={30}
          className="cursor-pointer"
          onClick={() => signOut()}
        />
      </div>
    </div>
  );
};

export default Navbar;
