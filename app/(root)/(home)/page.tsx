import Login from "@/components/session/Login";
import HomeClient from "@/components/shared/HomeClient";
import { getServerSession } from "next-auth";
import React from "react";

const page = async () => {
  const session = await getServerSession();
  return (
    <div className="container relative mx-auto">
      {session ? <HomeClient /> : <Login />}
    </div>
  );
};

export default page;
