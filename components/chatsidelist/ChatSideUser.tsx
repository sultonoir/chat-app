import { api } from "@/lib/api";
import React from "react";
import DetailsMember from "../details/DetailsMember";
import useChatGroup from "@/hooks/useChatGroup";
import useChatUser from "@/hooks/useChatUser";

type Props = {
  userId: string;
  chatId: string;
};

const ChatSideUser = ({ userId, chatId }: Props) => {
  const chatGroup = useChatGroup();
  const chatUser = useChatUser();
  const { data, isLoading } = api.user.getChat.useQuery({
    chatId,
  });

  const other = userId === data?.senderId ? data.receiver : data?.sender;
  const message = data?.message;
  const lastChat = message && message[message?.length - 1];
  return (
    <>
      {isLoading ? (
        <>loading...</>
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
              onClick={() => {
                chatUser.onOpen({ chatId: data.id });
                chatGroup.onClose();
              }}
            />
          )}
        </>
      )}
    </>
  );
};

export default ChatSideUser;