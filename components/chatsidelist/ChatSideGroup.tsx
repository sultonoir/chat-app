import { api } from "@/lib/api";
import React from "react";
import DetailsMember from "../details/DetailsMember";
import useChatGroup from "@/hooks/useChatGroup";

type Props = {
  id: string;
};

const ChatSideGroup = ({ id }: Props) => {
  const chatGroup = useChatGroup();
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
              onClick={() => chatGroup.onOpen({ groupId: data.id })}
            />
          )}
        </>
      )}
    </>
  );
};

export default ChatSideGroup;
