"use client";
import React from "react";
import { api } from "@/lib/api";
import Navbar from "../navbar/Navbar";
import useProfile from "@/hooks/useProfle";
import Profile from "../navbar/Profile";
import useCreateGroup from "@/hooks/useCreateGroup";
import CreateGroup from "../navbar/CreateGroup";

const HomeClient = () => {
  const { data } = api.user.getUser.useQuery();
  const profile = useProfile();
  const createGroup = useCreateGroup();
  return (
    <div className="container mx-auto flex flex-row overflow-hidden">
      {!data ? null : (
        <div className="relative h-screen max-h-max w-full basis-[30%]">
          <Navbar user={data} />
          {createGroup && <CreateGroup />}
          {profile && <Profile user={data} />}
        </div>
      )}
    </div>
  );
};

export default HomeClient;
