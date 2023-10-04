import Login from "@/components/session/Login";
import Logout from "@/components/session/Logout";
import { getServerSession } from "next-auth";
import React from "react";

const page = async () => {
  const session = await getServerSession();
  return <div>{session ? <Logout /> : <Login />}</div>;
};

export default page;
