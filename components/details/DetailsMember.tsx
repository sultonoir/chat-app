import React from "react";
import { ChevronDown, FileIcon, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@nextui-org/react";

interface DetailsMemberProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  name: string;
  etc?: string;
  admin?: boolean;
  sendAt?: Date;
  sender?: string | null;
  active?: boolean;
  fileUrl?: string | null;
  message?: string | null;
  sideList?: boolean;
  isLoading?: boolean;
}

const DetailsMember: React.FC<DetailsMemberProps> = ({
  imageUrl,
  name,
  admin,
  etc,
  sendAt,
  active,
  sender,
  fileUrl,
  message,
  className,
  sideList,
  isLoading,
  ...Props
}) => {
  const formatDateString = (dateString: Date | undefined | null) => {
    if (!dateString) {
      return null;
    }

    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
    };

    return new Intl.DateTimeFormat("id-ID", options).format(dateString);
  };

  const deteksiJenisFile = (namaFile: string) => {
    const ekstensi = namaFile.split(".").pop()?.toLowerCase();
    switch (ekstensi) {
      case "jpg":
      case "jpeg":
      case "png":
        return (
          <div className="flex flex-row flex-nowrap items-center">
            <p>{sender} : </p>

            <ImageIcon
              size={10}
              className="mx-1"
            />

            <p> send pictures</p>
          </div>
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
          <div className="flex flex-row flex-nowrap items-center">
            <p>{sender} : </p>

            <FileIcon
              size={10}
              className="mx-1"
            />

            <p> send documents</p>
          </div>
        );
      default:
        return "Tipe tidak dikenal";
    }
  };

  return (
    <div
      {...Props}
      className={cn(
        "flex flex-row h-[72px] w-full hover:bg-bs group cursor-pointer",
        className,
        `${active && "bg-[#233138]"}`,
        `${isLoading && "cursor-not-allowed opacity-50"}`
      )}
    >
      <div className="flex items-center px-4">
        <Avatar
          src={imageUrl}
          alt={name}
          size="md"
        />
      </div>
      <div
        className={`${
          sideList ? "border-b border-default-200 group-hover:border-none" : ""
        } flex min-w-0 grow basis-auto flex-col justify-center pr-3`}
      >
        <div className="flex items-center leading-normal">
          <div className="flex grow flex-wrap items-center break-words text-left font-normal capitalize leading-normal text-default-800">
            {name}
          </div>
          {admin && (
            <div className="ml-[6px] mt-[3px] max-w-[100%] text-ellipsis whitespace-nowrap text-xs leading-[14px] ">
              <div className="flex items-center rounded-sm bg-[#2a3942] px-[5px] py-[1.5px]">
                Admin Group
              </div>
            </div>
          )}
          {sendAt && (
            <div className="ml-[6px] mt-[3px] max-w-[100%] text-ellipsis whitespace-nowrap text-xs leading-[14px] ">
              <div className="flex items-center rounded-sm px-[5px] py-[1.5px] dark:text-[#8696a0]">
                {formatDateString(sendAt)}
              </div>
            </div>
          )}
        </div>
        <div className="mt-[-4px] flex min-h-[20px] w-full justify-between overflow-x-hidden text-sm">
          {etc && (
            <div className="max-w-xs grow truncate font-normal leading-5 dark:text-[#8696a0]">
              {etc}
            </div>
          )}
          {sender && fileUrl && (
            <div className="max-w-xs grow truncate font-normal leading-5 dark:text-[#8696a0]">
              {deteksiJenisFile(fileUrl)}
            </div>
          )}
          {sender && message && (
            <div className="w-full max-w-xs grow truncate font-normal leading-5 dark:text-[#8696a0]">
              {sender}: {message}
            </div>
          )}
          <div className="translate-x-24 transition-all duration-300 group-hover:translate-x-0">
            <ChevronDown size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsMember;
