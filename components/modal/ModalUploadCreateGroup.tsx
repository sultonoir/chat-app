import React, { useCallback, useState } from "react";

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
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/utils";
import { AiFillCamera } from "react-icons/ai";
import { UsersIcon } from "lucide-react";

interface Props {
  imageUrl: string;
  onChange: (value: string) => void;
}

export default function ModalUploadCreateGroup({ imageUrl, onChange }: Props) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  // state
  const [image, setImage] = useState("");
  const [rotation, setRotation] = useState<number>(0);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);

  // croped
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  // handle coroped
  const onCropComplete = useCallback(
    (
      croppedArea: unknown,
      croppedAreaPixels: React.SetStateAction<{
        x: number;
        y: number;
        width: number;
        height: number;
      } | null>
    ) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  //* handle upload image

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const showCroppedImage = async () => {
    setIsLoading(true);
    try {
      if (croppedAreaPixels) {
        const croppedImage = await getCroppedImg(
          image,
          croppedAreaPixels,
          rotation
        );
        onChange(croppedImage ?? "");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <>
      <div
        onClick={onOpen}
        className={`group relative mt-5 flex cursor-pointer items-center justify-center`}
      >
        <div className="absolute z-50 flex h-[210px] w-[210px] items-center justify-center rounded-full bg-default-100/30 opacity-0 backdrop-blur-[1px] transition-all group-hover:opacity-100">
          <div className="mx-auto flex flex-col items-center justify-center">
            <AiFillCamera size={30} />
            Change Image
          </div>
        </div>
        <div className="relative mx-auto flex h-52 w-52 cursor-pointer items-center justify-center rounded-full">
          {imageUrl !== "" ? (
            <Image
              src={imageUrl}
              width={200}
              height={200}
              alt="create Group"
              radius="full"
            />
          ) : (
            <UsersIcon
              size={52}
              className="transition-all group-hover:hidden"
            />
          )}
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="3xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                upload image
              </ModalHeader>
              <ModalBody>
                <div className={`${!image ? "hidden" : "block"} relative`}>
                  <div className="crop-container">
                    <Cropper
                      image={image || ""}
                      crop={crop}
                      zoom={zoom}
                      rotation={rotation}
                      zoomSpeed={0.1}
                      maxZoom={3}
                      zoomWithScroll={true}
                      showGrid={true}
                      aspect={1}
                      onCropChange={setCrop}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                      onRotationChange={setRotation}
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <label
                  htmlFor="upload"
                  className="flex w-full cursor-pointer items-center justify-center rounded-lg border border-primary-500"
                >
                  Upload image
                </label>
                <input
                  id="upload"
                  type="file"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  color="primary"
                  isLoading={isLoading}
                  isDisabled={isLoading}
                  onClick={showCroppedImage}
                >
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
