"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { gigSchema } from "@/lib/validations/gig";
import { type GigProps } from "@/server/db";
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

export default function GigForm(props: Partial<GigProps>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // const { gigDate } = props;

  const durationHours =
    props?.timeStart && props?.timeEnd
      ? duration(props.timeStart, props.timeEnd)
      : null;

  const balance =
    props?.price && props?.amountPaid ? props.price - props.amountPaid : null;

  const form = useForm<z.infer<typeof gigSchema>>({
    resolver: zodResolver(gigSchema),
    mode: "onBlur",
  });

  async function handleTimeChange(time: Date) {
    const dateTime = props.gigDate && new Date(props.gigDate.getTime());
    time &&
      dateTime &&
      dateTime.setHours(time.getHours(), time.getMinutes(), time.getSeconds());

    // dateTime && ;
    console.log("time", time, dateTime, dateTime.toUTCString());
    const data = await update({
      id: props.id,
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
              defaultValue={props.gigDate}
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
                      className="w-auto p-0 hover:bg-none"
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
              defaultValue={props.timeStart?.toTimeString().slice(0, 5)}
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
                          id: props.id,
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
              defaultValue={props.timeEnd?.toTimeString().slice(0, 5)}
              // defaultValue={props.timeEnd?.convertUTCtoLocalTime().slice(0, 5)}
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
                  defaultValue={Number(props.price)}
                  className="bg-white text-right"
                  onBlur={(e: FocusEvent<HTMLInputElement>) => {
                    // console.log(e.target.value);
                    const newPrice = new Prisma.Decimal(e.target.value);
                    void update({
                      id: props.id,
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
                  defaultValue={Number(props.amountPaid)}
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
              name="santaId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Santa</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value: typeof field.value) =>
                        field.onChange(value)
                      }
                      defaultValue={props.santaId}
                    >
                      <SelectTrigger className="capitalize">
                        <SelectValue placeholder={field.value} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {Object.values(products.category.enumValues).map(
                            (option) => (
                              <SelectItem
                                key={option}
                                value={option}
                                className="capitalize"
                              >
                                {option}
                              </SelectItem>
                            )
                          )}
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
