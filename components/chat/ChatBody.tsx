import { type Message, type User } from "@prisma/client";
import React, { useEffect, useRef } from "react";
import { FileIcon } from "lucide-react";
import { Image } from "@nextui-org/react";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import DetailsUser from "../details/DetailsUser";

dayjs.extend(calendar);
interface Props {
  directMesg:
    | Array<
        Message & {
          user: User;
        }
      >
    | undefined;
  id?: string;
  isGroup?: boolean;
}

const ChatBody: React.FC<Props> = ({ directMesg, id, isGroup }) => {
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [directMesg]);

  return (
    <div
      id="chat"
      ref={chatBoxRef}
      className="z-[0] flex-1 overflow-y-auto overflow-x-hidden p-5"
    >
      {directMesg?.map((chat) => {
        function deteksiJenisFile(namaFile: string) {
          const ekstensi = namaFile.split(".").pop()?.toLowerCase();
          switch (ekstensi) {
            case "jpg":
            case "jpeg":
            case "png":
              return (
                <Image
                  src={namaFile}
                  alt="Gambar"
                  width={200}
                  height={200}
                  style={{ height: "inherit" }}
                  className="rounded-lg object-cover"
                />
              );
            case "mp3":
              return (
                <audio
                  controls
                  className="h-full max-h-max"
                >
                  <source
                    src={namaFile}
                    type="audio/mpeg"
                  />
                  Browser Anda tidak mendukung tag audio.
                </audio>
              );
            case "pdf":
              return (
                <div className="relative mt-2 flex items-center rounded-md p-2">
                  <>
                    <FileIcon className="h-10 w-10 fill-rose-200 stroke-rose-400" />
                    <a
                      href={namaFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-sm text-rose-500 hover:underline dark:text-rose-400"
                    >
                      pdf
                    </a>
                  </>
                </div>
              );
            default:
              return "Tipe tidak dikenal";
          }
        }
        return (
          <div
            key={chat.id}
            className="flex flex-col"
          >
            <div
              key={chat.id}
              className={`
          ${
            chat.content?.length &&
            chat.content?.length >= 100 &&
            "w-full max-w-xs"
          }
          ${
            chat.userId === id
              ? "ml-auto bg-bgmess text-end before:absolute before:-right-3 before:top-0 before:-z-10 before:border-x-[20px] before:border-y-[10px]  before:border-transparent before:border-t-bgmess"
              : "bg-bs before:absolute before:-left-3 before:top-0 before:-z-10 before:border-x-[20px] before:border-y-[10px]  before:border-transparent before:border-t-bs"
          }
          relative mt-1 flex w-full max-w-max cursor-pointer flex-col rounded-lg p-2`}
            >
              {isGroup && (
                <>
                  {chat.userId !== id && (
                    <DetailsUser
                      userId={chat.userId}
                      currentUserId={id ?? ""}
                      isChat
                    />
                  )}
                </>
              )}

              {chat.fileUrl && (
                <div className="relative h-auto">
                  {deteksiJenisFile(chat.fileUrl)}
                </div>
              )}

              <h5
                className={`${
                  chat?.content?.length && chat?.content?.length >= 100
                    ? "w-full"
                    : ""
                } text-start`}
              >
                {chat.content}
              </h5>
              <p
                className={`${
                  chat.fileUrl && "mt-1"
                } text-xs text-foreground/50`}
              >
                {`${dayjs(chat.updatedAt).calendar()}`}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatBody;
