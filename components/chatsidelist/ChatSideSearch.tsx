import React from "react";

import { SearchIcon } from "lucide-react";

import { Button, Input } from "@nextui-org/react";
import { api } from "@/lib/api";
import DetailsMember from "../details/DetailsMember";
import { User } from "@prisma/client";
import useChatUser from "@/hooks/useChatUser";
import useChatGroup from "@/hooks/useChatGroup";

interface Props {
  user: User;
}

const ChatSideSearch = ({ user }: Props) => {
  const [query, setQuery] = React.useState("");
  const chatUser = useChatUser();
  const chatGroup = useChatGroup();
  const { mutate, isLoading, data } = api.user.findAll.useMutation();
  const { mutate: createchat, isLoading: loading } =
    api.user.createChat.useMutation({
      onSuccess: (e) => {
        chatUser.onOpen({ chatId: e });
        chatGroup.onClose();
      },
    });
  const { mutate: joingroup, isLoading: load } =
    api.group.joinGroup.useMutation({
      onSuccess: (e) => {
        chatGroup.onOpen({ groupId: e ?? "" });
        chatUser.onClose();
      },
    });

  return (
    <div className="flex flex-col">
      <div className="flex w-full gap-x-2 bg-bgsearch p-2">
        <Input
          placeholder="Search user and group"
          value={query}
          onValueChange={setQuery}
          onClear={() => setQuery("")}
        />
        <Button
          onPress={() => mutate({ query })}
          isIconOnly
          className="bg-transparent hover:bg-transparent"
        >
          <SearchIcon className="text-iconnav" />
        </Button>
      </div>
      {query === "" ? null : (
        <div className="mb-1 flex w-full flex-col gap-y-1">
          {isLoading ? (
            <>loading...</>
          ) : (
            <>
              {!data ? null : (
                <>
                  {data.user.length > 0 && (
                    <h2 className="mt-2 border-b border-border px-5 pb-2">
                      User
                    </h2>
                  )}
                  {data.user.map((item) => (
                    <DetailsMember
                      key={item.id}
                      imageUrl={item.image || ""}
                      name={item.name || ""}
                      etc={item.status || ""}
                      isLoading={loading}
                      onClick={() => {
                        createchat({
                          userId: item.id,
                          cureenUserId: user.id,
                        });
                      }}
                    />
                  ))}
                  {data.group.length > 0 && (
                    <h2 className="mt-2 border-b border-border px-5 pb-2">
                      Group
                    </h2>
                  )}
                  {data.group.map((group) => (
                    <div
                      key={group.id}
                      className="flex flex-row flex-nowrap items-center gap-x-1"
                    >
                      <DetailsMember
                        key={group.id}
                        imageUrl={group.image || ""}
                        name={group.name || ""}
                        etc={group.desc || ""}
                        onClick={() => {
                          joingroup({
                            groupId: group.id,
                            userId: user.id,
                          });
                        }}
                      />
                      <Button
                        isLoading={load}
                        variant="solid"
                        color="primary"
                        onClick={() => {
                          joingroup({
                            groupId: group.id,
                            userId: user.id,
                          });
                        }}
                      >
                        Join
                      </Button>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatSideSearch;
