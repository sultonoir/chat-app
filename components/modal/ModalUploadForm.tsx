import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Image,
} from "@nextui-org/react";
import { FileIcon, PlusIcon, XIcon } from "lucide-react";
import { api } from "@/lib/api";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";

interface Props {
  groupId?: string;
  userId: string;
  isChat?: boolean;
}

export default function ModalUploadForm({ groupId, userId, isChat }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [file, setFile] = useState<File | null>(null);
  const [chat, setChat] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const uploadedFile = e.target.files[0];
      setFile(uploadedFile);
      setFiles(Array.from(e.target.files));
      fileReader.readAsDataURL(file);
    }
  };

  const clearFile = () => {
    setFile(null);
  };

  const { startUpload } = useUploadThing("media");

  const ctx = api.useContext();
  const { mutate } = api.group.createMessage.useMutation({
    onSuccess: () => {
      ctx.group.getGroup.invalidate();
      setChat("");
      onClose();
      setFile(null);
    },
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const uploadthing = await startUpload(files);
      mutate({
        groupId: groupId ?? "",
        content: chat,
        userId,
        fileUrl: uploadthing?.[0].url,
      });
    } catch (error) {
      toast.error(error as string);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Button
        isIconOnly
        onPress={onOpen}
        variant="light"
        color="primary"
        radius="full"
      >
        <PlusIcon />
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        classNames={{
          base: "bg-bs",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
          <ModalBody>
            {file && (
              <div className="relative mt-2 flex items-center rounded-md p-2">
                {file.name.endsWith(".pdf") ? (
                  <>
                    <FileIcon className="h-10 w-10 fill-primary-800 stroke-primary" />
                    <a
                      href={URL.createObjectURL(file)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-sm text-indigo-500 hover:underline dark:text-primary-400"
                    >
                      {file.name}
                    </a>
                  </>
                ) : (
                  <Image
                    src={URL.createObjectURL(file)}
                    alt="image"
                  />
                )}
                <button
                  onClick={clearFile}
                  className="absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-white shadow-sm"
                  type="button"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            )}
            <input
              className="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] font-normal leading-[2.15] text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:my-[-0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-primary focus:outline-none dark:border-default-100 dark:text-neutral-200 dark:file:bg-default-100 dark:file:text-neutral-100 dark:focus:border-primary"
              id="formFileLg"
              type="file"
              onChange={handleImageUpload}
            />
            <textarea
              disabled={isLoading}
              id="chat"
              rows={1}
              value={chat}
              onChange={(e) => setChat(e.target.value)}
              className="block w-full resize-none rounded-lg border border-gray-300 bg-white p-2.5 text-sm focus:ring-transparent focus-visible:outline-none focus-visible:ring-transparent focus-visible:ring-offset-0 dark:border-gray-600 dark:bg-default-100 md:pl-4 md:pr-12"
              placeholder="Your message..."
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onPress={handleSubmit}
              disabled={isLoading}
              isLoading={isLoading}
            >
              Action
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
