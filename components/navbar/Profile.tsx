import useProfile from "@/hooks/useProfle";
import { Button, Image, Input } from "@nextui-org/react";
import { User } from "@prisma/client";
import React from "react";
import { BiLeftArrowAlt } from "react-icons/bi";
import ModalUploadImage from "../modal/ModalUploadImage";
import { MdModeEditOutline } from "react-icons/md";
interface Props {
  user: User;
}

const Profile = ({ user }: Props) => {
  const profile = useProfile();
  return (
    <>
      {profile.isOpen && (
        <div className="absolute top-0 z-10 flex h-screen w-full flex-col bg-bgsearch">
          <div
            onClick={profile.onClose}
            className="flex flex-row items-center bg-bgchat py-3 pl-3"
          >
            <BiLeftArrowAlt size={30} />
            <p>Profile</p>
          </div>
          <div className="flex h-full max-h-max flex-col items-center gap-3">
            <div className="mx-auto my-3 h-[200px] w-[200px]">
              <Image
                src={user.image || "/logo.png"}
                alt={user.name || ""}
                width={200}
                height={200}
                radius="full"
              />
            </div>
            <ModalUploadImage />
            <div className="w-full px-[30px] pb-[10px] pt-[14px]">
              <div className="flex items-center">Name</div>
              <Input
                variant="underlined"
                color="primary"
                defaultValue={user.name || ""}
                endContent={
                  <Button
                    isIconOnly
                    className="bg-transparent"
                  >
                    <MdModeEditOutline />
                  </Button>
                }
              />
            </div>
            <div className="w-full px-[30px] pb-[10px] pt-[14px]">
              <div className="flex items-center">Username</div>
              <Input
                variant="underlined"
                color="primary"
                defaultValue={user.username || ""}
                endContent={
                  <Button
                    isIconOnly
                    className="bg-transparent"
                  >
                    <MdModeEditOutline />
                  </Button>
                }
              />
            </div>
            <div className="w-full px-[30px] pb-[10px] pt-[14px]">
              <div className="flex items-center">Status</div>
              <Input
                variant="underlined"
                color="primary"
                defaultValue={user.email || ""}
                endContent={
                  <Button
                    isIconOnly
                    className="bg-transparent"
                  >
                    <MdModeEditOutline />
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
