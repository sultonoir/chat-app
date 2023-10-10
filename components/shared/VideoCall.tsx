import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@nextui-org/react";
import { VideoIcon } from "lucide-react";

export default function VideoCall() {
  return (
    <Popover
      placement="bottom-end"
      classNames={{
        base: "bg-bs",
        arrow: "bg-default-200",
      }}
    >
      <PopoverTrigger className="text-iconnav">
        <Button
          isIconOnly
          radius="full"
        >
          <VideoIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-sm">
        <div className="flex flex-row flex-nowrap items-center gap-x-1 py-2">
          <div className="flex flex-col text-small font-bold">
            <p>The calling feature is only available in the app</p>
            <p className="text-tiny text-iconnav">
              Download sultonoir-chat for Windows to start making calls.
            </p>
          </div>
          <Button
            variant="solid"
            color="primary"
          >
            download now
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
