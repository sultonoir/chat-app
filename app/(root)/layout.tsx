import React from "react";
import { ProviderNextui } from "@/components/shared/ProviderNextui";

import ProviderTrpc from "@/components/shared/ProviderTrpc";
import { Toaster } from "sonner";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/shared/SessionProvider";
const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession();
  return (
    <>
      <SessionProvider session={session}>
        <ProviderTrpc>
          <ProviderNextui>
            <Toaster richColors />
            {children}
          </ProviderNextui>
        </ProviderTrpc>
      </SessionProvider>
    </>
  );
};

export default Layout;
