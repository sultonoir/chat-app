import React from "react";
import { Skeleton } from "@nextui-org/react";

export default function Loading() {
  return (
    <div className="flex w-full max-w-[300px] items-center gap-3 p-3">
      <div>
        <Skeleton className="flex h-12 w-12 rounded-full bg-bgchat" />
      </div>
      <div className="flex w-full flex-col gap-2">
        <Skeleton className="h-3 w-3/5 rounded-lg" />
        <Skeleton className="h-3 w-4/5 rounded-lg" />
      </div>
    </div>
  );
}
