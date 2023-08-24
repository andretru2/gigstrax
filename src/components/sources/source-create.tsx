"use client";

import { create } from "@/app/_actions/source";

import { useTransition, useState } from "react";
import { type SourceProps } from "@/server/db";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { sourceSchema } from "@/lib/validations/source";
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

interface SourceFormFastProps {
  onSuccess?: (newSourceId: string) => void;
  goto?: boolean;
}

export default function SourceCreate(props: SourceFormFastProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof sourceSchema>>({
    resolver: zodResolver(sourceSchema),
    mode: "onSubmit",
    defaultValues: {
      nameFirst: "",
      nameLast: "",
    },
  });

  function onSubmit(data: z.infer<typeof sourceSchema>) {
    startTransition(async () => {
      try {
        setIsLoading(true);
        const sourceId = await create(data as SourceProps);

        props.onSuccess && props.onSuccess(sourceId);
        setIsLoading(false);

        if (props.goto) {
          router.push(`/dashboard/sources/${sourceId}`);
        }
        toast({ description: "Source added successfully." });

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
          name="nameFirst"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="Source name " {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nameLast"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Source's last " {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={false}
          isLoading={isLoading}
          className="flex flex-row items-center"
        >
          <Icons.add className="mr-2 h-4 w-4" />
          Create new Source
        </Button>
      </form>
    </Form>
  );
}
