import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  User,
} from "@nextui-org/react";
import { UserCard } from "./UserCards";
import { api } from "@/lib/api";

interface Props {
  currentUserId: string;
  userId: string;
  isChat?: boolean;
}

export default function DetailsUser({ userId, currentUserId, isChat }: Props) {
  const { data } = api.group.findMember.useQuery({
    memberId: userId,
  });
  return (
    <Popover
      showArrow
      placement="bottom"
      classNames={{
        base: "py-3 px-4 border border-default-200 bg-ts",
        arrow: "bg-default-200",
      }}
    >
      <PopoverTrigger>
        {isChat ? (
          <h4 className="text-pink-700">@{data?.username}</h4>
        ) : (
          <User
            classNames={{
              base: "justify-start rounded-none p-4 hover:bg-bgchat",
              description: "dark:text-[#8696a0]",
              wrapper: "px-2",
            }}
            as="button"
            name={data?.name}
            description={data?.status}
            className="transition-transform"
            avatarProps={{
              src: `${data?.image}`,
            }}
          />
        )}
      </PopoverTrigger>
      <PopoverContent className="p-1">
        {data && (
          <UserCard
            user={data}
            userId={currentUserId}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
