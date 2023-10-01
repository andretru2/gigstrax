"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { gigSchema } from "@/lib/validations/gig";
import { type GigProps, type SourceProps, type ClientProps } from "@/server/db";
import { Prisma, VenueType, ClientType } from "@prisma/client";

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
import { type FocusEvent, type ReactNode, useMemo, useTransition } from "react";
import { copyFromClient, update } from "@/app/_actions/gig";
import type * as z from "zod";
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
  type SantaProps,
  type GigExtendedProps,
  type MrsSantaProps,
  type ClientPickerProps,
} from "@/types/index";

import { toast } from "@/hooks/use-toast";
import ClientForm from "@/components/clients/client-form";
import { useGigStore } from "@/app/_store/gig";
import { SelectClient } from "./gig-select-client";

// interface Props {
//   gig: Partial<GigProps> &
//     Partial<Omit<ClientProps, "client">> &
//     Partial<SourceProps>;
//   santas: SantaProps[];
//   mrsSantas?: MrsSantaProps[];
//   clients: ClientPickerProps[];
// }

interface Props {
  gig: GigExtendedProps;
  client?: ClientProps;
  santas: SantaProps[];
  mrsSantas?: MrsSantaProps[];
  clients?: ClientPickerProps[];
  clientSuggestions?: ClientPickerProps[];
  children?: ReactNode;
  // venueTypes: VenueTypeProps[];
}

export default function GigForm({
  gig,
  // client,
  santas,
  mrsSantas,
  // clients,
  // clientSuggestions,
  children,
  ...props
}: Props) {
  const { client, setClient } = useGigStore();

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
    clientId,
    santa,
    mrsSanta,
    contactEmail,
    contactName,
    contactPhoneCell,
    contactPhoneLand,
  } = useMemo(() => gig, [gig]);
  // const {
  //   source: clientSource,
  //   phoneCell,
  //   phoneLandline,
  //   addressCity,
  //   addressStreet,
  //   addressZip,
  //   addressState,
  //   email,
  //   id: clientId,
  //   client: clientName,
  //   clientType,
  //   notes,
  //   contact,
  // } = useMemo(() => client || {}, [client]);

  // const {
  //   source: clientSource,
  //   phoneCell: clientPhoneCell,
  //   phoneLandline: clientPhoneLandline,
  //   addressCity: clientAddressCity,
  //   addressStreet: clientAddressStreet,
  //   addressZip: clientAddressZip,
  //   addressState: clientAddressState,
  //   email: clientEmail,
  //   id: clientId,
  //   client: clientName,
  //   clientType,
  //   notes: clientNotes,
  //   contact: clientContact,
  // } = selectedClient || {};

  // if (selectedClient && gig.client) {
  //   Object.assign(gig.client, selectedClient);
  // }

  // console.log(gig, client);

  // if (client) setSelectedClient(client);

  // useEffect(() => {
  //   if (clientId) {
  //     useGigStore.setState({ client });
  //   }
  // }, [clientId]);

  // console.log(client);

  const [isPending, startTransition] = useTransition();

  const { id: santaId, role } = santa ?? {};
  const { id: mrsSantaId, nameFirst } = mrsSanta ?? {};

  const durationHours =
    timeStart && timeEnd ? calculateTimeDifference(timeStart, timeEnd) : null;

  const balance =
    price && amountPaid ? Number(price) - Number(amountPaid) : null;

  console.log(
    "time",
    timeStart,
    timeStart.toLocaleString(),
    fromUTC(timeStart),
    fromUTC(timeEnd),
    fromUTC(gigDate),
    timeStart.toISOString().slice(11, 16)
  );

  const form = useForm<z.infer<typeof gigSchema>>({
    resolver: zodResolver(gigSchema),
    mode: "onBlur",
    defaultValues: {
      gigDate: gigDate ? gigDate : undefined,
      // timeStart: timeStart ? timeStart?.toTimeString().slice(0, 5) : undefined,
      timeStart: timeStart ? timeStart.toISOString().slice(11, 16) : undefined,
      timeEnd: timeEnd ? timeEnd.toISOString().slice(11, 16) : undefined,
      // timeEnd: timeEnd ? timeEnd?.toTimeString().slice(0, 5) : undefined,
      // timeEnd: timeEnd ? fromUTC(timeEnd) : undefined,
      venueAddressCity: venueAddressCity ? venueAddressCity : undefined,
      venueAddressState: venueAddressState ? venueAddressState : undefined,
      venueAddressStreet: venueAddressStreet ? venueAddressStreet : undefined,
      venueAddressName: venueAddressName ? venueAddressName : undefined,
      venueAddressZip: venueAddressZip ? venueAddressZip : undefined,
      venueType: venueType ? venueType : undefined,
      notesVenue: notesVenue ? notesVenue : undefined,
      price: price ? Number(price) : undefined,
      amountPaid: amountPaid ? Number(amountPaid) : undefined,
      contactEmail: contactEmail ? contactEmail : undefined,
      contactName: contactName ? contactName : undefined,
      contactPhoneCell: contactPhoneCell ? contactPhoneCell : undefined,
      contactPhoneLand: contactPhoneLand ? contactPhoneLand : undefined,
      clientId: clientId ? clientId : undefined,

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

  // console.log(client);

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
                          // console.log(selectedDate, selectedDate?.setHours(0));
                          field.onChange(selectedDate);

                          startTransition(() => {
                            try {
                              void update({
                                id: id,
                                gigDate: selectedDate,
                              });
                            } catch (err) {
                              catchError(err);
                            }
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

                        if (selectedTime && gig.gigDate) {
                          const [hours, minutes] = selectedTime.split(":");
                          const gigDateObj = new Date(gig.gigDate);

                          const offsetHours =
                            new Date().getTimezoneOffset() / 60;

                          const utcHours = Number(hours) - offsetHours;

                          // Create a new Date object by combining gigDate and selectedTime
                          const updatedTimeStart = new Date(
                            gigDateObj.getFullYear(),
                            gigDateObj.getMonth(),
                            gigDateObj.getDate(),
                            utcHours,
                            Number(minutes)
                          );

                          startTransition(() => {
                            try {
                              void update({
                                id: id,
                                timeStart: updatedTimeStart.toISOString(),
                              });
                            } catch (err) {
                              catchError(err);
                            }
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
                      disabled={gigDate == null}
                      {...field}
                      className="bg-white"
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        const selectedTime = e.target.value;

                        console.log("timeend orig", selectedTime);

                        if (selectedTime && gig.gigDate) {
                          const [hours, minutes] = selectedTime.split(":");
                          const gigDateObj = new Date(gig.gigDate);

                          const offsetHours =
                            new Date().getTimezoneOffset() / 60;

                          const utcHours = Number(hours) - offsetHours;

                          // Create a new Date object by combining gigDate and selectedTime
                          const updatedTimeEnd = new Date(
                            gigDateObj.getFullYear(),
                            gigDateObj.getMonth(),
                            gigDateObj.getDate(),
                            utcHours,
                            Number(minutes)
                          );

                          console.log(
                            "timeend",
                            updatedTimeEnd,
                            updatedTimeEnd.toISOString()
                          );

                          startTransition(() => {
                            try {
                              void update({
                                id: id,
                                timeEnd: updatedTimeEnd.toISOString(),
                              });
                            } catch (err) {
                              catchError(err);
                            }
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
                    startTransition(() => {
                      try {
                        const newPrice = new Prisma.Decimal(e.target.value);
                        void update({
                          id: gig.id,
                          price: newPrice,
                        });
                      } catch (err) {
                        catchError(err);
                      }
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
                  defaultValue={Number(gig.amountPaid)}
                  className="bg-white text-right"
                  onBlur={(e: FocusEvent<HTMLInputElement>) => {
                    startTransition(() => {
                      try {
                        const newPaid = new Prisma.Decimal(e.target.value);
                        void update({
                          id: gig.id,
                          amountPaid: newPaid,
                        });
                      } catch (err) {
                        catchError(err);
                      }
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
              name="clientId"
              render={({ field }) => (
                <SelectClient
                  gigId={id ?? ""}
                  control={form.control}
                  name="clientId"
                />
              )}
            />

            <FormField
              control={form.control}
              name="santa.id"
              render={({ field }) => (
                <FormItem className="col-span-3 w-full ">
                  <FormLabel>Santa</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value: typeof field.value) => {
                        field.onChange(value);
                        startTransition(() => {
                          try {
                            void update({
                              id: gig.id,
                              santaId: value,
                            });
                          } catch (err) {
                            catchError(err);
                          }
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
                        startTransition(() => {
                          try {
                            void update({
                              id: gig.id,
                              mrsSantaId: value,
                            });
                          } catch (err) {
                            catchError(err);
                          }
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

            {/* <FormField
              control={form.control}
              name="clientSource"
              render={({ field }) => (
                <FormItem className="flex flex-col ">
                  <FormLabel>Source</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
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
                  <UncontrolledFormMessage
                    message={form.formState.errors.client?.source?.message}
                  />
                </FormItem>
              )}
            /> */}
          </CardContent>
        </Card>
        {children}

        {/* {selectedClient && <ClientForm {...selectedClient} />} */}

        <Card className="p-4 ">
          <CardHeader className="flex flex-row items-center space-y-0 px-0">
            <CardTitle className="relative">
              Venue Details
              <Button
                variant="link"
                className=" absolute left-40 w-32  self-center text-left"
                isLoading={isPending}
                onClick={() => {
                  startTransition(() => {
                    try {
                      void copyFromClient(id);
                    } catch (err) {
                      catchError(err);
                    }
                  });
                }}
              >
                Same as client?
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-6 items-end gap-4 px-0">
            <FormField
              control={form.control}
              name="venueAddressName"
              render={({ field }) => (
                <FormItem className="col-span-6 flex flex-col ">
                  <FormLabel>Venue</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white"
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        startTransition(() => {
                          try {
                            void update({
                              id: gig.id,
                              venueAddressName: e.target.value,
                            });
                          } catch (err) {
                            catchError(err);
                          }
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
              render={({ field }) => (
                <FormItem className="col-span-6 flex flex-col ">
                  <FormLabel>Contact at Venue</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white"
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        startTransition(() => {
                          try {
                            void update({
                              id: gig.id,
                              contactName: e.target.value,
                            });
                          } catch (err) {
                            catchError(err);
                          }
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
              render={({ field }) => (
                <FormItem className="col-span-2 flex flex-col ">
                  <FormLabel>Cell</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white "
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        startTransition(() => {
                          try {
                            void update({
                              id: gig.id,
                              contactPhoneCell: e.target.value,
                            });
                          } catch (err) {
                            catchError(err);
                          }
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
              render={({ field }) => (
                <FormItem className="col-span-2 flex flex-col ">
                  <FormLabel>Landline</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white "
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        startTransition(() => {
                          try {
                            void update({
                              id: gig.id,
                              contactPhoneLand: e.target.value,
                            });
                          } catch (err) {
                            catchError(err);
                          }
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
              render={({ field }) => (
                <FormItem className="col-span-2 w-full ">
                  <FormLabel>Venue Type</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value: VenueType) => {
                        field.onChange(value);
                        startTransition(() => {
                          try {
                            void update({
                              id: gig.id,
                              venueType: value,
                            });
                          } catch (err) {
                            catchError(err);
                          }
                        });
                      }}
                    >
                      <SelectTrigger className="bg-white capitalize">
                        <SelectValue placeholder={field.value} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {Object.values(VenueType).map((option) => (
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
              name="contactEmail"
              render={({ field }) => (
                <FormItem className="col-span-6 flex flex-col ">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white "
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        startTransition(() => {
                          try {
                            void update({
                              id: gig.id,
                              contactEmail: e.target.value,
                            });
                          } catch (err) {
                            catchError(err);
                          }
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
              render={({ field }) => (
                <FormItem className="col-span-2 flex flex-col ">
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={gig.clientId?.length === 0}
                      className="bg-white "
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        startTransition(() => {
                          try {
                            void update({
                              id: gig.id,
                              venueAddressCity: e.target.value,
                            });
                          } catch (err) {
                            catchError(err);
                          }
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
              render={({ field }) => (
                <FormItem className="col-span-2 flex flex-col ">
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white "
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        startTransition(() => {
                          try {
                            void update({
                              id: gig.id,
                              venueAddressState: e.target.value,
                            });
                          } catch (err) {
                            catchError(err);
                          }
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
              render={({ field }) => (
                <FormItem className="col-span-2 flex flex-col ">
                  <FormLabel>Zip</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white "
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        startTransition(() => {
                          try {
                            void update({
                              id: gig.id,
                              venueAddressZip: e.target.value,
                            });
                          } catch (err) {
                            catchError(err);
                          }
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
              render={({ field }) => (
                <FormItem className="col-span-6 flex flex-col ">
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="h-48  bg-white"
                      onBlur={(e: FocusEvent<HTMLTextAreaElement>) => {
                        startTransition(() => {
                          try {
                            void update({
                              id: gig.id,
                              notesVenue: e.target.value,
                            });
                          } catch (err) {
                            catchError(err);
                          }
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
