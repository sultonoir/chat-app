"use client";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@nextui-org/react";

function AuthButton() {
  const { data } = useSession();

  if (data) {
    return (
      <>
        {data.user?.name} <br />
        <Button onClick={() => signOut()}>signOut</Button>
      </>
    );
  }

  return (
    <>
      not signIn <br />
      <Button onClick={() => signIn("github")}>signIn</Button>
    </>
  );
}

const NavButton = () => {
  return (
    <div>
      <AuthButton />
    </div>
  );
};

export default NavButton;
