"use client";
import React from "react";
import { api } from "@/lib/api";
import Navbar from "../navbar/Navbar";
import useProfile from "@/hooks/useProfle";
import Profile from "../navbar/Profile";

const HomeClient = () => {
  const { data } = api.getUser.useQuery();
  const profile = useProfile();
  return (
    <div className="container mx-auto flex flex-row overflow-hidden">
      {!data ? null : (
        <div className="relative h-screen max-h-max w-full basis-[30%]">
          <Navbar user={data} />
          {profile && <Profile user={data} />}
        </div>
      )}
    </div>
  );
};

export default HomeClient;
