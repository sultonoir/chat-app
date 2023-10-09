import { api } from "@/lib/api";
import { Button } from "@nextui-org/react";
import React, { useState } from "react";
import { BiSend } from "react-icons/bi";
import ModalUploadForm from "../modal/ModalUploadForm";

interface Props {
  userId: string;
  groupId?: string;
}

const ChatForm = ({ userId, groupId }: Props) => {
  const [chat, setChat] = useState<string>("");
  const ctx = api.useContext();
  const { mutate, isLoading } = api.group.createMessage.useMutation({
    onSuccess: () => {
      ctx.group.getGroup.invalidate();
      setChat("");
    },
  });
  const handleSubmit = () => {
    mutate({
      groupId: groupId ?? "",
      userId,
      content: chat,
    });
  };
  return (
    <div>
      <label
        htmlFor="chat"
        className="sr-only"
      >
        Your message
      </label>
      <div className="flex w-full items-center  bg-gray-50 px-3 py-2 dark:bg-bs">
        <ModalUploadForm
          userId={userId}
          groupId={groupId}
        />
        <textarea
          disabled={isLoading}
          id="chat"
          rows={1}
          value={chat}
          onChange={(e) => setChat(e.target.value)}
          className="mx-4 block w-full resize-none rounded-lg border border-gray-300 bg-white p-2.5 text-sm focus:ring-transparent focus-visible:outline-none focus-visible:ring-transparent focus-visible:ring-offset-0 dark:border-gray-600 dark:bg-default-100 md:pl-4 md:pr-12"
          placeholder="Your message..."
        ></textarea>
        <Button
          isLoading={isLoading}
          disabled={isLoading}
          onClick={handleSubmit}
          isIconOnly
          className="inline-flex cursor-pointer justify-center rounded-full p-2 text-gray-600 hover:bg-blue-100 dark:text-gray-400 dark:hover:bg-gray-600"
        >
          <BiSend size={20} />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </div>
  );
};

export default ChatForm;
