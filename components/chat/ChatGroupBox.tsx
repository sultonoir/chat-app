import useChatGroup from "@/hooks/useChatGroup";
import { api } from "@/lib/api";
import { Avatar } from "@nextui-org/react";
import { User } from "@prisma/client";
import React from "react";
import ChatForm from "./ChatForm";
import ChatBody from "./ChatBody";
import useProfileGroup from "@/hooks/useProfileGroup";
import DetailsFindMember from "../details/DetailsFindMember";

interface Props {
  user: User;
}

const ChatGroupBox = ({ user }: Props) => {
  const ChatGroup = useChatGroup();
  const { data: chat, isLoading } = api.group.getGroup.useQuery({
    id: ChatGroup.groupId,
  });
  const profileGroup = useProfileGroup();
  const member = chat?.member.map((e) => ({
    id: e,
  }));
  return (
    <>
      {ChatGroup.isOpen && (
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
                    <div
                      onClick={() => profileGroup.onOpen({ group: chat })}
                      className="flex cursor-pointer flex-row items-center gap-x-3"
                    >
                      <Avatar
                        src={chat.image}
                        alt={chat.name}
                        showFallback
                        size="md"
                      />
                      <div className="flex flex-col">
                        <h5 className="text-base font-semibold">{chat.name}</h5>
                        <div className="mt-[-5px] flex">
                          {member &&
                            member.map((item) => (
                              <DetailsFindMember
                                memberId={item.id}
                                isChatBox
                                userId={user.id}
                                key={item.id}
                              />
                            ))}
                        </div>
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

export default ChatGroupBox;
