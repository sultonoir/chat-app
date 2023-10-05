import React from "react";
import { ProviderNextui } from "@/components/shared/ProviderNextui";

import ProviderTrpc from "@/components/shared/ProviderTrpc";
import { Toaster } from "sonner";
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ProviderTrpc>
        <ProviderNextui>
          <Toaster richColors />
          {children}
        </ProviderNextui>
      </ProviderTrpc>
    </>
  );
};

export default Layout;
