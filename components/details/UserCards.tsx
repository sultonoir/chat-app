import React from "react";
import { Avatar, Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { User } from "@prisma/client";
import { api } from "@/lib/api";
import useChatUser from "@/hooks/useChatUser";
import useChatGroup from "@/hooks/useChatGroup";
import useProfileGroup from "@/hooks/useProfileGroup";

interface Props {
  user: User;
  userId: string;
}

export const UserCard = ({ user, userId }: Props) => {
  const chatUser = useChatUser();
  const ChatGroup = useChatGroup();
  const profileGroup = useProfileGroup();
  const { mutate, isLoading } = api.user.createChat.useMutation({
    onSuccess: (e) => {
      chatUser.onOpen({ chatId: e });
      ChatGroup.onClose();
      profileGroup.onClose();
    },
  });

  return (
    <Card
      shadow="none"
      className="w-[300px] border-none bg-transparent"
    >
      <CardHeader className="justify-between">
        <div className="flex gap-3">
          <Avatar
            isBordered
            radius="full"
            size="md"
            src={user.image ?? "/Logo.png"}
          />
          <div className="flex flex-col items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              {user.name}
            </h4>
            <h5 className="text-small tracking-tight text-default-500">
              @{user.username}
            </h5>
          </div>
        </div>
        <Button
          color="primary"
          radius="full"
          size="sm"
          variant="solid"
          isLoading={isLoading}
          disabled={isLoading}
          onPress={() =>
            mutate({
              userId: user.id,
              cureenUserId: userId,
            })
          }
        >
          Chat
        </Button>
      </CardHeader>
      <CardBody className="px-3 py-0">
        <p className="pl-px text-small text-default-500">{user.status}</p>
      </CardBody>
    </Card>
  );
};
