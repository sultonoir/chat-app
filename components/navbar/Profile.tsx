import useProfile from "@/hooks/useProfle";
import { Button, Input } from "@nextui-org/react";
import { User } from "@prisma/client";
import React, { useState } from "react";
import { BiLeftArrowAlt } from "react-icons/bi";
import ModalUploadImage from "../modal/ModalUploadImage";
import { MdModeEditOutline } from "react-icons/md";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { toast } from "sonner";
interface Props {
  user: User;
}

const Profile = ({ user }: Props) => {
  const [name, setName] = useState(user.name as string);
  const [username, setUsername] = useState(user.username as string);
  const [status, setStatus] = useState(user.status as string);
  const ctx = api.useContext();
  const { mutate } = api.user.updatePhotoProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile has change");
      ctx.user.getUser.invalidate();
    },
    onError: (e) => {
      toast.error(e.message);
      ctx.user.getUser.invalidate();
    },
  });
  const profile = useProfile();
  const handleSubmit = () => {
    mutate({
      username,
      status,
      name,
    });
  };
  return (
    <>
      {profile.isOpen && (
        <motion.div className="absolute top-0 z-10 flex h-screen w-full flex-col bg-bgsearch">
          <div
            onClick={profile.onClose}
            className="flex h-[58px] flex-row items-center bg-bgchat py-3 pl-3"
          >
            <BiLeftArrowAlt size={30} />
            <p>Profile</p>
          </div>
          <div className="flex h-full max-h-max flex-col items-center gap-3">
            <ModalUploadImage imageUrl={user.image || ""} />
            <div className="w-full px-[30px] pb-[10px] pt-[14px]">
              <div className="flex items-center">Name</div>
              <Input
                variant="underlined"
                value={name}
                onValueChange={setName}
                color="primary"
                defaultValue={user.name || ""}
                endContent={
                  <Button
                    isIconOnly
                    onPress={handleSubmit}
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
                value={username}
                onValueChange={setUsername}
                defaultValue={user.username || ""}
                endContent={
                  <Button
                    isIconOnly
                    onPress={handleSubmit}
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
                value={status}
                onValueChange={setStatus}
                defaultValue={user.status || ""}
                endContent={
                  <Button
                    isIconOnly
                    onPress={handleSubmit}
                    className="bg-transparent"
                  >
                    <MdModeEditOutline />
                  </Button>
                }
              />
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Profile;
