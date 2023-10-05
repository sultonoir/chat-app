"use server";

import { serverClient } from "./ServerClient";

export const Profile = async () => {
  const user = await serverClient.getUser();
  return user;
};
