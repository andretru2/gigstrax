"use client";

import { type GigProps } from "@/server/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "../ui/calendar";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import type * as z from "zod";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Icons } from "../icons";
import { type FocusEvent } from "react";

import { gigMultiEventSchema } from "@/lib/validations/gig";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { cn, formatDate } from "@/lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

// const TABS = 3;
const TABS = [
  {
    id: "tab-1",
    value: "1-10",
  },
  {
    id: "tab-2",
    value: "11-20",
  },
  {
    id: "tab-3",
    value: "21-30",
  },
];
const SLOTS_PER_TAB = 10;

// export default function MultiEventCreate(props: Partial<GigProps>) {
//   return {};
// }

export default function MultiEventCreate(props: Partial<GigProps>) {
  //   const router = useRouter();
  //   const pathname = usePathname();

  const form = useForm<z.infer<typeof gigMultiEventSchema>>({
    resolver: zodResolver(gigMultiEventSchema),
  });

  const generateFieldNames = (prefix: string) => {
    return Array.from({ length: SLOTS_PER_TAB }, (_, i) => `${prefix}${i}`);
  };

  const gigDateFieldNames = generateFieldNames("gigDate");
  const timeStartFieldNames = generateFieldNames("timeStart");
  const timeEndFieldNames = generateFieldNames("timeEnd");

  return (
    <Card className="h-full w-full p-4">
      <CardHeader className="px-0">
        <CardTitle>Create Multi-Events</CardTitle>
      </CardHeader>
      <CardContent className="gap-4 px-0">
        <Form {...form}>
          <form
            className="grid w-full grid-cols-2  gap-4  "
            // onSubmit={(...args) => void aform.handleSubmit(onSubmit)(...args)}
          >
            <Tabs
              defaultValue="tab-1"
              className={cn("w-full overflow-x-auto")}
              //   onValueChange={(value) => router.push(value)}
            >
              <TabsList>
                {Array.from(TABS).map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.value}>
                    {tab.value}
                  </TabsTrigger>
                ))}
              </TabsList>
              {Array.from(TABS).map((tab) => (
                <TabsContent
                  key={`${tab.id}-content`}
                  value={tab.value}
                  className="col-span-4 grid "
                >
                  {Array.from({ length: SLOTS_PER_TAB }).map((_, i) => (
                    <div key={i} className="grid grid-cols-4 gap-3">
                      <FormField
                        control={form.control}
                        name={gigDateFieldNames[i]}
                        render={({ field }) => (
                          <FormItem className="col-span-2 flex flex-col">
                            {/* <FormLabel>Gig Date</FormLabel> */}
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
                                  initialFocus
                                  onSelect={(selectedDate) => {
                                    field.onChange(selectedDate);
                                  }}
                                />
                              </PopoverContent>
                            </Popover>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        // name="timeStart"
                        // name={`timeStart-${i}`}
                        name={timeStartFieldNames[i]}
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            {/* <FormLabel>Start Time</FormLabel> */}
                            <FormControl>
                              <Input
                                type="time"
                                {...field}
                                className="bg-white"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        // name="timeEnd"
                        name={timeEndFieldNames[i]}
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormControl>
                              <Input
                                type="time"
                                {...field}
                                className="bg-white"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
