import { Group, Message, User as mem } from "@prisma/client";
import React from "react";
import DetailsMember from "../details/DetailsMember";
import useChatGroup from "@/hooks/useChatGroup";

type Props = {
  user: mem;
  message: Message[];
  group?: Group[];
};

const ChatSideList = ({ user, message, group }: Props) => {
  const ChatGroup = useChatGroup();
  return (
    <div
      id="chat"
      className="relative flex grow flex-col overflow-y-auto"
    >
      <div className="flex w-full flex-col">
        {group?.map((item) => {
          return (
            <DetailsMember
              key={item.id}
              imageUrl={item.image}
              name={item.name}
              onClick={() => ChatGroup.onOpen({ groupId: item.id })}
              etc={item.desc || ""}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ChatSideList;
