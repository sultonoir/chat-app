import useFriends from "@/hooks/useFriends";
import { api } from "@/lib/api";
import { Button, Input } from "@nextui-org/react";
import { Friend, User } from "@prisma/client";
import { SearchIcon } from "lucide-react";
import React, { useState } from "react";
import { BiLeftArrowAlt } from "react-icons/bi";
import DetailsMember from "../details/DetailsMember";
import useChatUser from "@/hooks/useChatUser";
import useChatGroup from "@/hooks/useChatGroup";
import Loading from "../shared/Loading";

type Props = {
  friends: Friend[];
  user: User;
};

const Friends = ({ friends, user }: Props) => {
  const [query, setQuery] = useState("");
  const friend = useFriends();
  return (
    <div className="absolute top-0 z-10 flex h-screen w-full flex-col bg-bgsearch">
      <div
        onClick={friend.onClose}
        className="flex h-[58px] cursor-pointer flex-row items-center bg-bgchat py-3 pl-3"
      >
        <BiLeftArrowAlt size={30} />
        <p>Friends</p>
      </div>
      <div className="flex  max-h-max flex-col items-center gap-3">
        <div className="flex w-full gap-x-2 bg-bgsearch p-2">
          <Input
            placeholder="Search user and group"
            value={query}
            onValueChange={setQuery}
            onClear={() => setQuery("")}
          />
          <Button
            isIconOnly
            className="bg-transparent hover:bg-transparent"
          >
            <SearchIcon className={`text-iconnav`} />
          </Button>
        </div>
      </div>
      <div className="mt-2 w-full">
        {!friends ? (
          <div className="flex items-center text-2xl">Friend not found</div>
        ) : (
          <>
            {friends.map((item) => (
              <React.Fragment key={item.id}>
                <FriendUi
                  friend={item}
                  user={user}
                  query={query}
                />
              </React.Fragment>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

interface F {
  friend: Friend;
  user: User;
  query: string;
}

const FriendUi = ({ friend, user, query }: F) => {
  const { data, isLoading } = api.user.getFriend.useQuery({
    friendId: friend.friendId,
  });
  const chatUser = useChatUser();
  const chatGroup = useChatGroup();
  const { mutate: createchat, isLoading: loading } =
    api.user.createChat.useMutation({
      onSuccess: (e) => {
        chatUser.onOpen({ chatId: e });
        chatGroup.onClose();
      },
    });
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {data?.name === query ? (
            <DetailsMember
              imageUrl={data?.image ?? ""}
              name={data?.name ?? ""}
              etc={data?.status ?? ""}
              isLoading={loading}
              onClick={() =>
                createchat({
                  userId: data?.id ?? "",
                  cureenUserId: user.id,
                })
              }
            />
          ) : (
            <DetailsMember
              imageUrl={data?.image ?? ""}
              name={data?.name ?? ""}
              etc={data?.status ?? ""}
              isLoading={loading}
              onClick={() =>
                createchat({
                  userId: data?.id ?? "",
                  cureenUserId: user.id,
                })
              }
            />
          )}
        </>
      )}
    </>
  );
};

export default Friends;
