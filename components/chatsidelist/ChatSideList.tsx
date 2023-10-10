import { Member, User as mem } from "@prisma/client";
import React from "react";
import ChatSideGroup from "./ChatSideGroup";
import ChatSideUser from "./ChatSideUser";

type Props = {
  user: mem;
  member: Member[];
};

const ChatSideList = ({ user, member }: Props) => {
  return (
    <div
      id="chat"
      className="relative flex grow flex-col overflow-y-auto"
    >
      <div className="flex w-full flex-col">
        {member.map((item) => (
          <React.Fragment key={item.id}>
            {item.groupId && <ChatSideGroup id={item.groupId} />}
            {item.chatId && (
              <ChatSideUser
                chatId={item.chatId}
                userId={user.id}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ChatSideList;
