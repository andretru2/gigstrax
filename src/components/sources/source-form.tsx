"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { sourceSchema } from "@/lib/validations/source";
import { type SourceProps } from "@/server/db";
import { Prisma, Gender, SourceStatus } from "@prisma/client";

import {
  catchError,
  cn,
  formatDate,
  formatTime,
  fromUTC,
  toUTC,
  // duration,
  formatPrice,
  calculateTimeDifference,
  formatPhone,
} from "@/lib/utils";
import { type FocusEvent, useState } from "react";

import type * as z from "zod";

// import { type z } from "zod";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/icons";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";

import {
  Command,
  // CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";

import { update } from "@/app/_actions/source";
import SourceCreate from "./source-create";

export default function SourceForm(props: SourceProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    id,
    role,
    nameFirst,
    nameLast,
    email,
    addressCity,
    addressState,
    addressStreet,
    addressZip,
    notes,
    createdAt,
    updatedAt,
    createdBy,
    dob,
    updatedBy,
    status,

    entity,

    phone,
    resource,
    website,
    ssn,
    videoUrl,
    gender,
    costume,
  } = props;

  console.log(props);

  const form = useForm<z.infer<typeof sourceSchema>>({
    resolver: zodResolver(sourceSchema),
    mode: "onBlur",
    defaultValues: {
      addressCity: addressCity ? addressCity : undefined,
      addressState: addressState ? addressState : undefined,
      addressStreet: addressStreet ? addressStreet : undefined,
      addressZip: addressZip ? addressZip : undefined,
      role: role ? role : undefined,
      nameFirst: nameFirst ? nameFirst : undefined,
      nameLast: nameLast ? nameLast : undefined,
      email: email ? email : undefined,
      id: id ? id : undefined,
      notes: notes ? notes : undefined,
      phone: phone ? phone : undefined,
      dob: dob ? dob : undefined,
      entity: entity ? entity : undefined,
      createdAt: createdAt ? createdAt : undefined,
      updatedAt: updatedAt ? updatedAt : undefined,
      createdBy: createdBy ? createdBy : undefined,
      updatedBy: updatedBy ? updatedBy : undefined,
      status: status ? status : undefined,
      resource: resource ? resource : undefined,
      website: website ? website : undefined,
      ssn: ssn ? ssn : undefined,
      videoUrl: videoUrl ? videoUrl : undefined,
      gender: gender ? gender : undefined,
      costume: costume ? costume : undefined,
    },
  });

  return (
    <Form {...form}>
      <form
        className="grid w-full   gap-4  "
        // onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <Card className=" p-4">
          <CardHeader className="px-0">
            <CardTitle>Source Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-6 items-end gap-4 px-0">
            <FormField
              control={form.control}
              name="nameFirst"
              render={({ field }) => (
                <FormItem className="col-span-6 flex flex-col ">
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      className="bg-white"
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void update({
                          id: id,
                          nameFirst: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  {/* <UncontrolledFormMessage
                    message={form.formState.errors.price?.message}
                  /> */}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nameLast"
              render={({ field }) => (
                <FormItem className="col-span-6 flex flex-col ">
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white"
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void update({
                          id: id,
                          nameLast: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  {/* <UncontrolledFormMessage
                    message={form.formState.errors.source?.contact?.message}
                  /> */}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="col-span-2 flex flex-col ">
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      className="bg-white "
                      placeholder="xxx-xxx-xxxx"
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void update({
                          id: id,
                          phone: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  {/* <UncontrolledFormMessage
                    message={form.formState.errors.source?.phoneCell?.message}
                  /> */}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="col-span-2 flex flex-col ">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white "
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void update({
                          id: id,
                          email: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  {/* <UncontrolledFormMessage
                    message={
                      form.formState.errors.source?.addressState?.message
                    }
                  /> */}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="col-span-2 w-full ">
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value: Gender) => {
                        field.onChange(value);
                        void update({
                          id: id,
                          gender: value,
                        });
                      }}
                    >
                      <SelectTrigger className="bg-white capitalize">
                        <SelectValue placeholder={field.value} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {Object.values(Gender).map((option) => (
                            <SelectItem
                              key={option}
                              value={option}
                              className="capitalize"
                            >
                              {option}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="col-span-6 flex flex-col ">
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white "
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void update({
                          id: id,
                          role: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  {/* <UncontrolledFormMessage
                    message={form.formState.errors.source?.email?.message}
                  /> */}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ssn"
              render={({ field }) => (
                <FormItem className="col-span-6 flex flex-col ">
                  <FormLabel>SSN</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white "
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void update({
                          id: id,
                          ssn: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  {/* <UncontrolledFormMessage
                    message={form.formState.errors.source?.email?.message}
                  /> */}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="col-span-2 w-full ">
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value: SourceStatus) => {
                        field.onChange(value);
                        void update({
                          id: id,
                          status: value,
                        });
                      }}
                    >
                      <SelectTrigger className="bg-white capitalize">
                        <SelectValue placeholder={field.value} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {Object.values(SourceStatus).map((option) => (
                            <SelectItem
                              key={option}
                              value={option}
                              className="capitalize"
                            >
                              {option}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gigMastersAccount"
              render={({ field }) => (
                <FormItem className="col-span-6 flex flex-col ">
                  <FormLabel>Gig Masters Account</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white "
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void update({
                          id: id,
                          gigMastersAccount: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  {/* <UncontrolledFormMessage
                    message={form.formState.errors.source?.email?.message}
                  /> */}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="videoUrl"
              render={({ field }) => (
                <FormItem className="col-span-6 flex flex-col ">
                  <FormLabel>Video Url</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white "
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void update({
                          id: id,
                          videoUrl: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  {/* <UncontrolledFormMessage
                    message={form.formState.errors.source?.email?.message}
                  /> */}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem className="col-span-6 flex flex-col ">
                  <FormLabel>website</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white "
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void update({
                          id: id,
                          website: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  {/* <UncontrolledFormMessage
                    message={form.formState.errors.source?.email?.message}
                  /> */}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="costume"
              render={({ field }) => (
                <FormItem className="col-span-6 flex flex-col ">
                  <FormLabel>Costume</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white "
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void update({
                          id: id,
                          costume: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  {/* <UncontrolledFormMessage
                    message={form.formState.errors.source?.email?.message}
                  /> */}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addressStreet"
              render={({ field }) => (
                <FormItem className="col-span-6 flex flex-col ">
                  <FormLabel>Street</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white "
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void update({
                          id: id,
                          addressStreet: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  {/* <UncontrolledFormMessage
                    message={
                      form.formState.errors.source?.addressStreet?.message
                    }
                  /> */}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="addressCity"
              render={({ field }) => (
                <FormItem className="col-span-2 flex flex-col ">
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white "
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void update({
                          id: id,
                          addressCity: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  {/* <UncontrolledFormMessage
                    message={form.formState.errors.source?.addressCity?.message}
                  /> */}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addressState"
              render={({ field }) => (
                <FormItem className="col-span-2 flex flex-col ">
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white "
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void update({
                          id: id,
                          addressState: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  {/* <UncontrolledFormMessage
                    message={
                      form.formState.errors.source?.addressState?.message
                    }
                  /> */}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addressZip"
              render={({ field }) => (
                <FormItem className="col-span-2 flex flex-col ">
                  <FormLabel>Zip</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white "
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void update({
                          id: id,
                          addressZip: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  {/* <UncontrolledFormMessage
                    message={form.formState.errors.source?.addressZip?.message}
                  /> */}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="col-span-6 flex flex-col ">
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="h-48 bg-white"
                      onBlur={(e: FocusEvent<HTMLTextAreaElement>) => {
                        void update({
                          id: id,
                          notes: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  {/* <UncontrolledFormMessage
                    message={form.formState.errors.source?.notes?.message}
                  /> */}
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
