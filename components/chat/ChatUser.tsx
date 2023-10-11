import useChatUser from "@/hooks/useChatUser";
import { Friend, User } from "@prisma/client";
import React from "react";
import { Avatar, Button } from "@nextui-org/react";
import ChatBody from "./ChatBody";
import ChatForm from "./ChatForm";
import { api } from "@/lib/api";
import { BiUserPlus } from "react-icons/bi";
import dayjs from "dayjs";
import fromNow from "dayjs/plugin/relativeTime";
import VideoCall from "../shared/VideoCall";
import { SearchIcon } from "lucide-react";
import useSearchChatUser from "@/hooks/useSearchChatUser";
dayjs.extend(fromNow);
interface Props {
  user: User;
  friend: Friend[];
}

const ChatUser = ({ user, friend }: Props) => {
  const chatUser = useChatUser();
  const searchChatUser = useSearchChatUser();
  const { data: chat, isLoading } = api.user.getChat.useQuery({
    chatId: chatUser.chatId,
  });
  const ctx = api.useContext();
  const other = user.id === chat?.senderId ? chat.receiver : chat?.sender;
  const addFriend = friend.find((e) => e.friendId === other?.id);
  const { mutate, isLoading: loading } = api.user.addfriend.useMutation({
    onSuccess: () => {
      ctx.user.getUser.invalidate();
    },
  });
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
                        <h5 className="text-base font-semibold capitalize">
                          {other?.name ?? ""}
                        </h5>
                        {other?.lastSeen?.getMinutes() ===
                        new Date().getMinutes() ? (
                          <p className="text-xs text-slate-500">Online</p>
                        ) : (
                          <p className="text-xs text-slate-500">
                            {`${dayjs(user?.lastSeen).fromNow()}`}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-nowrap gap-x-1">
                      <VideoCall />
                      <Button
                        radius="full"
                        isIconOnly
                        onPress={() =>
                          searchChatUser.onOpen({ chatId: chat.id })
                        }
                        variant="light"
                        className="text-iconnav"
                      >
                        <SearchIcon size={20} />
                      </Button>
                      {addFriend ? null : (
                        <Button
                          isIconOnly
                          radius="full"
                          variant="light"
                          isLoading={loading}
                          className="text-iconnav"
                          onPress={() =>
                            mutate({
                              userId: user.id,
                              friendId: other?.id ?? "",
                            })
                          }
                        >
                          <BiUserPlus
                            size={25}
                            className={`${loading && "hidden"}`}
                          />
                        </Button>
                      )}
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
