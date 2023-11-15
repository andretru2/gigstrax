"use client";

import { checkIfExists, create } from "@/app/_actions/source";

import { useTransition, useState, useEffect } from "react";
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

interface SourceCreateProps {
  onSuccess?: (newSourceId: string, role?: string) => void;
  goto?: boolean;
  role?: "RBS" | "Mrs";
}

export default function SourceCreate(props: SourceCreateProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof sourceSchema>>({
    resolver: zodResolver(sourceSchema),
    mode: "onSubmit",
    defaultValues: {
      nameFirst: undefined,
      nameLast: undefined,
      role: undefined,
      status: "Active",
    },
  });

  const { watch } = form;
  const nameFirst = watch("nameFirst");

  useEffect(() => {
    if (nameFirst && props.role) {
      form.setValue("role", `${props.role} ${nameFirst}`);
    }
  }, [nameFirst, form, props.role]);

  function onSubmit(data: z.infer<typeof sourceSchema>) {
    startTransition(async () => {
      try {
        data.status = "Active";
        const exists = await checkIfExists({
          nameFirst: data.nameFirst ?? "",
          nameLast: data.nameLast ?? "",
        });
        if (exists) {
          toast({ description: "Source already exists." });
          return;
        }
        const sourceId = await create(data as SourceProps);
        props.onSuccess && props.onSuccess(sourceId, data.role);
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
        className="flex w-full flex-col gap-3  "
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="nameFirst"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <UncontrolledFormMessage>
                {form.formState.errors.nameFirst?.message}
              </UncontrolledFormMessage>
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
                <Input {...field} />
              </FormControl>
              <UncontrolledFormMessage>
                {form.formState.errors.nameLast?.message}
              </UncontrolledFormMessage>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        {props.role && (
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role ({props.role})</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <UncontrolledFormMessage>
                  {form.formState.errors.role?.message}
                </UncontrolledFormMessage>
                {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
        )}
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

// export function SantaCreate(props: SourceCreateProps) {
//   const router = useRouter();
//   const [isPending, startTransition] = useTransition();
//   const form = useForm<z.infer<typeof sourceSchema>>({
//     resolver: zodResolver(sourceSchema),
//     mode: "onSubmit",
//     defaultValues: {
//       nameFirst: undefined,
//       nameLast: undefined,
//       role: undefined,
//     },
//   });

//   function onSubmit(data: z.infer<typeof sourceSchema>) {
//     startTransition(async () => {
//       try {
//         console.log(data);
//         // const exists = await checkIfExists({
//         //   nameFirst: data.nameFirst ?? "",
//         //   nameLast: data.nameLast ?? "",
//         // });
//         // console.log("exists", exists);
//         // if (exists) {
//         //   toast({ description: "Source already exists." });
//         //   return;
//         // }

//         const sourceId = await create(data as SourceProps);

//         props.onSuccess && props.onSuccess(sourceId);

//         if (props.goto) {
//           router.push(`/dashboard/sources/${sourceId}`);
//         }
//         toast({ description: "Santa added successfully." });

//         form.reset();
//       } catch (err) {
//         catchError(err);
//       }
//     });
//   }

//   return (
//     <Form {...form}>
//       <form
//         className="flex flex-col gap-3  "
//         onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
//       >
//         <FormField
//           control={form.control}
//           name="nameFirst"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>First Name</FormLabel>
//               <FormControl>
//                 <Input {...field} />
//               </FormControl>
//               <UncontrolledFormMessage>
//                 {form.formState.errors.nameFirst?.message}
//               </UncontrolledFormMessage>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="nameLast"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Last Name</FormLabel>
//               <FormControl>
//                 <Input {...field} />
//               </FormControl>
//               <UncontrolledFormMessage>
//                 {form.formState.errors.nameLast?.message}
//               </UncontrolledFormMessage>

//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="role"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Role (RBS...)</FormLabel>
//               <FormControl>
//                 <Input {...field} />
//               </FormControl>
//               <UncontrolledFormMessage>
//                 {form.formState.errors.role?.message}
//               </UncontrolledFormMessage>
//               {/* <FormDescription>
//                 This is your public display name.
//               </FormDescription> */}
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <Button type="submit" disabled={isPending}>
//           {isPending ? (
//             <div className="flex flex-row items-center gap-2">
//               <Icons.spinner
//                 className="mr-2 h-4 w-4 animate-spin"
//                 aria-hidden="true"
//               />
//               <div className="opacity-75">Creating...</div>
//             </div>
//           ) : (
//             <div className="flex flex-row items-center gap-2">
//               Next
//               <Icons.chevronRight className="mr-2 h-4 w-4" />
//               <span className="sr-only">Submit</span>
//             </div>
//           )}
//         </Button>
//       </form>
//     </Form>
//   );
// }
