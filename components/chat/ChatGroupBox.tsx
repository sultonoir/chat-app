import useChatGroup from "@/hooks/useChatGroup";
import { api } from "@/lib/api";
import { Avatar, Button } from "@nextui-org/react";
import { Friend, User } from "@prisma/client";
import React from "react";
import ChatForm from "./ChatForm";
import ChatBody from "./ChatBody";
import useProfileGroup from "@/hooks/useProfileGroup";
import VideoCall from "../shared/VideoCall";
import { SearchIcon } from "lucide-react";
import useSearchChatGroup from "@/hooks/useSearchChatGroup";
import AddMember from "../shared/AddMember";

interface Props {
  user: User;
  friend: Friend[];
}

const ChatGroupBox = ({ user, friend }: Props) => {
  const ChatGroup = useChatGroup();
  const { data: chat, isLoading } = api.group.getGroup.useQuery({
    id: ChatGroup.groupId,
  });
  const profileGroup = useProfileGroup();
  const seachChatGroup = useSearchChatGroup();
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
                      onClick={() => {
                        profileGroup.onOpen({ group: chat });
                        seachChatGroup.onClose();
                      }}
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
                        <div className="mt-[-1px] flex">
                          {chat.member.slice(0, 10).map((item) => (
                            <p
                              key={item.id}
                              className="text-xs dark:text-[#8696a0]"
                            >
                              {item.user.username},
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-nowrap gap-x-1">
                      {user.id === chat.userId && (
                        <AddMember
                          friends={friend}
                          groupId={chat.id}
                        />
                      )}
                      <VideoCall />
                      <Button
                        radius="full"
                        isIconOnly
                        onPress={() =>
                          seachChatGroup.onOpen({ groupId: chat.id })
                        }
                        variant="light"
                        className="text-iconnav"
                      >
                        <SearchIcon size={20} />
                      </Button>
                    </div>
                  </div>
                  <ChatBody
                    directMesg={chat.message}
                    id={user.id}
                    isGroup
                  />
                  <ChatForm
                    userId={user.id}
                    groupId={chat.id}
                    isGroup
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
