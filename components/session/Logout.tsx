"use client";
import React from "react";
import { signOut } from "next-auth/react";
import { Button } from "@nextui-org/react";
import { api } from "@/lib/api";

const Logout = () => {
  const { data } = api.getUser.useQuery();
  return (
    <div>
      {data?.name}
      <Button onClick={() => signOut()}>Logout</Button>
    </div>
  );
};

export default Logout;
