"use client";

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
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@nextui-org/react";
import Register from "./Register";
import { BsGithub } from "react-icons/bs";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().min(2, {
    message: "email must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "password must be at least 8 characters",
  }),
});

const LoginForm = () => {
  const router = useRouter();
  const [login, setlogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    })
      .then((callback) => {
        if (callback?.ok) {
          router.refresh();
        }
        if (callback?.error) {
          toast.error(callback.error);
        }
      })
      .catch((e) => {})
      .finally(() => {
        form.reset();
        setIsLoading(false);
      });
  }

  const toggle = () => {
    setlogin(!login);
  };

  return (
    <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="flex w-full max-w-md basis-1/2 flex-col gap-y-4 border border-border p-5">
        <div className="grid grid-cols-2 gap-6">
          <Button
            color="primary"
            variant="light"
            onClick={() => signIn("github")}
            startContent={<BsGithub />}
          >
            Github
          </Button>
          <Button
            className="hover:text-white"
            color="primary"
            variant="light"
          >
            Google
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-default-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        {login ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-y-3"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        color="primary"
                        variant="underlined"
                        disabled={isLoading}
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
                        variant="underlined"
                        disabled={isLoading}
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
                disabled={isLoading}
                isLoading={isLoading}
                type="submit"
                color="primary"
                className="hover:bg-primary/80"
              >
                Submit
              </Button>
            </form>
          </Form>
        ) : (
          <Register />
        )}
        <div className="mt-4 text-center font-light text-white/80">
          <div className="flex flex-row items-center justify-center gap-2">
            {login ? (
              <>
                <div>First time using KyOuka ?</div>
                <div
                  onClick={toggle}
                  className="cursor-pointer text-primary-500 hover:underline"
                >
                  Create an account
                </div>
              </>
            ) : (
              <>
                <div>All ready have an account ?</div>
                <div
                  onClick={toggle}
                  className="cursor-pointer text-primary-500 hover:underline"
                >
                  Log in
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
