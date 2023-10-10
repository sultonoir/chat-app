import useProfileGroup from "@/hooks/useProfileGroup";
import { Image } from "@nextui-org/react";
import { User } from "@prisma/client";
import { ChevronRightIcon, FileIcon, XIcon } from "lucide-react";
import React from "react";
import DetailsMember from "../details/DetailsMember";
import DetailsUser from "../details/DetailsUser";

interface Props {
  user: User;
}

const ProfileGroup = ({ user }: Props) => {
  const profileGroup = useProfileGroup();
  const media = profileGroup.group?.message.filter((e) => e.fileUrl);

  const member = profileGroup.group?.member.map((item) => ({
    id: item,
  }));

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
            width={50}
            height={50}
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
            <a
              href={namaFile}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-sm text-rose-500 hover:underline dark:text-rose-400"
            >
              <FileIcon className="h-10 w-10 fill-rose-200 stroke-rose-400" />
            </a>
          </div>
        );
      default:
        return "Tipe tidak dikenal";
    }
  }
  return (
    <>
      {profileGroup.isOpen && (
        <div className="relative flex basis-[30%] flex-col border-l border-default-200">
          <div
            onClick={profileGroup.onClose}
            className="flex h-[56px] cursor-pointer flex-row items-center bg-bgchat py-3 pl-3"
          >
            <XIcon size={30} />
            <p>Profile</p>
          </div>
          <div className="flex grow flex-col gap-y-5 overflow-y-auto ">
            <div className="flex flex-col items-center justify-between gap-y-5 bg-bgsearch py-5">
              <Image
                src={profileGroup.group?.image}
                alt={profileGroup.group?.name}
                width={200}
                height={200}
                radius="full"
              />
              <h3 className="text-2xl">{profileGroup.group?.name}</h3>
              <p>
                Group <span>{profileGroup.group?.member.length}</span> member
              </p>
            </div>
            <div className="w-full bg-bgsearch py-2 pl-7 pr-2">
              <div className="align-baseline">{profileGroup.group?.desc}</div>
              <div className="mt-2 flex justify-between dark:text-[#667781]">
                <h3 className="text-xs">Media, link,and dock</h3>
                <h3 className="mt-2 inline-flex w-full max-w-max text-xs">
                  {media?.length} <ChevronRightIcon size={15} />
                </h3>
              </div>
              <div className="relative flex flex-row gap-x-2">
                {media
                  ?.sort(
                    (a, b) =>
                      new Date(b.createdAt || new Date()).getTime() -
                      new Date(a.createdAt || new Date()).getTime()
                  ) // Urutkan berdasarkan waktu pembuatan
                  .slice(0, 4) // Ambil 4 elemen pertama
                  .map((item) => (
                    <div
                      key={item.id}
                      className="relative inline-flex h-20 w-20 items-center justify-center"
                    >
                      {deteksiJenisFile(item.fileUrl || "")}
                    </div>
                  ))}
              </div>
            </div>
            <div className="flex flex-col bg-bgsearch py-2">
              <div className="flex justify-between px-4">
                <p className="text-base">{member?.length} Member</p>
              </div>
              <DetailsMember
                imageUrl={user.image ?? ""}
                name="Me"
                etc={user.email ?? ""}
                admin={profileGroup.group?.isAdmin}
              />
              {member &&
                member.map((item) => (
                  <DetailsUser
                    currentUserId={user.id}
                    userId={item.id}
                    key={item.id}
                  />
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileGroup;
