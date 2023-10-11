"use client";

import { Loader2Icon } from "lucide-react";
import React from "react";

const Loader = () => {
  return (
    <div className="absolute inset-0 flex h-full w-full items-center justify-center">
      <Loader2Icon
        className="animate-spin"
        size={40}
      />
    </div>
  );
};

export default Loader;
