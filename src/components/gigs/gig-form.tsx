"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { gigSchema } from "@/lib/validations/gig";
import { type GigProps } from "@/server/db";
import { catchError } from "@/lib/utils";
import { useTransition } from "react";

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

export default function GigForm(props: GigProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof gigSchema>>({
    resolver: zodResolver(gigSchema),
    mode: "onBlur",
  });

  return (
    <Form {...form}>
      <form
        className="grid w-full max-w-2xl gap-5"
        // onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input
              aria-invalid={!!form.formState.errors.name}
              placeholder="Type product name here."
              {...form.register("name")}
              defaultValue={product.name}
            />
          </FormControl>
          <UncontrolledFormMessage
            message={form.formState.errors.name?.message}
          />
        </FormItem>
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Type product description here."
              {...form.register("description")}
              defaultValue={product.description ?? ""}
            />
          </FormControl>
          <UncontrolledFormMessage
            message={form.formState.errors.description?.message}
          />
        </FormItem>
        <div className="flex flex-col items-start gap-6 sm:flex-row">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value: typeof field.value) =>
                      field.onChange(value)
                    }
                    defaultValue={product.category}
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
          <FormField
            control={form.control}
            name="subcategory"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Subcategory</FormLabel>
                <FormControl>
                  <Select
                    value={field.value?.toString()}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="capitalize">
                      <SelectValue placeholder={field.value} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {subcategories.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
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
        </div>
        <div className="flex flex-col items-start gap-6 sm:flex-row">
          <FormItem className="w-full">
            <FormLabel>Price</FormLabel>
            <FormControl>
              <Input
                type="number"
                inputMode="numeric"
                placeholder="Type product price here."
                {...form.register("price")}
                defaultValue={product.price}
              />
            </FormControl>
            <UncontrolledFormMessage
              message={form.formState.errors.price?.message}
            />
          </FormItem>
          <FormItem className="w-full">
            <FormLabel>Inventory</FormLabel>
            <FormControl>
              <Input
                type="number"
                inputMode="numeric"
                placeholder="Type product inventory here."
                {...form.register("inventory", {
                  valueAsNumber: true,
                })}
                defaultValue={product.inventory}
              />
            </FormControl>
            <UncontrolledFormMessage
              message={form.formState.errors.inventory?.message}
            />
          </FormItem>
        </div>
        <FormItem className="flex w-full flex-col gap-1.5">
          <FormLabel>Images</FormLabel>
          {!isUploading && previews?.length ? (
            <div className="flex items-center gap-2">
              {previews.map((file) => (
                <Zoom key={file.name}>
                  <Image
                    src={file.preview}
                    alt={file.name}
                    className="h-20 w-20 shrink-0 rounded-md object-cover object-center"
                    width={80}
                    height={80}
                  />
                </Zoom>
              ))}
            </div>
          ) : null}
          <FormControl>
            <FileDialog
              setValue={form.setValue}
              name="images"
              maxFiles={3}
              maxSize={1024 * 1024 * 4}
              files={files}
              setFiles={setFiles}
              isUploading={isUploading}
              disabled={isPending}
            />
          </FormControl>
          <UncontrolledFormMessage
            message={form.formState.errors.images?.message}
          />
        </FormItem>
        <div className="flex space-x-2">
          <Button disabled={isPending}>
            {isPending && (
              <Icons.spinner
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Update Product
            <span className="sr-only">Update product</span>
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              startTransition(async () => {
                await deleteProductAction({
                  storeId: product.storeId,
                  id: product.id,
                });
                router.push(`/dashboard/stores/${product.storeId}/products`);
              });
            }}
            disabled={isPending}
          >
            {isPending && (
              <Icons.spinner
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Delete Product
            <span className="sr-only">Delete product</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
