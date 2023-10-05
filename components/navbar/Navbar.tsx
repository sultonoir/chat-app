import useProfile from "@/hooks/useProfle";
import { Avatar } from "@nextui-org/react";
import { User } from "@prisma/client";
import React from "react";
import { GroupIcons, NewChat } from "../icons";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { signOut } from "next-auth/react";
interface Props {
  user: User;
}

const Navbar: React.FC<Props> = ({ user }) => {
  const profile = useProfile();
  return (
    <div className="flex w-full items-center justify-between bg-bs py-2">
      <div className="flex items-center px-4">
        <div className="h-[49] w-[49]">
          <Avatar
            src={user.image || ""}
            alt="Avatar"
            size="md"
            onClick={profile.onOpen}
          />
        </div>
      </div>
      <div className="flex w-full basis-1/2 items-center justify-evenly gap-x-2">
        <GroupIcons />
        <NewChat />
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
