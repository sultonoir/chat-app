"use client";
import { Button } from "@nextui-org/react";
import React from "react";
import { signIn } from "next-auth/react";

const Login = () => {
  return (
    <div>
      no data
      <Button onClick={() => signIn("github")}>Login</Button>
    </div>
  );
};

export default Login;
