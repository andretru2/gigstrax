"use client";

import { create } from "@/app/_actions/client";

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

interface ClientFormFastProps {
  onSuccess?: (newClientId: string) => void;
  goto?: boolean;
}

export default function ClientCreate(props: ClientFormFastProps) {
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
        onSubmit={void form.handleSubmit(onSubmit)}
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
            <div className="flex flex-col items-center gap-2">
              <Icons.spinner
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
              <div className="opacity-75">Submitting...</div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Icons.chevronRight className="mr-2 h-4 w-4" />
              Submit
              <span className="sr-only">Submit</span>
            </div>
          )}
        </Button>
      </form>
    </Form>
  );
}
