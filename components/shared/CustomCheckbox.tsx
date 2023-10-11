import React from "react";
import { Checkbox, User, cn } from "@nextui-org/react";
import { api } from "@/lib/api";

interface Props {
  userId: string;
  value: string;
  groupId: string;
}

export const CustomCheckbox = ({ userId, value, groupId }: Props) => {
  const { data: user } = api.user.getFriend.useQuery({
    friendId: userId,
  });
  return (
    <Checkbox
      aria-label={user?.name ?? ""}
      classNames={{
        base: cn(
          "inline-flex max-w-md w-full bg-content1 m-0",
          "hover:bg-content2 items-center justify-start",
          "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent bg-bgsearch hover:bg-bgsearch/80",
          "data-[selected=true]:border-primary"
        ),
        label: "w-full",
      }}
      value={value}
    >
      <div className="flex w-[200px] justify-between gap-2">
        <User
          avatarProps={{ size: "md", src: user?.image ?? "" }}
          description={<p>@{user?.username}</p>}
          name={user?.name}
        />
      </div>
    </Checkbox>
  );
};
