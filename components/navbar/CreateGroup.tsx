"use client";
import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shared/form";
import { useForm } from "react-hook-form";
import { useUploadThing } from "@/lib/uploadthing";
import { api } from "@/lib/api";

import useCreateGroup from "@/hooks/useCreateGroup";
import { toast } from "sonner";
import { Button, Input } from "@nextui-org/react";
import ModalUploadCreateGroup from "../modal/ModalUploadCreateGroup";

const formSchema = z.object({
  image_url: z.string(),
  name: z.string().min(1),
  desc: z.string().min(1).optional(),
});

const CreateGroup = () => {
  const group = useCreateGroup();
  const { startUpload } = useUploadThing("media");
  const [isLoading, setisLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image_url: "",
      name: "",
      desc: "",
    },
  });

  const ctx = api.useContext();
  const { mutate } = api.group.createGroup.useMutation({
    onSuccess: () => {
      toast.success("Group created");
      form.reset();
      group.onClose();
      ctx.invalidate();
    },
    onError: (e) => {
      toast.error(e.message);
      form.reset();
      group.onClose();
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setisLoading(true);
    try {
      const blob = await fetch(values.image_url as string).then((res) =>
        res.blob()
      );

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
        name: values.name,
        image: imgUpload ?? "",
        desc: values.desc,
      });
    } catch (error) {
      toast.error(error as string);
    } finally {
      setisLoading(false);
    }
  };

  return (
    <>
      {group.isOpen && (
        <div className="absolute top-0 z-10 h-screen w-full  flex-col gap-y-5 overflow-hidden bg-bgsearch">
          <div className="h-28 bg-bs p-5">
            <div className="flex h-full w-full flex-row items-end">
              <div className="flex flex-row items-center justify-center gap-x-3">
                <ArrowLeft
                  onClick={group.onClose}
                  className="cursor-pointer"
                />
                <p className="text-2xl">Create group</p>
              </div>
            </div>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-5 flex flex-col gap-y-3 px-5"
            >
              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormControl className=" mx-auto flex-1 text-gray-200">
                      <ModalUploadCreateGroup
                        imageUrl={field.value}
                        onChange={(value) => form.setValue("image_url", value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        type="text"
                        placeholder="Name group"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="desc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <textarea
                        className="block w-full resize-none rounded-lg border border-gray-300 bg-white p-2.5 text-sm focus:ring-transparent focus-visible:outline-none focus-visible:ring-transparent focus-visible:ring-offset-0 dark:border-gray-600 dark:bg-default-100 md:pr-12"
                        disabled={isLoading}
                        placeholder="description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={isLoading}
                isLoading={isLoading}
                type="submit"
              >
                Submit
              </Button>
            </form>
          </Form>
        </div>
      )}
    </>
  );
};

export default CreateGroup;
