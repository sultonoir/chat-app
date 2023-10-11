"use client";
import React from "react";
import { api } from "@/lib/api";
import Navbar from "../navbar/Navbar";
import useProfile from "@/hooks/useProfle";
import Profile from "../navbar/Profile";
import useCreateGroup from "@/hooks/useCreateGroup";
import CreateGroup from "../navbar/CreateGroup";
import ChatSideList from "../chatsidelist/ChatSideList";
import useChatGroup from "@/hooks/useChatGroup";
import ChatGroupBox from "../chat/ChatGroupBox";
import useProfileGroup from "@/hooks/useProfileGroup";
import ProfileGroup from "../profile/ProfileGroup";
import useChatUser from "@/hooks/useChatUser";
import ChatUser from "../chat/ChatUser";
import ChatSideSearch from "../chatsidelist/ChatSideSearch";
import useSearchChatGroup from "@/hooks/useSearchChatGroup";
import SearchChatGroup from "../search/SearchChatGroup";
import useFriends from "@/hooks/useFriends";
import Friends from "../navbar/Friends";
import useSearchChatUser from "@/hooks/useSearchChatUser";
import SearchChatUser from "../search/SearchChatUser";

const HomeClient = () => {
  const { data } = api.user.getUser.useQuery();
  const profile = useProfile();
  const createGroup = useCreateGroup();
  const ChatGroup = useChatGroup();
  const profileGroup = useProfileGroup();
  const chatUser = useChatUser();
  const searchChatGroup = useSearchChatGroup();
  const friend = useFriends();
  const searchChatUser = useSearchChatUser();
  return (
    <div className="container mx-auto flex h-screen flex-row overflow-hidden">
      {!data ? null : (
        <>
          <div className="relative flex basis-[30%] flex-col border-r border-default-200 bg-bgsearch">
            <Navbar user={data} />
            <ChatSideSearch user={data} />
            <ChatSideList
              user={data}
              member={data.member}
            />
            {friend.isOpen && (
              <Friends
                friends={data.friend}
                user={data}
              />
            )}
            {createGroup && <CreateGroup />}
            {profile && <Profile user={data} />}
          </div>
          <div className="relative h-full grow overflow-hidden">
            {ChatGroup.isOpen && (
              <ChatGroupBox
                user={data}
                friend={data.friend}
              />
            )}
            {chatUser.isOpen && (
              <ChatUser
                user={data}
                friend={data.friend}
              />
            )}
          </div>
          {profileGroup.isOpen && <ProfileGroup user={data} />}
          {searchChatGroup.isOpen && <SearchChatGroup />}
          {searchChatUser.isOpen && <SearchChatUser />}
        </>
      )}
    </div>
  );
};

export default HomeClient;
