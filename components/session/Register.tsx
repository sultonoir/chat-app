"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button, Input } from "@nextui-org/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shared/form";
import { api } from "@/lib/api";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().min(2, {
    message: "email must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "password must be at least 8 characters",
  }),
  name: z.string(),
  userName: z.string(),
});

const Register = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      userName: "",
      name: "",
    },
  });

  const { mutate, isLoading } = api.postUser.useMutation({
    onSuccess: () => {
      toast.success("account created");
      form.reset();
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({
      email: values.email,
      name: values.name,
      password: values.password,
      username: values.userName,
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-[333px] flex-col gap-y-3"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  isDisabled={isLoading}
                  color="primary"
                  variant="underlined"
                  placeholder="Name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  isDisabled={isLoading}
                  color="primary"
                  variant="underlined"
                  placeholder="Username"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  color="primary"
                  isDisabled={isLoading}
                  variant="underlined"
                  placeholder="Email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  color="primary"
                  isDisabled={isLoading}
                  variant="underlined"
                  type="password"
                  placeholder="Password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          isDisabled={isLoading}
          isLoading={isLoading}
          type="submit"
          color="primary"
          className="hover:bg-primary/80"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default Register;
