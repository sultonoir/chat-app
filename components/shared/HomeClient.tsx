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

const HomeClient = () => {
  const { data } = api.user.getUser.useQuery();
  const profile = useProfile();
  const createGroup = useCreateGroup();
  const ChatGroup = useChatGroup();
  const profileGroup = useProfileGroup();
  return (
    <div className="container mx-auto flex h-screen flex-row overflow-hidden">
      {!data ? null : (
        <>
          <div className="relative flex basis-[30%] flex-col border-r border-default-200 bg-bgsearch">
            <Navbar user={data} />
            <ChatSideList
              user={data}
              message={data.message}
              group={data.group}
            />
            {createGroup && <CreateGroup />}
            {profile && <Profile user={data} />}
          </div>
          <div className="relative h-full grow overflow-hidden">
            {ChatGroup.isOpen && <ChatGroupBox user={data} />}
          </div>
          {profileGroup.isOpen && <ProfileGroup user={data} />}
        </>
      )}
    </div>
  );
};

export default HomeClient;
