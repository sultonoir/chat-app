import { api } from "@/lib/api";
import React from "react";
import DetailsMember from "../details/DetailsMember";
import useChatGroup from "@/hooks/useChatGroup";
import useChatUser from "@/hooks/useChatUser";
import useSearchChatUser from "@/hooks/useSearchChatUser";
import useSearchChatGroup from "@/hooks/useSearchChatGroup";

type Props = {
  id: string;
};

const ChatSideGroup = ({ id }: Props) => {
  const chatGroup = useChatGroup();
  const chatUser = useChatUser();
  const searchChatUser = useSearchChatUser();
  const searchChatGroup = useSearchChatGroup();
  const { data, isLoading } = api.group.getGroup.useQuery({
    id,
  });
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
              imageUrl={data.image ?? ""}
              name={data.name}
              sendAt={lastChat?.createdAt}
              sender={lastChat?.user.username}
              fileUrl={lastChat?.fileUrl}
              message={lastChat?.content}
              active={chatGroup.groupId === data.id}
              onClick={() => {
                chatGroup.onOpen({ groupId: data.id });
                chatUser.onClose();
                searchChatGroup.onClose();
                searchChatUser.onClose();
              }}
              sideList
            />
          )}
        </>
      )}
    </>
  );
};

export default ChatSideGroup;
