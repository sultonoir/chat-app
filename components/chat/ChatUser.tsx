import useChatUser from "@/hooks/useChatUser";
import { User } from "@prisma/client";
import React from "react";
import { Avatar } from "@nextui-org/react";
import ChatBody from "./ChatBody";
import ChatForm from "./ChatForm";
import { api } from "@/lib/api";

interface Props {
  user: User;
}

const ChatUser = ({ user }: Props) => {
  const chatUser = useChatUser();
  const { data: chat, isLoading } = api.user.getChat.useQuery({
    chatId: chatUser.chatId,
  });

  const other = user.id === chat?.senderId ? chat.receiver : chat?.sender;
  return (
    <>
      {chatUser.isOpen && (
        <div className="flex h-full w-full flex-col">
          <div
            className={`absolute inset-0 z-[-1] h-full w-full bg-[url('../public/bgc.png')] opacity-5`}
          ></div>
          {isLoading ? (
            <p>loading...</p>
          ) : (
            <>
              {!chat ? (
                <p>no data</p>
              ) : (
                <>
                  <div className="flex w-full items-center justify-between bg-bs px-5 py-2">
                    <div className="flex cursor-pointer flex-row items-center gap-x-3">
                      <Avatar
                        src={other?.image ?? ""}
                        alt={other?.name ?? ""}
                        showFallback
                        size="md"
                      />
                      <div className="flex flex-col">
                        <h5 className="text-base font-semibold">
                          {other?.name ?? ""}
                        </h5>
                      </div>
                    </div>
                  </div>
                  <ChatBody
                    directMesg={chat.message}
                    id={user.id}
                  />
                  <ChatForm
                    userId={user.id}
                    groupId={chat.id}
                  />
                </>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatUser;
