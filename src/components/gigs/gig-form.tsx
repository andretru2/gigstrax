"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { gigSchema } from "@/lib/validations/gig";
import {
  type GigProps,
  type SourceProps,
  type ClientProps,
  type VenueTypeProps,
} from "@/server/db";
import { PrismaClient, Prisma } from "@prisma/client";

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

import { update } from "@/app/_actions/gig";

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
import { Popover, PopoverTrigger } from "../ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { Calendar } from "../ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { ClientType } from "@prisma/client";
// import { getSantas } from "@/app/_actions/source";
import {
  type SantaProps,
  type MrsSantaProps,
  type ClientPickerProps,
} from "@/types/index";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";

type GigFormProps = Partial<GigProps> & {
  client: Partial<ClientProps>;
  santa?: Pick<SourceProps, "id" | "role">;
  mrsSanta?: Pick<SourceProps, "id" | "nameFirst">;
};

// interface Props {
//   gig: Partial<GigProps> &
//     Partial<Omit<ClientProps, "client">> &
//     Partial<SourceProps>;
//   santas: SantaProps[];
//   mrsSantas?: MrsSantaProps[];
//   clients: ClientPickerProps[];
// }

interface Props {
  gig: GigFormProps;
  santas: SantaProps[];
  mrsSantas?: MrsSantaProps[];
  clients: ClientPickerProps[];
  // venueTypes: VenueTypeProps[];
}

export default function GigForm({
  gig,
  santas,
  mrsSantas,
  clients,
  ...props
}: Props) {
  const router = useRouter();
  // const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const {
    id,
    gigDate,
    timeStart,
    timeEnd,
    amountPaid,
    venueAddressCity,
    venueAddressName,
    venueAddressState,
    venueAddressStreet,
    venueAddressZip,
    venueType,
    notesVenue,
    price,
    client,
    santa,
    mrsSanta,
  } = gig;
  const {
    source: clientSource,
    phoneCell,
    phoneLandline,
    addressCity,
    addressStreet,
    addressZip,
    addressState,
    email,
    id: clientId,
    client: clientName,
    clientType,
    notes,
    contact,
  } = client;
  const { id: santaId, role } = santa ?? {};
  const { id: mrsSantaId, nameFirst } = mrsSanta ?? {};

  const durationHours =
    timeStart && timeEnd ? calculateTimeDifference(timeStart, timeEnd) : null;

  const balance =
    price && amountPaid ? Number(price) - Number(amountPaid) : null;

  // const phoneCellFormatted = {
  //   if (!phoneCell) return undefined
  //    switch(
  //   case(
  //  phoneCell && phoneCell.replace(/\D/g, "").length === 10
  // ? formatPhone(phoneCell)
  // : undefined;

  //   )
  // )
  // }

  const form = useForm<z.infer<typeof gigSchema>>({
    resolver: zodResolver(gigSchema),
    mode: "onBlur",
    defaultValues: {
      gigDate: gigDate ? gigDate : undefined,
      timeStart: timeStart ? timeStart?.toTimeString().slice(0, 5) : undefined,
      timeEnd: timeEnd ? timeEnd?.toTimeString().slice(0, 5) : undefined,
      venueAddressCity: venueAddressCity ? venueAddressCity : undefined,
      venueAddressState: venueAddressState ? venueAddressState : undefined,
      venueAddressStreet: venueAddressStreet ? venueAddressStreet : undefined,
      venueAddressName: venueAddressName ? venueAddressName : undefined,
      venueAddressZip: venueAddressZip ? venueAddressZip : undefined,
      venueType: venueType ? venueType : undefined,
      notesVenue: notesVenue ? notesVenue : undefined,
      price: price ? Number(price) : undefined,
      amountPaid: amountPaid ? Number(amountPaid) : undefined,

      client: {
        id: clientId ? clientId : undefined,
        client: clientName ? clientName : undefined,
        clientType: clientType ? clientType : undefined,
        contact: contact ? contact : undefined,
        source: clientSource ? clientSource : undefined,
        phoneCell: phoneCell ? phoneCell : undefined,
        phoneLandline: phoneLandline ? phoneLandline : undefined,
        addressCity: addressCity ? addressCity : undefined,
        addressStreet: addressStreet ? addressStreet : undefined,
        addressState: addressState ? addressState : undefined,
        addressZip: addressZip ? addressZip : undefined,
        email: email ? email : undefined,
        notes: notes ? notes : undefined,
      },
      santa: {
        id: santaId ? santaId : undefined,
        role: role ? role : undefined,
      },
      mrsSanta: {
        id: mrsSantaId ? mrsSantaId : undefined,
        nameFirst: nameFirst ? nameFirst : undefined,
      },
    },
  });

  // async function handleTimeChange(time: Date) {
  //   const dateTime = gig.gigDate && new Date(gig.gigDate.getTime());
  //   time &&
  //     dateTime &&
  //     dateTime.setHours(time.getHours(), time.getMinutes(), time.getSeconds());

  //   // dateTime && ;
  //   console.log("time", time, dateTime, dateTime.toUTCString());
  //   const data = await update({
  //     id: gig.id,
  //     timeStart: time,
  //   });

  //   console.log("handle change", data);
  // }

  return (
    <Form {...form}>
      <form
        className="grid w-full grid-cols-2  gap-4  "
        // onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <Card className="col-span-2 p-4 ">
          <CardHeader className="px-0">
            <CardTitle>Gig Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-8 items-end gap-4 px-0">
            <FormField
              control={form.control}
              name="gigDate"
              render={({ field }) => (
                <FormItem className="col-span-2 flex flex-col">
                  <FormLabel>Gig Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "bg-white pl-3 text-left font-normal hover:bg-none",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            formatDate(field.value, "friendly")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <Icons.calendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto bg-white p-0 hover:bg-none"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(selectedDate) => {
                          field.onChange(selectedDate);
                          void update({
                            id: id,
                            gigDate: selectedDate,
                          });
                        }}
                        // disabled={(date) =>
                        //   date < new Date()
                        // }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timeStart"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      disabled={gigDate == null}
                      {...field}
                      className="bg-white"
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        const selectedTime = e.target.value;

                        if (selectedTime) {
                          const [hours, minutes] = selectedTime.split(":");
                          const currentDate = new Date();
                          const utcOffset = currentDate.getTimezoneOffset(); // Get the UTC offset in minutes

                          const localTime = new Date(
                            currentDate.getFullYear(),
                            currentDate.getMonth(),
                            currentDate.getDate(),
                            Number(hours),
                            Number(minutes),
                            0,
                            0
                          );

                          // Adjust the local time by subtracting the UTC offset
                          localTime.setMinutes(
                            localTime.getMinutes() - utcOffset
                          );

                          const isoTime = localTime.toISOString();

                          // console.log(isoTime);
                          void update({
                            id: id,
                            timeStart: isoTime,
                          });
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timeEnd"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                      className="bg-white"
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        const selectedTime = e.target.value;

                        if (selectedTime) {
                          const [hours, minutes] = selectedTime.split(":");
                          const currentDate = new Date();
                          const utcOffset = currentDate.getTimezoneOffset(); // Get the UTC offset in minutes

                          const localTime = new Date(
                            currentDate.getFullYear(),
                            currentDate.getMonth(),
                            currentDate.getDate(),
                            Number(hours),
                            Number(minutes),
                            0,
                            0
                          );

                          // Adjust the local time by subtracting the UTC offset
                          localTime.setMinutes(
                            localTime.getMinutes() - utcOffset
                          );

                          const isoTime = localTime.toISOString();

                          console.log(isoTime);
                          void update({
                            id: id,
                            timeEnd: isoTime,
                          });
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex w-16 flex-col space-y-2   text-center">
              <Label>Duration</Label>
              <Input
                disabled={true}
                value={durationHours ? durationHours : 0}
                className=" bg-gray-300 text-center"
              />
            </div>

            <FormItem className="flex flex-col ">
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  inputMode="numeric"
                  {...form.register("price")}
                  defaultValue={Number(gig.price)}
                  className="bg-white text-right"
                  onBlur={(e: FocusEvent<HTMLInputElement>) => {
                    const newPrice = new Prisma.Decimal(e.target.value);
                    void update({
                      id: gig.id,
                      price: newPrice,
                    });
                  }}
                />
              </FormControl>
              {/* <FormMessage /> */}
              <UncontrolledFormMessage
                message={form.formState.errors.price?.message}
              />
            </FormItem>
            <FormItem className="flex flex-col ">
              <FormLabel>Paid</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  inputMode="numeric"
                  {...form.register("amountPaid")}
                  // defaultValue={formatPrice(Number(props.amountPaid))}
                  defaultValue={Number(gig.amountPaid)}
                  className="bg-white text-right"
                  onBlur={(e: FocusEvent<HTMLInputElement>) => {
                    // console.log(e.target.value);
                    const newPaid = new Prisma.Decimal(e.target.value);
                    void update({
                      id: gig.id,
                      amountPaid: newPaid,
                    });
                  }}
                />
              </FormControl>
              <UncontrolledFormMessage
                message={form.formState.errors.amountPaid?.message}
              />
            </FormItem>
            <FormItem className="flex flex-col ">
              <FormLabel>Balance</FormLabel>
              <Input
                // type="number"
                disabled={true}
                defaultValue={balance ? formatPrice(balance) : ""}
                className=" text-right"
              />
            </FormItem>

            <FormField
              control={form.control}
              name="client.client"
              render={({ field }) => (
                <FormItem className="col-span-3 flex flex-col  ">
                  <FormLabel>Client</FormLabel>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      onClick={() => setIsOpen(true)}
                      className={cn(
                        " justify-between bg-white ",
                        !field.value && " text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? clients.find(
                            (client) => client.client === field.value
                          )?.client
                        : "Select Client"}
                      <Icons.arrowUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>

                  {/* <PopoverContent className=" w-[400px] rounded-md border-2 border-accent"> */}
                  <CommandDialog
                    position="top"
                    open={isOpen}
                    // onOpenChange={setIsOpen}
                  >
                    <CommandInput
                      placeholder="Search client..."
                      className="h-9 p-2"
                    />
                    <CommandEmpty>No clients found.</CommandEmpty>
                    <CommandGroup>
                      {clients.map((client) => (
                        <CommandItem
                          value={client.client}
                          key={id}
                          onSelect={() => {
                            void update({
                              id: gig.id,
                              clientId: client.id,
                            });
                            // onblur{}
                            // form.setValue("client", client.id);
                          }}
                        >
                          {client.client}
                          <Icons.check
                            className={cn(
                              "ml-auto h-4 w-4",
                              client.client === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    {/* </PopoverContent> */}

                    {/* </Popover> */}
                  </CommandDialog>
                  {/* <FormDescription>
                    This is the client that will be used in the dashboard.
                  </FormDescription> */}
                  {/* <FormMessage /> */}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="santa.id"
              render={({ field }) => (
                <FormItem className="col-span-2 w-full ">
                  <FormLabel>Santa</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value: typeof field.value) => {
                        field.onChange(value);
                        void update({
                          id: gig.id,
                          santaId: value,
                        });
                      }}
                    >
                      <SelectTrigger className="bg-white capitalize">
                        <SelectValue placeholder={field.value} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {santas.map((option) => (
                            <SelectItem
                              key={option.id}
                              value={option.id}
                              className="capitalize"
                            >
                              {option.role}
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
              name="mrsSanta.id"
              render={({ field }) => (
                <FormItem className="col-span-2 w-full ">
                  <FormLabel>Mrs. Santa</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value: typeof field.value) => {
                        field.onChange(value);
                        console.log();
                        void update({
                          id: gig.id,
                          mrsSantaId: value,
                        });
                      }}
                    >
                      <SelectTrigger className="bg-white capitalize">
                        <SelectValue placeholder={field.value} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {mrsSantas &&
                            mrsSantas.map((option) => (
                              <SelectItem
                                key={option.id}
                                value={option.id}
                                className="capitalize"
                              >
                                {option.nameFirst}
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
              name="client.source"
              render={({ field }) => (
                <FormItem className="flex flex-col ">
                  <FormLabel>Source</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={clientId?.length === 0}
                      className="bg-white "
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void update({
                          id: gig.id,
                          client: {
                            update: {
                              source: e.target.value,
                            },
                          },
                        });
                      }}
                    />
                  </FormControl>
                  {/* <FormMessage /> */}
                  <UncontrolledFormMessage
                    message={form.formState.errors.price?.message}
                  />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className=" p-4">
          <CardHeader className="px-0">
            <CardTitle>Client Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-6 items-end gap-4 px-0">
            <FormField
              control={form.control}
              name="client.client"
              render={({ field }) => (
                <FormItem className="col-span-6 flex flex-col ">
                  <FormLabel>Client</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="search"
                      disabled={clientId?.length === 0}
                      className="bg-white"
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void update({
                          id: gig.id,
                          client: {
                            update: {
                              client: e.target.value,
                            },
                          },
                        });
                      }}
                    />
                  </FormControl>
                  {/* <FormMessage /> */}
                  <UncontrolledFormMessage
                    message={form.formState.errors.price?.message}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="client.contact"
              render={({ field }) => (
                <FormItem className="col-span-6 flex flex-col ">
                  <FormLabel>Contact at Client</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={clientId?.length === 0}
                      className="bg-white"
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void update({
                          id: gig.id,
                          client: {
                            update: {
                              contact: e.target.value,
                            },
                          },
                        });
                      }}
                    />
                  </FormControl>
                  {/* <FormMessage /> */}
                  <UncontrolledFormMessage
                    message={form.formState.errors.client?.contact?.message}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="client.phoneCell"
              render={({ field }) => (
                <FormItem className="col-span-2 flex flex-col ">
                  <FormLabel>Cell</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      disabled={clientId?.length === 0}
                      className="bg-white "
                      placeholder="xxx-xxx-xxxx"
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void update({
                          id: gig.id,
                          client: {
                            update: {
                              phoneCell: e.target.value,
                            },
                          },
                        });
                      }}
                    />
                  </FormControl>
                  {/* <FormMessage /> */}
                  <UncontrolledFormMessage
                    message={form.formState.errors.client?.phoneCell?.message}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="client.phoneLandline"
              render={({ field }) => (
                <FormItem className="col-span-2 flex flex-col ">
                  <FormLabel>Landline</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={clientId?.length === 0}
                      className="bg-white "
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void update({
                          id: gig.id,
                          client: {
                            update: {
                              phoneLandline: e.target.value,
                            },
                          },
                        });
                      }}
                    />
                  </FormControl>
                  {/* <FormMessage /> */}
                  <UncontrolledFormMessage
                    message={
                      form.formState.errors.client?.addressState?.message
                    }
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="client.clientType"
              render={({ field }) => (
                <FormItem className="col-span-2 w-full ">
                  <FormLabel>Client Type</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value: ClientType) => {
                        field.onChange(value);
                        void update({
                          id: gig.id,
                          client: {
                            update: {
                              clientType: value,
                            },
                          },
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
              name="client.email"
              render={({ field }) => (
                <FormItem className="col-span-6 flex flex-col ">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={clientId?.length === 0}
                      className="bg-white "
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void update({
                          id: id,
                          client: {
                            update: {
                              email: e.target.value,
                            },
                          },
                        });
                      }}
                    />
                  </FormControl>
                  {/* <FormMessage /> */}
                  <UncontrolledFormMessage
                    message={form.formState.errors.client?.email?.message}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="client.addressStreet"
              render={({ field }) => (
                <FormItem className="col-span-6 flex flex-col ">
                  <FormLabel>Street</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={clientId?.length === 0}
                      className="bg-white "
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void update({
                          id: gig.id,
                          client: {
                            update: {
                              addressStreet: e.target.value,
                            },
                          },
                        });
                      }}
                    />
                  </FormControl>
                  {/* <FormMessage /> */}
                  <UncontrolledFormMessage
                    message={
                      form.formState.errors.client?.addressStreet?.message
                    }
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="client.addressCity"
              render={({ field }) => (
                <FormItem className="col-span-2 flex flex-col ">
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={clientId?.length === 0}
                      className="bg-white "
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void update({
                          id: gig.id,
                          client: {
                            update: {
                              addressCity: e.target.value,
                            },
                          },
                        });
                      }}
                    />
                  </FormControl>
                  {/* <FormMessage /> */}
                  <UncontrolledFormMessage
                    message={form.formState.errors.client?.addressCity?.message}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="client.addressState"
              render={({ field }) => (
                <FormItem className="col-span-2 flex flex-col ">
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={clientId?.length === 0}
                      className="bg-white "
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void update({
                          id: gig.id,
                          client: {
                            update: {
                              addressState: e.target.value,
                            },
                          },
                        });
                      }}
                    />
                  </FormControl>
                  {/* <FormMessage /> */}
                  <UncontrolledFormMessage
                    message={
                      form.formState.errors.client?.addressState?.message
                    }
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="client.addressZip"
              render={({ field }) => (
                <FormItem className="col-span-2 flex flex-col ">
                  <FormLabel>Zip</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={clientId?.length === 0}
                      className="bg-white "
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void update({
                          id: gig.id,
                          client: {
                            update: {
                              addressZip: e.target.value,
                            },
                          },
                        });
                      }}
                    />
                  </FormControl>
                  {/* <FormMessage /> */}
                  <UncontrolledFormMessage
                    message={form.formState.errors.client?.addressZip?.message}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="client.notes"
              render={({ field }) => (
                <FormItem className="col-span-6 flex flex-col ">
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={clientId?.length === 0}
                      className="bg-white "
                      onBlur={(e: FocusEvent<HTMLTextAreaElement>) => {
                        void update({
                          id: gig.id,
                          client: {
                            update: {
                              notes: e.target.value,
                            },
                          },
                        });
                      }}
                    />
                  </FormControl>
                  {/* <FormMessage /> */}
                  <UncontrolledFormMessage
                    message={form.formState.errors.client?.notes?.message}
                  />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Card className="p-4 ">
          <CardHeader className="px-0">
            <CardTitle>Venue Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-6 items-end gap-4 px-0">
            <FormField
              control={form.control}
              name="venueAddressName"
              defaultValue={gig.venueAddressName ? gig.venueAddressName : ""}
              render={({ field }) => (
                <FormItem className="col-span-6 flex flex-col ">
                  <FormLabel>Venue</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={gig.clientId?.length === 0}
                      className="bg-white"
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void update({
                          id: gig.id,
                          venueAddressName: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  {/* <FormMessage /> */}
                  <UncontrolledFormMessage
                    message={form.formState.errors.venueAddressName?.message}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactName"
              defaultValue={gig?.contactName}
              render={({ field }) => (
                <FormItem className="col-span-6 flex flex-col ">
                  <FormLabel>Contact at Venue</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={gig.clientId?.length === 0}
                      className="bg-white"
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void update({
                          id: gig.id,
                          contactPhoneCell: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  {/* <FormMessage /> */}
                  <UncontrolledFormMessage
                    message={form.formState.errors.contactName?.message}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactPhoneCell"
              defaultValue={gig.contactPhoneCell}
              render={({ field }) => (
                <FormItem className="col-span-2 flex flex-col ">
                  <FormLabel>Cell</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={gig.clientId?.length === 0}
                      className="bg-white "
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void update({
                          id: gig.id,
                          contactPhoneCell: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  {/* <FormMessage /> */}
                  <UncontrolledFormMessage
                    message={form.formState.errors.contactPhoneCell?.message}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactPhoneLand"
              defaultValue={gig.contactPhoneLand}
              render={({ field }) => (
                <FormItem className="col-span-2 flex flex-col ">
                  <FormLabel>Landline</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={gig.clientId?.length === 0}
                      className="bg-white "
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void update({
                          id: gig.id,
                          contactPhoneLand: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  {/* <FormMessage /> */}
                  <UncontrolledFormMessage
                    message={form.formState.errors.contactPhoneLand?.message}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="venueType"
              defaultValue={gig.venueType}
              render={({ field }) => (
                <FormItem className="col-span-2 flex flex-col ">
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={gig.clientId?.length === 0}
                      className="bg-white "
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        e.target.value !== gig.venueType &&
                          void update({
                            id: gig.id,
                            venueType: e.target.value,
                          });
                      }}
                    />
                  </FormControl>
                  {/* <FormMessage /> */}
                  <UncontrolledFormMessage
                    message={form.formState.errors.venueType?.message}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactEmail"
              defaultValue={gig.contactEmail}
              render={({ field }) => (
                <FormItem className="col-span-6 flex flex-col ">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={gig.clientId?.length === 0}
                      className="bg-white "
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void update({
                          id: gig.id,
                          contactEmail: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  {/* <FormMessage /> */}
                  <UncontrolledFormMessage
                    message={form.formState.errors.contactEmail?.message}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="venueAddressStreet"
              defaultValue={gig.venueAddressStreet}
              render={({ field }) => (
                <FormItem className="col-span-6 flex flex-col ">
                  <FormLabel>Street</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white "
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void update({
                          id: gig.id,
                          venueAddressStreet: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  {/* <FormMessage /> */}
                  <UncontrolledFormMessage
                    message={form.formState.errors.venueAddressStreet?.message}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="venueAddressCity"
              defaultValue={gig.venueAddressCity}
              render={({ field }) => (
                <FormItem className="col-span-2 flex flex-col ">
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={gig.clientId?.length === 0}
                      className="bg-white "
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void update({
                          id: gig.id,
                          venueAddressCity: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  {/* <FormMessage /> */}
                  <UncontrolledFormMessage
                    message={form.formState.errors.venueAddressCity?.message}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="venueAddressState"
              defaultValue={gig.venueAddressState}
              render={({ field }) => (
                <FormItem className="col-span-2 flex flex-col ">
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={gig.clientId?.length === 0}
                      className="bg-white "
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void update({
                          id: gig.id,
                          venueAddressState: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  {/* <FormMessage /> */}
                  <UncontrolledFormMessage
                    message={form.formState.errors.venueAddressState?.message}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="venueAddressZip"
              defaultValue={gig.venueAddressZip}
              render={({ field }) => (
                <FormItem className="col-span-2 flex flex-col ">
                  <FormLabel>Zip</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={gig.clientId?.length === 0}
                      className="bg-white "
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void update({
                          id: gig.id,
                          venueAddressZip: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  {/* <FormMessage /> */}
                  <UncontrolledFormMessage
                    message={form.formState.errors.venueAddressZip?.message}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notesVenue"
              defaultValue={gig.notesVenue}
              render={({ field }) => (
                <FormItem className="col-span-6 flex flex-col ">
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={gig.clientId?.length === 0}
                      className="bg-white "
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        void update({
                          id: gig.id,
                          notesVenue: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  {/* <FormMessage /> */}
                  <UncontrolledFormMessage
                    message={form.formState.errors.notesVenue?.message}
                  />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
