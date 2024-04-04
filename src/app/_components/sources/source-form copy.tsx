"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { sourceSchema } from "@/lib/validations/source";
import { type SourceProps } from "@/server/db";
import { Gender, SourceStatus } from "@prisma/client";

import { type FocusEvent, useState, useTransition } from "react";

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { update } from "@/app/_actions/source";

export default function SourceForm(props: Partial<SourceProps>) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState();

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

  console.log("errors", form.formState.errors, errors);

  // const onBlur = (id, e) => {
  //   console.log("onblur", e.target.value, id);
  //   startTransition(async () => {
  //     console.log("errors", form.formState.errors, errors);

  //     try {
  //       if (form.formState.errors.phone?.message) {
  //         return false;
  //       }
  //       await update({
  //         id: id,
  //         phone: e.target.value, // Assuming 'data' is accessible here
  //       });

  //       // toast.success("Product updated successfully");
  //       // setFiles(null);
  //     } catch (err) {
  //       // catchError(err);
  //     }
  //   });
  // };

  return (
    <Form {...form}>
      <form
        className="grid w-full max-w-4xl  gap-2 "
        // onSubmit={(...args) => void form.handleSubmit(onBlur)(...args)}
        // onBlur={(...args) => void form.handleSubmit(onBlur)(...args)}
      >
        <Card className=" p-4">
          <CardHeader className="px-0">
            <CardTitle>Source Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-6 items-end gap-2 px-0">
            <FormField
              control={form.control}
              name="nameFirst"
              render={({ field }) => (
                <FormItem className="col-span-2 flex flex-col ">
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
                <FormItem className="col-span-2 flex flex-col ">
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
                      {...form.register("phone")}
                      className="bg-white "
                      placeholder="xxx-xxx-xxxx"
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void form.trigger(["phone"]);
                        void update({
                          id: id,
                          phone: e.target.value,
                        });
                        // handlePhoneBlur(id, e.target.value);
                      }}

                      // if (!form.formState.errors.phone?.message) {
                      //   console.log(
                      //     form.formState.errors.phone,
                      //     form.getFieldState("phone"),
                      //     "hpone errors"
                      //   );
                      //   void update({
                      //     id: id,
                      //     phone: e.target.value,
                      //   });
                      // }
                    />
                  </FormControl>
                  <FormMessage />

                  {/* <UncontrolledFormMessage
                    // message={form.formState.errors.source?.phone?.message}
                    message={form.formState.errors.phone?.message}
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
                      {...form.register("email")}
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void form.trigger(["email"]);

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
                <FormItem className="col-span-2 flex flex-col ">
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
                <FormItem className="col-span-2 flex flex-col ">
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
                <FormItem className="col-span-2 flex flex-col ">
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
                <FormItem className="col-span-2 flex flex-col ">
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
                <FormItem className="col-span-2 flex flex-col ">
                  <FormLabel>Website</FormLabel>
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
                <FormItem className="col-span-2 flex flex-col ">
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
