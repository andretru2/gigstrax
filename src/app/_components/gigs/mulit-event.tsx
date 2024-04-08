"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "../ui/calendar";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
// import { usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import type * as z from "zod";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Icons } from "../icons";
import { useTransition } from "react";

import { gigMultiEventSchema } from "@/lib/validations/gig";

import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  // FormLabel,
  FormMessage,
} from "@/components/ui/form";
// import { toast } from "@/hooks/use-toast";
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

export default function MultiEventCreate() {
  //   const router = useRouter();
  //   const pathname = usePathname();
  const [isPending] = useTransition();

  const form = useForm<z.infer<typeof gigMultiEventSchema>>({
    resolver: zodResolver(gigMultiEventSchema),
    mode: "onSubmit",
    defaultValues: {},
  });

  const generateFieldNames = (prefix: string) => {
    return Array.from({ length: SLOTS_PER_TAB }, (_, i) => `${prefix}${i}`);
  };

  const gigDateFieldNames = generateFieldNames("gigDate");
  const timeStartFieldNames = generateFieldNames("timeStart");
  const timeEndFieldNames = generateFieldNames("timeEnd");

  // function onSubmit(data: z.infer<typeof gigMultiEventSchema>) {
  //   startTransition(() => {
  //     try {
  //       // e.preventDefault();
  //       console.log("submit", data);
  //       if (!data) toast({ description: "Please select a date." });

  //       // await checkProductAction({
  //       //   name: data.name,
  //       //   id: product.id,
  //       // });

  //       // return toast({ description: "successfully created x gigs." });
  //     } catch (err) {
  //       catchError(err);
  //     }
  //   });
  // }

  // const onSubmit = (data: z.infer<typeof gigMultiEventSchema>) => {
  //   console.log("submit", data);
  //   // startTransition(() => {
  //   //   try {
  //   //     // e.preventDefault();
  //   //     console.log("submit", data);
  //   //     if (!data) toast({ description: "Please select a date." });

  //   //     // await checkProductAction({
  //   //     //   name: data.name,
  //   //     //   id: product.id,
  //   //     // });

  //   //     // return toast({ description: "successfully created x gigs." });
  //   //   } catch (err) {
  //   //     catchError(err);
  //   //   }
  //   // });
  // };

  const onSubmit = (
    data: z.infer<typeof gigMultiEventSchema>,
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault(); // Prevents the default form submission action
    console.log("submit", data);
    // Other logic related to form submission
  };

  return (
    <Card className="h-full w-full p-4">
      <CardHeader className="px-0">
        <CardTitle>Create Multi-Events</CardTitle>
      </CardHeader>
      <CardContent className=" px-0">
        <Form {...form}>
          <form
            className="  "
            onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
            // onSubmit={form.handleSubmit(onSubmit)}
            // onSubmit={(e) =>
            //   form.handleSubmit((formData) => onSubmit(formData, e))(e)
            // } // Handle form submission
          >
            <Tabs
              defaultValue="tab-1"
              className={cn(" relative w-full overflow-x-auto")}
              orientation="horizontal"
              //   onValueChange={(value) => router.push(value)}
            >
              <TabsList>
                {Array.from(TABS).map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.value}>
                    {tab.value}
                  </TabsTrigger>
                ))}
              </TabsList>
              {Array.from(TABS).map((tab, tabIndex) => (
                <TabsContent
                  key={`${tab.id}-content`}
                  value={tab.value}
                  className="col-span-4 grid w-full gap-2"
                >
                  {Array.from({ length: SLOTS_PER_TAB }).map((_, i) => (
                    <div key={i} className="grid grid-cols-4 gap-2">
                      <div className="col-span-2 flex w-full flex-row  items-center gap-2">
                        <span className="">
                          {tabIndex * SLOTS_PER_TAB + i + 1}
                        </span>

                        <FormField
                          control={form.control}
                          name={gigDateFieldNames[i]}
                          render={({ field }) => (
                            <FormItem className=" flex w-full flex-col">
                              {/* <FormLabel>Gig Date</FormLabel> */}
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "bg-white pl-3 text-left font-normal hover:bg-none hover:text-primary-foreground ",
                                        !field.value && "text-muted-foreground",
                                      )}
                                    >
                                      {field.value &&
                                        //eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                                        formatDate(field.value, "friendly")}
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
                                    //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
                      </div>
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
            <CardFooter className="p-0">
              <Button
                isLoading={isPending}
                type="submit"
                variant="default"
                className="  right-0 top-0"
              >
                Submit
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
