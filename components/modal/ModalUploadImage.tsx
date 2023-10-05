import React, { useCallback, useState } from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import Cropper from "react-easy-crop";
import { useUploadThing } from "@/lib/uploadthing";
import getCroppedImg from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function ModalUploadImage() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  // state
  const [image, setImage] = useState("");
  const [rotation, setRotation] = useState<number>(0);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);

  //  uploadthing
  const { startUpload } = useUploadThing("media");

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

  const ctx = api.useContext();
  const { mutate } = api.updatePhotoProfile.useMutation({
    onSuccess: () => {
      toast.success("upload success");
      ctx.invalidate();
      onClose();
    },
  });

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Menjalankan showCroppedImage untuk mendapatkan croppedImage
      let imgCrop;
      if (image && croppedAreaPixels) {
        const croppedImg = await getCroppedImg(
          image,
          croppedAreaPixels,
          rotation
        );
        imgCrop = croppedImg;
      }
      // Mendapatkan blob dari croppedImage
      const blob = await fetch(imgCrop as string).then((res) => res.blob());

      // Mendapatkan tipe MIME dari blob
      const mimeType = blob.type;

      // Membuat nama file berdasarkan tipe MIME
      const fileExtension = mimeType.split("/")[1];
      const fileName = `file_${Date.now()}.${fileExtension}`;

      // Membuat objek File dari blob dengan nama dan tipe otomatis
      const file = new File([blob], fileName, { type: mimeType });

      let imgUpload;
      const imgRes = await startUpload([file]);
      if (imgRes && imgRes[0].url) {
        imgUpload = imgRes[0].url;
      }
      mutate({
        image: imgUpload as string,
      });
    } catch (error) {
      throw new Error(`${String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onPress={onOpen}>Open Modal</Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
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
                  onClick={handleSubmit}
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
