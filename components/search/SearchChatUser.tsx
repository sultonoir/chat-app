import { api } from "@/lib/api";
import { Button, Input } from "@nextui-org/react";
import { SearchIcon, XIcon } from "lucide-react";
import React, { useState } from "react";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import DetailsMember from "../details/DetailsMember";
import useSearchChatUser from "@/hooks/useSearchChatUser";

dayjs.extend(calendar);

const SearchChatUser = () => {
  const [query, setQuery] = useState("");
  const searchChatUser = useSearchChatUser();
  const { mutate, isLoading, data } = api.user.findMessage.useMutation();
  return (
    <>
      {searchChatUser.isOpen && (
        <div className="relative flex basis-[30%] flex-col border-l border-default-200">
          <div
            onClick={searchChatUser.onClose}
            className="flex h-[56px] cursor-pointer flex-row items-center bg-bs py-3 pl-3"
          >
            <XIcon
              size={30}
              className="mx-2"
            />
            <p>Search chat group</p>
          </div>
          <div
            id="chat"
            className="flex grow flex-col gap-y-5 overflow-y-auto bg-bgsearch "
          >
            <div className="flex w-full gap-x-2 bg-bgsearch p-2">
              <Input
                placeholder="Search user and group"
                value={query}
                onValueChange={setQuery}
                onClear={() => setQuery("")}
              />
              <Button
                isLoading={isLoading}
                onPress={() => mutate({ query, chatId: searchChatUser.chatId })}
                isIconOnly
                className="bg-transparent hover:bg-transparent"
              >
                <SearchIcon
                  className={`${isLoading && "hidden"} text-iconnav`}
                />
              </Button>
            </div>
            {query === "" ? null : (
              <div className="flex w-full flex-col gap-1 px-3">
                {data?.map((item) => (
                  <DetailsMember
                    key={item.id}
                    imageUrl={item.user.image ?? ""}
                    name={item.user.username ?? ""}
                    etc={item.content ?? ""}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SearchChatUser;
