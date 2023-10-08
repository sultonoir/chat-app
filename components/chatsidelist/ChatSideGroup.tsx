import { api } from "@/lib/api";
import React from "react";

type Props = {
  id: string;
};

const ChatSideGroup = ({ id }: Props) => {
  const { data } = api.group.getGroup.useQuery({
    id,
  });
  return <div>{data?.name}</div>;
};

export default ChatSideGroup;
