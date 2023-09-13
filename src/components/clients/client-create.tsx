"use client";

import { checkIfExists, create } from "@/app/_actions/client";

import { useTransition, useState } from "react";
import { type ClientProps } from "@/server/db";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { clientSchema } from "@/lib/validations/client";
import { useRouter } from "next/navigation";

import type * as z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UncontrolledFormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Icons } from "@/components/icons";

import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import { catchError } from "@/lib/utils";

interface ClientCreateProps {
  onSuccess?: (newClientId: string) => void;
  goto?: boolean;
}

export default function ClientCreate(props: ClientCreateProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof clientSchema>>({
    resolver: zodResolver(clientSchema),
    mode: "onSubmit",
    defaultValues: {
      client: undefined,
    },
  });

  function onSubmit(data: z.infer<typeof clientSchema>) {
    startTransition(async () => {
      try {
        const exists = await checkIfExists(data.client);
        if (exists) {
          toast({ description: "Client already exists." });
          return;
        }

        const clientId = await create(data as ClientProps);

        props.onSuccess && props.onSuccess(clientId);

        if (props.goto) {
          router.push(`/dashboard/clients/${clientId}`);
        }
        toast({ description: "Client added successfully." });

        form.reset();
      } catch (err) {
        catchError(err);
      }
    });
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-3  "
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="client"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <FormControl>
                <Input placeholder="Client name " {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <div className="flex flex-row items-center gap-2">
              <Icons.spinner
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
              <div className="opacity-75">Creating...</div>
            </div>
          ) : (
            <div className="flex flex-row items-center gap-2">
              Next
              <Icons.chevronRight className="mr-2 h-4 w-4" />
              <span className="sr-only">Submit</span>
            </div>
          )}
        </Button>
      </form>
    </Form>
  );
}
