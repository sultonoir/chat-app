/* eslint-disable tailwindcss/enforces-negative-arbitrary-values */
/* eslint-disable tailwindcss/no-custom-classname */
"use client";
import { ArrowLeft, UsersIcon } from "lucide-react";
import React, { type ChangeEvent, useState } from "react";
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
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { api } from "@/lib/api";

import useCreateGroup from "@/hooks/useCreateGroup";
import { toast } from "sonner";
import { Button, Input } from "@nextui-org/react";
import Image from "next/image";

const formSchema = z.object({
  image_url: z.string(),
  name: z.string().min(1),
  desc: z.string().min(1).optional(),
});

const CreateGroup = () => {
  const [files, setFiles] = useState<File[]>([]);
  const group = useCreateGroup();
  const { startUpload } = useUploadThing("media");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image_url: "",
      name: "",
      desc: "",
    },
  });

  const ctx = api.useContext();
  const { mutate, isLoading } = api.group.createGroup.useMutation({
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
    const blob = values.image_url;
    const hasImageChanged = isBase64Image(blob);
    if (hasImageChanged) {
      const imgRes = await startUpload(files);

      if (imgRes && imgRes[0].url) {
        values.image_url = imgRes[0].url;
      }
    }
    mutate({
      name: values.name,
      image: values.image_url,
      desc: values.desc,
    });
  };

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes("image")) return;

      fileReader.onload = (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  return (
    <>
      {group.isOpen && (
        <div className="absolute top-0 z-10 h-screen w-full  flex-col gap-y-5 overflow-hidden bg-bgsearch">
          <div className="h-28 bg-bgchat p-5">
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
                    <FormLabel className="relative mx-auto flex h-52 w-52 cursor-pointer items-center justify-center rounded-full bg-default">
                      {field.value ? (
                        <Image
                          src={field.value}
                          width={200}
                          height={200}
                          alt="create Group"
                          className="h-52 w-52 rounded-full object-cover"
                        />
                      ) : (
                        <UsersIcon className="h-36 w-36" />
                      )}
                    </FormLabel>
                    <FormControl className=" mx-auto flex-1 text-gray-200">
                      <input
                        className="focus:shadow-te-primary relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] font-normal leading-[2.15] text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:outline-none dark:border-default-100 dark:text-neutral-200 dark:file:bg-default-100 dark:file:text-neutral-100 dark:focus:border-primary"
                        id="formFileLg"
                        onChange={(e) => handleImage(e, field.onChange)}
                        type="file"
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
                        className="m-0 min-h-0 w-full resize-none rounded-lg border-0 bg-default-100 pl-3 pr-10 focus:ring-transparent focus-visible:outline-none
                        focus-visible:ring-transparent focus-visible:ring-offset-0 md:pl-4 md:pr-12"
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
