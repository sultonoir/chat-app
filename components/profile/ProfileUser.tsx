import useProfileUser from "@/hooks/useProfileUser";
import { api } from "@/lib/api";
import { Button, Image } from "@nextui-org/react";
import { User } from "@prisma/client";
import { XIcon } from "lucide-react";
import React from "react";
import { BsChatRightTextFill } from "react-icons/bs";

interface Props {
  user: User;
}

const ProfileUser = ({ user }: Props) => {
  const profileUser = useProfileUser();
  const { mutate, isLoading } = api.user.createChat.useMutation({
    onSuccess: (e) => {
      console.log(e);
    },
  });

  const handleSubmit = () => {
    mutate({
      cureenUserId: user.id,
      userId: profileUser.user?.id ?? "",
    });
  };
  return (
    <>
      {profileUser.isOpen && (
        <div className="relative flex basis-[30%] flex-col border-l border-default-200">
          <div
            onClick={profileUser.onClose}
            className="flex h-[56px] cursor-pointer flex-row items-center bg-bgchat py-3 pl-3"
          >
            <XIcon size={30} />
            <p>Profile</p>
          </div>
          <div className="flex grow flex-col gap-y-5 overflow-y-auto ">
            <div className="flex flex-col items-center justify-between gap-y-5 bg-bgsearch py-5">
              <Image
                src={profileUser.user?.image || "/Logo.png"}
                alt={profileUser.user?.name ?? ""}
                width={200}
                height={200}
                radius="full"
              />
              <h3 className="text-2xl">{profileUser.user?.name}</h3>
              <Button
                isIconOnly
                isLoading={isLoading}
                disabled={isLoading}
                onPress={handleSubmit}
                variant="light"
                radius="full"
                color="primary"
              >
                <BsChatRightTextFill
                  size={20}
                  className={`${isLoading ? "hidden" : ""}`}
                />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileUser;
