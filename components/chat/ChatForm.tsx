import { api } from "@/lib/api";
import { Button } from "@nextui-org/react";
import React, { useState } from "react";
import { BiSend } from "react-icons/bi";

interface Props {
  userId: string;
  groupId?: string;
}

const ChatForm = ({ userId, groupId }: Props) => {
  const [chat, setChat] = useState<string>("");
  const ctx = api.useContext();
  const { mutate } = api.group.createMessage.useMutation({
    onSuccess: () => {
      ctx.group.getGroup.invalidate();
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
        <button
          type="button"
          className="inline-flex cursor-pointer justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <svg
            className="h-5 w-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 18"
          >
            <path
              fill="currentColor"
              d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"
            />
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M18 1H2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
            />
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"
            />
          </svg>
          <span className="sr-only">Upload image</span>
        </button>
        <button
          type="button"
          className="cursor-pointer rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <svg
            className="h-5 w-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13.408 7.5h.01m-6.876 0h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM4.6 11a5.5 5.5 0 0 0 10.81 0H4.6Z"
            />
          </svg>
          <span className="sr-only">Add emoji</span>
        </button>
        <textarea
          id="chat"
          rows={1}
          value={chat}
          onChange={(e) => setChat(e.target.value)}
          className="mx-4 block w-full resize-none rounded-lg border border-gray-300 bg-white p-2.5 text-sm focus:ring-transparent focus-visible:outline-none focus-visible:ring-transparent focus-visible:ring-offset-0 dark:border-gray-600 dark:bg-default-100 md:pl-4 md:pr-12"
          placeholder="Your message..."
        ></textarea>
        <Button
          onClick={handleSubmit}
          isIconOnly
          className="inline-flex cursor-pointer justify-center rounded-full p-2 text-blue-600 hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
        >
          <BiSend size={20} />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </div>
  );
};

export default ChatForm;
