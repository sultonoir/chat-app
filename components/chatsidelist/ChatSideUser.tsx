import { api } from "@/lib/api";
import React from "react";
import DetailsMember from "../details/DetailsMember";
import useChatGroup from "@/hooks/useChatGroup";
import useChatUser from "@/hooks/useChatUser";
import useSearchChatUser from "@/hooks/useSearchChatUser";
import useSearchChatGroup from "@/hooks/useSearchChatGroup";
import Loading from "../shared/Loading";

type Props = {
  userId: string;
  chatId: string;
};

const ChatSideUser = ({ userId, chatId }: Props) => {
  const chatGroup = useChatGroup();
  const chatUser = useChatUser();
  const searchChatUser = useSearchChatUser();
  const searchChatGroup = useSearchChatGroup();
  const { data, isLoading } = api.user.getChat.useQuery({
    chatId,
  });

  const other = userId === data?.senderId ? data.receiver : data?.sender;
  const message = data?.message;
  const lastChat = message && message[message?.length - 1];
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {!data ? (
            <>no data</>
          ) : (
            <DetailsMember
              imageUrl={other?.image ?? ""}
              name={other?.name ?? ""}
              sendAt={lastChat?.createdAt}
              sender={lastChat?.user.username}
              fileUrl={lastChat?.fileUrl}
              message={lastChat?.content}
              active={chatUser.chatId === data.id}
              sideList
              onClick={() => {
                chatUser.onOpen({ chatId: data.id });
                chatGroup.onClose();
                searchChatGroup.onClose();
                searchChatUser.onClose();
              }}
            />
          )}
        </>
      )}
    </>
  );
};

export default ChatSideUser;
