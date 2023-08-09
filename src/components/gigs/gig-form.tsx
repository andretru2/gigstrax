"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { gigSchema } from "@/lib/validations/gig";
import { type GigProps } from "@/server/db";
import {
  catchError,
  cn,
  formatDate,
  formatTime,
  convertUTCtoLocalTime,
  getUTCDate,
  formatTimeToUTC,
  duration,
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

export default function GigForm(props: Partial<GigProps>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // const { gigDate } = props;

  const durationHours =
    props?.timeStart && props?.timeEnd
      ? duration(props.timeStart, props.timeEnd)
      : null;

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

                        update(updatedProps);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* <div>
              <Input disabled={true}>{durationHours}</Input>
            </div> */}
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
