import useProfileGroup from "@/hooks/useProfileGroup";
import { Button, Image, Input } from "@nextui-org/react";
import { User } from "@prisma/client";
import {
  CheckCircle,
  ChevronRightIcon,
  FileIcon,
  PenSquareIcon,
  XIcon,
} from "lucide-react";
import React, { useState } from "react";
import DetailsMember from "../details/DetailsMember";
import DetailsUser from "../details/DetailsUser";
import ModalUploadImageGroup from "../modal/ModaluploadImageGroup";
import { api } from "@/lib/api";

interface Props {
  user: User;
}

const ProfileGroup = ({ user }: Props) => {
  const profileGroup = useProfileGroup();
  const { data: group } = api.group.getGroup.useQuery({
    id: profileGroup.group?.id ?? "",
  });
  const [show, setShow] = useState(false);
  const [showDesc, setShowDesc] = useState(false);
  const [desc, setDesc] = useState(group?.desc ?? "");
  const [name, setName] = useState("");
  const member = group?.member.filter((e) => e.userId !== user.id);
  const media = group?.message.filter((e) => e.fileUrl);
  const admin = group?.userId === user.id;

  const ctx = api.useContext();
  const { mutate, isLoading } = api.group.updateGroup.useMutation({
    onSuccess: () => {
      ctx.group.getGroup.invalidate();
      setShow(!show);
    },
  });

  const { mutate: changeDesc, isLoading: loading } =
    api.group.updateGroup.useMutation({
      onSuccess: () => {
        ctx.group.getGroup.invalidate();
        setShowDesc(!showDesc);
      },
    });

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
            className="flex h-[56px] cursor-pointer flex-row items-center bg-bs py-3 pl-3"
          >
            <XIcon size={30} />
            <p>Profile</p>
          </div>
          <div
            id="chat"
            className="flex grow flex-col gap-y-5 overflow-y-auto "
          >
            <div className="flex flex-col items-center justify-between gap-y-5 bg-bgsearch py-5">
              <ModalUploadImageGroup
                imageUrl={group?.image ?? ""}
                admin={user.id === group?.userId}
                groupId={group?.id ?? ""}
              />
              <div className="group flex items-center justify-center gap-x-2">
                {show ? (
                  <>
                    <Input
                      variant="underlined"
                      color="primary"
                      value={name}
                      onValueChange={setName}
                    />
                    <Button
                      isLoading={isLoading}
                      disabled={isLoading}
                      isIconOnly
                      size="sm"
                      onPress={() =>
                        mutate({
                          groupId: group?.id ?? "",
                          name,
                        })
                      }
                    >
                      <CheckCircle
                        size={14}
                        className={`${isLoading && "hidden"}`}
                      />
                    </Button>
                  </>
                ) : (
                  <h3 className="text-2xl">{group?.name}</h3>
                )}
                {admin && (
                  <Button
                    isIconOnly
                    onPress={() => setShow(!show)}
                    size="sm"
                    variant="solid"
                    className={`${show && "hidden"}`}
                  >
                    <PenSquareIcon size={14} />
                  </Button>
                )}
              </div>
              <p>
                Group <span>{group?.member.length}</span> member
              </p>
            </div>
            <div className="w-full bg-bgsearch py-2 pl-7 pr-2">
              <div className="flex w-full items-center justify-between">
                {showDesc ? (
                  <div className="flex w-full items-center justify-between">
                    <textarea
                      disabled={isLoading}
                      id="chat"
                      rows={1}
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      className="mr-2 block w-full resize-none rounded-lg border border-gray-300 bg-white p-2.5 text-sm focus:ring-transparent focus-visible:outline-none focus-visible:ring-transparent focus-visible:ring-offset-0 dark:border-gray-600 dark:bg-default md:pl-4 md:pr-12"
                      placeholder="Your message..."
                    />
                    <Button
                      isLoading={loading}
                      disabled={loading}
                      isIconOnly
                      size="sm"
                      onPress={() =>
                        changeDesc({
                          groupId: group?.id ?? "",
                          desc,
                        })
                      }
                    >
                      <CheckCircle
                        size={14}
                        className={`${loading && "hidden"}`}
                      />
                    </Button>
                  </div>
                ) : (
                  <h3 className="text-medium">{group?.desc}</h3>
                )}
                {admin && (
                  <Button
                    isIconOnly
                    onPress={() => setShowDesc(!showDesc)}
                    size="sm"
                    variant="solid"
                    className={`${showDesc && "hidden"}`}
                  >
                    <PenSquareIcon size={14} />
                  </Button>
                )}
              </div>

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
                <p className="text-base">{group?.member.length} Member</p>
              </div>
              <DetailsMember
                imageUrl={user.image ?? ""}
                name="Me"
                etc={user.status ?? ""}
                admin={admin}
              />
              {member?.map((item) => (
                <DetailsUser
                  key={item.id}
                  currentUserId={user.id}
                  userId={item.userId}
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
