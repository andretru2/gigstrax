"use client";

import { create, checkIfExists } from "@/app/_actions/client";

import { useTransition, useState } from "react";
import { type ClientProps } from "@/server/db";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { clientSchema } from "@/lib/validations/client";

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
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { ClientType } from "@prisma/client";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import { catchError } from "@/lib/utils";

interface ClientFormFastProps {
  onSuccess?: (newClientId: string) => void;
}

export default function ClientCreate(props: ClientFormFastProps) {
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
        setIsLoading(true);
        const clientId = await create(data as ClientProps);

        props.onSuccess && props.onSuccess(clientId);
        setIsLoading(false);

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
        <Button type="submit" disabled={false} isLoading={isLoading}>
          Create new client
        </Button>
      </form>
    </Form>
  );
}
