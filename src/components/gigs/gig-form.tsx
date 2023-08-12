"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { gigSchema } from "@/lib/validations/gig";
import { type GigProps, type ClientProps, type SourceProps } from "@/server/db";
import { PrismaClient, Prisma } from "@prisma/client";

import {
  catchError,
  cn,
  formatDate,
  formatTime,
  convertUTCtoLocalTime,
  getUTCDate,
  formatTimeToUTC,
  duration,
  formatPrice,
} from "@/lib/utils";
import { useTransition, type FocusEvent } from "react";

import { update } from "@/app/_actions/gig";

import type * as z from "zod";

// import { type z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
// import { getSantas } from "@/app/_actions/source";
import { type SantaProps, type MrsSantaProps } from "@/types/index";

interface Props {
  gig: Partial<GigProps> &
    Partial<Omit<ClientProps, "client">> &
    Partial<SourceProps>;
  santas: SantaProps[];
  mrsSantas?: MrsSantaProps[];
  clients: Partial<ClientProps>[];
}

export default function GigForm({
  gig,
  santas,
  mrsSantas,
  clients,
  ...props
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  // const [santas, setSantas] = useState<SantaProps[]>([]);

  // const { gigDate, timeStart, timeEnd, } = gig;

  const durationHours =
    gig?.timeStart && gig?.timeEnd
      ? duration(gig.timeStart, gig.timeEnd)
      : null;

  const balance =
    gig?.price && gig?.amountPaid ? gig.price - gig.amountPaid : null;

  const form = useForm<z.infer<typeof gigSchema>>({
    resolver: zodResolver(gigSchema),
    mode: "onBlur",
  });
  // const santas = async () => await getSantas();
  // const santas =  getSantas();
  // const santas = await(async () => {
  //   return await getSantas();

  // })();

  async function handleTimeChange(time: Date) {
    const dateTime = gig.gigDate && new Date(gig.gigDate.getTime());
    time &&
      dateTime &&
      dateTime.setHours(time.getHours(), time.getMinutes(), time.getSeconds());

    // dateTime && ;
    console.log("time", time, dateTime, dateTime.toUTCString());
    const data = await update({
      id: gig.id,
      timeStart: time,
    });

    console.log("handle change", data);
  }

  return (
    <Form {...form}>
      <form
        className="w-full    "
        // onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <Card className="border-2">
          <CardHeader className="px-0">
            <CardTitle>Gig Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-8 gap-4 px-0">
            <FormField
              control={form.control}
              name="gigDate"
              defaultValue={gig.gigDate}
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
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
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
              defaultValue={gig.timeStart?.toTimeString().slice(0, 5)}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      // aria-invalid={!!form.formState.errors.timeStart}
                      {...field}
                      className="bg-white"
                      // defaultValue={props.timeStart?.toTimeString().slice(0, 5)}
                      placeholder="Enter the gig start time"
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        const selectedTime = e.target.value; // User-selected time
                        const utcDate = getUTCDate(selectedTime); // Convert to UTC
                        const localTime = convertUTCtoLocalTime(utcDate); // Convert to local time
                        console.log(
                          utcDate,
                          localTime,
                          localTime.toISOString()
                        );
                        const updatedProps: Partial<GigProps> = {
                          id: gig.id,
                          timeStart: localTime.toISOString(), // Convert local time to ISO string format
                        };

                        update(updatedProps);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timeEnd"
              defaultValue={gig.timeEnd?.toTimeString().slice(0, 5)}
              // defaultValue={props.timeEnd?.convertUTCtoLocalTime().slice(0, 5)}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      // aria-invalid={!!form.formState.errors.timeStart}
                      {...field}
                      className="bg-white"
                      // defaultValue={props.timeStart?.toTimeString().slice(0, 5)}
                      placeholder="Enter the gig end time"
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        const selectedTime = e.target.value; // User-selected time
                        const utcDate = getUTCDate(selectedTime); // Convert to UTC
                        const localTime = convertUTCtoLocalTime(utcDate); // Convert to local time
                        console.log(
                          utcDate,
                          localTime,
                          localTime.toISOString()
                        );
                        const updatedProps: Partial<GigProps> = {
                          id: props.id,
                          timeStart: localTime.toISOString(), // Convert local time to ISO string format
                        };

                        void update(updatedProps);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex w-16 flex-col gap-2 text-center">
              <Label>Duration</Label>
              <Input
                disabled={true}
                value={durationHours ? durationHours : 0}
                className=" bg-gray-300 text-center"
              />
            </div>

            <FormItem className="flex flex-col gap-2 space-y-0">
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  inputMode="numeric"
                  {...form.register("price")}
                  // defaultValue={formatPrice(Number(props.price))}
                  defaultValue={Number(gig.price)}
                  className="bg-white text-right"
                  onBlur={(e: FocusEvent<HTMLInputElement>) => {
                    // console.log(e.target.value);
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
            <FormItem className="flex flex-col gap-2 space-y-0">
              <FormLabel>Paid</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  inputMode="numeric"
                  {...form.register("amountPaid")}
                  // defaultValue={formatPrice(Number(props.amountPaid))}
                  defaultValue={Number(gig.amountPaid)}
                  className="bg-white text-right"
                />
              </FormControl>
              <UncontrolledFormMessage
                message={form.formState.errors.amountPaid?.message}
              />
            </FormItem>
            <FormItem className="flex flex-col gap-2 space-y-0">
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
              name="client"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Client</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? clients.find(
                                (client) => client.client === field.value
                              )?.client
                            : "Select Client"}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search framework..."
                          className="h-9"
                        />
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                          {languages.map((language) => (
                            <CommandItem
                              value={language.label}
                              key={language.value}
                              onSelect={() => {
                                form.setValue("language", language.value);
                              }}
                            >
                              {language.label}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  language.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    This is the language that will be used in the dashboard.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="santa.role"
              render={({ field }) => (
                <FormItem className="col-span-2 w-full ">
                  <FormLabel>Santa</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value: typeof field.value) =>
                        field.onChange(value)
                      }
                      defaultValue={gig.santa.role}
                    >
                      <SelectTrigger className="bg-white capitalize">
                        <SelectValue placeholder={field.value} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {santas.map((option) => (
                            <SelectItem
                              key={option.id}
                              value={option.role}
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
              name="mrsSanta.nameFirst"
              render={({ field }) => (
                <FormItem className="col-span-2 w-full ">
                  <FormLabel>Mrs. Santa</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value: typeof field.value) =>
                        field.onChange(value)
                      }
                      defaultValue={gig.mrsSanta.nameFirst}
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
                                value={option.nameFirst}
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
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
