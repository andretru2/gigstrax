"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { clientSchema } from "@/lib/validations/client";
import { type ClientProps } from "@/server/db";
import { Prisma, ClientType } from "@prisma/client";

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
import { type FocusEvent, useState, useTransition, useEffect } from "react";

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

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { update } from "@/app/_actions/client";
import { useGigStore } from "@/app/_store/gig";

export default function ClientForm(props?: ClientProps) {
  const { client, setClient } = useGigStore();

  // if (props) setClient(props);

  const router = useRouter();

  // if (!client) return <>Please select a client</>;

  const {
    addressCity,
    addressState,
    addressStreet,
    addressZip,
    client: clientName,
    clientType,
    contact,
    email,
    id,
    notes,
    phoneCell,
    phoneLandline,
    source,
    createdAt,
    updatedAt,
    createdBy,
    updatedBy,
    status,
  } = (client as ClientProps) || props || {};

  const defaultValues = {
    addressCity: addressCity || undefined,
    addressState: addressState || undefined,
    addressStreet: addressStreet || undefined,
    addressZip: addressZip || undefined,
    client: clientName || undefined,
    clientType: clientType || undefined,
    contact: contact || undefined,
    email: email || undefined,
    id: id || undefined,
    notes: notes || undefined,
    phoneCell: phoneCell || undefined,
    phoneLandline: phoneLandline || undefined,
    source: source || undefined,
    createdAt: createdAt || undefined,
    updatedAt: updatedAt || undefined,
    createdBy: createdBy || undefined,
    updatedBy: updatedBy || undefined,
    status: status || undefined,
  };

  // // Remove properties with null or undefined values from the `defaultValues` object
  // const cleanedDefaultValues = Object.fromEntries(
  //   Object.entries(defaultValues).filter(
  //     ([_, value]) => value !== null && value !== undefined
  //   )
  // );

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // console.log("client form", client);
    form.reset(defaultValues);
    router.refresh();
    // props && setClient(props);
  }, [client]);

  const form = useForm<z.infer<typeof clientSchema>>({
    resolver: zodResolver(clientSchema),
    // progressive: true,
    mode: "onBlur",
    defaultValues: defaultValues,
  });

  return (
    <Form {...form}>
      <form
        className="grid w-full   max-w-4xl gap-2 "
        // onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <Card className=" p-4">
          <CardHeader className="px-0">
            <CardTitle>Client Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-6 items-end gap-2 px-0">
            <FormField
              control={form.control}
              disabled={!client}
              name="client"
              render={({ field }) => (
                <FormItem className="col-span-6 flex flex-col ">
                  <FormLabel>Client</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      className="bg-white"
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        startTransition(() => {
                          void update({
                            id: id,
                            client: e.target.value,
                          });
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
              name="contact"
              disabled={!client}
              render={({ field }) => (
                <FormItem className="col-span-6 flex flex-col ">
                  <FormLabel>Contact</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white"
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void update({
                          id: id,
                          contact: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  {/* <UncontrolledFormMessage
                    message={form.formState.errors.client?.contact?.message}
                  /> */}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneCell"
              disabled={!client}
              render={({ field }) => (
                <FormItem className="col-span-2 flex flex-col ">
                  <FormLabel>Cell</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      className="bg-white "
                      placeholder="xxx-xxx-xxxx"
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void update({
                          id: id,
                          phoneCell: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  {/* <UncontrolledFormMessage
                    message={form.formState.errors.client?.phoneCell?.message}
                  /> */}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneLandline"
              disabled={!client}
              render={({ field }) => (
                <FormItem className="col-span-2 flex flex-col ">
                  <FormLabel>Landline</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white "
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void update({
                          id: id,
                          phoneLandline: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  {/* <UncontrolledFormMessage
                    message={
                      form.formState.errors.client?.addressState?.message
                    }
                  /> */}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientType"
              disabled={!client}
              render={({ field }) => (
                <FormItem className="col-span-2 w-full ">
                  <FormLabel>Client Type</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value: ClientType) => {
                        field.onChange(value);
                        void update({
                          id: id,
                          clientType: value,
                        });
                      }}
                    >
                      <SelectTrigger className="bg-white capitalize">
                        <SelectValue placeholder={field.value} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {Object.values(ClientType).map((option) => (
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
              name="email"
              disabled={!client}
              render={({ field }) => (
                <FormItem className="col-span-6 flex flex-col ">
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
                    message={form.formState.errors.client?.email?.message}
                  /> */}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addressStreet"
              disabled={!client}
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
                      form.formState.errors.client?.addressStreet?.message
                    }
                  /> */}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="addressCity"
              disabled={!client}
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
                    message={form.formState.errors.client?.addressCity?.message}
                  /> */}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addressState"
              disabled={!client}
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
                      form.formState.errors.client?.addressState?.message
                    }
                  /> */}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addressZip"
              disabled={!client}
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
                    message={form.formState.errors.client?.addressZip?.message}
                  /> */}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              disabled={!client}
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
                    message={form.formState.errors.client?.notes?.message}
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
