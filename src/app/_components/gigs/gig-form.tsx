"use client";

import { useFormState } from "react-dom";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FieldError } from "@/components/form/field-error";
import { useFormFeedback } from "@/components/form/use-form-feedback";
import { EMPTY_FORM_STATE } from "@/components/form/to-form-state";
import { submitGig, copyInfoFromClient } from "@/app/_actions/gig";
import { VenueType, type Gig as GigProps } from "@prisma/client";
import { DatePicker } from "../ui/date-picker";
import {
  type FocusEvent,
  useRef,
  type ReactElement,
  useTransition,
} from "react";
import {
  calculateTimeDifference,
  cn,
  formatDate,
  formatPrice,
  getTimeFromDate,
} from "@/lib/utils";
import { useQueryStates, parseAsBoolean, useQueryState } from "nuqs";
import { type ClientPickerProps, type SourcePickerProps } from "@/types/index";
import { handleSaveGig, type SaveGigProps } from "@/lib/gig/handle-save-gig";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

import { Button } from "../ui/button";
import { Icons } from "../icons";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { fieldErrorParser } from "../search-params";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";

interface Props {
  id: string;
  gig: Awaited<Partial<GigProps>>;
  client?: Awaited<ClientPickerProps> | undefined;
  santa?: Awaited<SourcePickerProps> | undefined;
  mrsSanta?: Awaited<SourcePickerProps> | undefined;
  clientPicker: ReactElement;
  santaPicker: ReactElement;
  mrsSantaPicker: ReactElement;
  clientDetails: ReactElement;
  // searchParams?: ParsedSearchParams;
}

export function GigForm(props: Props) {
  const { id } = props;
  const [fieldError, setFieldError] = useQueryStates(fieldErrorParser);
  const submitGigWithId = submitGig.bind(null, id);
  const [formState, formAction] = useFormState(
    submitGigWithId,
    EMPTY_FORM_STATE,
  );
  const [isPending, startTransition] = useTransition();

  const { ref } = useFormFeedback(formState, {
    onSuccess: ({ formState, reset }) => {
      if (formState.message) {
        toast.success(formState.message);
      }
      reset();
    },
    onError: ({ formState }) => {
      if (formState.message) {
        toast.error(formState.message);
      }
    },
  });

  async function handleSaveGigWrapper(props: SaveGigProps) {
    const resultSave = await handleSaveGig(props);

    if (!resultSave) return;
    if (resultSave.result === "Error") {
      void setFieldError({
        key: props.key,
        error: resultSave.resultDescription,
      });
    }
    void setFieldError({ key: null, error: null });
  }

  const handleCopy = () => {
    startTransition(() => {
      void copyInfoFromClient(id);
    });
  };

  return (
    <form
      action={formAction}
      ref={ref}
      className="  grid  grid-cols-12 items-start justify-start gap-3"
    >
      <Card className="col-span-12 p-4">
        <CardHeader className="flex flex-row gap-4">
          <CardTitle>Gig Details</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className=" form mx-auto  grid grid-cols-9 gap-4 pt-4 ">
          <GigDetails
            {...props}
            handleSaveGigWrapper={handleSaveGigWrapper}
            fieldError={fieldError}
            formState={formState}
          />
        </CardContent>
      </Card>
      <ClientDetails {...props} />
      <Card className="col-span-6 p-4">
        <CardHeader className="flex flex-row items-center justify-start gap-4">
          <CardTitle>Venue Details</CardTitle>
          <Button
            size="sm"
            type="button"
            isLoading={isPending}
            variant={"ghost"}
            className="h-0 w-max  space-y-0 p-0 text-xs underline hover:text-secondary-500"
            onClick={handleCopy}
          >
            Same as client?
          </Button>
        </CardHeader>
        <Separator />
        <CardContent className=" form mx-auto  grid grid-cols-6 gap-4  ">
          <VenueDetails
            {...props}
            handleSaveGigWrapper={handleSaveGigWrapper}
            fieldError={fieldError}
            formState={formState}
          />
        </CardContent>
      </Card>

      <noscript>
        {formState.status === "ERROR" && (
          <div style={{ color: "red" }}>{formState.message}</div>
        )}

        {formState.status === "SUCCESS" && (
          <div style={{ color: "green" }}>{formState.message}</div>
        )}
      </noscript>
    </form>
  );
}

interface FormProps {
  handleSaveGigWrapper: (props: SaveGigProps) => Promise<void>;
  fieldError: { key: string | null; error: string | null };
  setFieldError?: (props: { key: string | null; error: string | null }) => void;
  formState: { status: string; message: string };
}

function GigDetails({
  handleSaveGigWrapper,
  fieldError,
  formState,
  ...props
}: Props & FormProps) {
  const { id, gig } = props;
  const { gigDate, timeStart, timeEnd, price, amountPaid } = gig;

  function handleTimeInputBlur(e: FocusEvent<HTMLInputElement>) {
    const selectedTime = e.target.value;

    if (selectedTime && gigDate) {
      const [hours, minutes] = selectedTime.split(":");
      const gigDateObj = new Date(gigDate);
      const saveGigdTime = new Date(
        gigDateObj.getFullYear(),
        gigDateObj.getMonth(),
        gigDateObj.getDate(),
        Number(hours),
        Number(minutes),
      );
      void handleSaveGigWrapper({
        id: id,
        key: e.target.name as keyof GigProps,
        value: saveGigdTime.toISOString(),
      });
    }
  }
  const datePickerImperativeHandleRef = useRef<{
    reset: () => void;
  }>(null);

  const durationHours =
    timeStart && timeEnd ? calculateTimeDifference(timeStart, timeEnd) : null;

  const balance =
    price && amountPaid ? Number(price) - Number(amountPaid) : null;

  return (
    <>
      <Label className="col-span-3">
        <DatePicker
          id="gigDate"
          name="gigDate"
          defaultValue={gigDate ? formatDate(gigDate, "formal") : ""}
          onSelect={(date) => {
            void handleSaveGigWrapper({
              id: id,
              key: "gigDate",
              value: date.toISOString(),
            });
          }}
          imperativeHandleRef={datePickerImperativeHandleRef}
        />
        <span>Gig Date</span>
        <FieldError
          formState={formState}
          error={fieldError.key === "gigDate" ? fieldError.error : null}
          name="gigDate"
        />
      </Label>

      <Label className="col-span-1">
        <Input
          type="time"
          disabled={gigDate == null}
          name="timeStart"
          defaultValue={timeStart ? getTimeFromDate(timeStart) : undefined}
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleTimeInputBlur(e)
          }
        />
        <span>Start</span>
        <FieldError
          formState={formState}
          error={fieldError.key === "timeStart" ? fieldError.error : null}
          name="timeStart"
        />
      </Label>

      <Label className="col-span-1">
        <Input
          type="time"
          disabled={gigDate == null}
          name="timeEnd"
          defaultValue={timeEnd ? getTimeFromDate(timeEnd) : undefined}
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleTimeInputBlur(e)
          }
        />
        <span>End</span>
        <FieldError
          formState={formState}
          error={fieldError.key === "timeEnd" ? fieldError.error : null}
          name="timeEnd"
        />
      </Label>

      <Label className="col-span-1 ">
        <Input
          disabled={true}
          name="duration"
          defaultValue={durationHours ? durationHours : undefined}
        />
        <span>Duration</span>
      </Label>

      <Label className="col-span-1">
        <Input
          type="number"
          inputMode="numeric"
          name="price"
          defaultValue={Number(price)}
          onBlur={(e: FocusEvent<HTMLInputElement>) => {
            void handleSaveGigWrapper({
              id: id,
              key: e.target.name as keyof GigProps,
              value: e.target.value,
            });
          }}
        />
        <span>Price</span>
        <FieldError
          formState={formState}
          error={fieldError.key === "price" ? fieldError.error : null}
          name="price"
        />
      </Label>

      <Label className="col-span-1">
        <Input
          type="number"
          inputMode="numeric"
          name="amountPaid"
          defaultValue={Number(amountPaid)}
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleSaveGigWrapper({
              id: id,
              key: e.target.name as keyof GigProps,
              value: e.target.value,
            })
          }
        />
        <span>Paid</span>
        <FieldError
          formState={formState}
          error={fieldError.key === "amountPaid" ? fieldError.error : null}
          name="amountPaid"
        />
      </Label>

      <Label className="col-span-1">
        <Input
          disabled={true}
          name="balance"
          defaultValue={balance ? formatPrice(balance) : ""}
          className={cn(
            "disabled:bg-none",
            balance && balance > 0 && "font-bold text-destructive",
          )}
        />
        <span>Balance</span>
      </Label>

      {/* <Label className="col-span-3">
        <Input name="clientId" defaultValue={clientId ? clientName : ""} />
        <span>Client</span>
      </Label> */}

      <Label className="col-span-3 row-start-2">
        {/* {props.clientPicker} */}
        <ClientPicker {...props} />
        <span>Client</span>
      </Label>

      <Label className="col-span-3  row-start-2">
        <SantaPicker {...props} />
        <span>Santa</span>
      </Label>

      <Label className="col-span-3  row-start-2">
        <MrsSantaPicker {...props} />
        <span>Mrs Santa</span>
      </Label>
    </>
  );
}

function ClientPicker(props: Props) {
  const [open, setOpen] = useQueryState(
    "modalOpenClient",
    parseAsBoolean.withDefault(false),
  );

  function handleDrawerOpen() {
    void setOpen(!open);
  }

  return (
    <Sheet open={open} onOpenChange={handleDrawerOpen}>
      <SheetTrigger className="w-full justify-start text-left" asChild>
        <Button variant="outline" className="text-xs">
          <Icons.user className=" mr-2 size-3 " />
          {props.client?.client}
          <Input type="hidden" name="clientId" value={props.client?.client} />
        </Button>
      </SheetTrigger>
      <SheetContent className="">{props.clientPicker}</SheetContent>
    </Sheet>
  );
}

function SantaPicker(props: Props) {
  const [open, setOpen] = useQueryState(
    "modalOpenSanta",
    parseAsBoolean.withDefault(false),
  );

  function handleDrawerOpen() {
    void setOpen(!open);
  }

  return (
    <Sheet open={open} onOpenChange={handleDrawerOpen}>
      <SheetTrigger className="w-full justify-start text-left" asChild>
        <Button variant="outline">
          <Icons.santa className=" mr-2 size-3" />
          {props.santa?.role}
          <Input
            type="hidden"
            name="santaId"
            value={props?.santa?.role || undefined}
          />
        </Button>
      </SheetTrigger>
      <SheetContent className="">{props.santaPicker}</SheetContent>
    </Sheet>
  );
}

function MrsSantaPicker(props: Props) {
  const [open, setOpen] = useQueryState(
    "modalOpenMrsSanta",
    parseAsBoolean.withDefault(false),
  );

  function handleDrawerOpen() {
    void setOpen(!open);
  }

  return (
    <Sheet open={open} onOpenChange={handleDrawerOpen}>
      <SheetTrigger className="w-full justify-start text-left" asChild>
        <Button variant="outline">
          <Icons.mrsSanta className=" mr-2 size-3" />
          {props.mrsSanta?.role}
          <Input
            type="hidden"
            name="mrsSantaId"
            value={props?.mrsSanta?.role || undefined}
          />
        </Button>
      </SheetTrigger>
      <SheetContent className="">{props.mrsSantaPicker}</SheetContent>
    </Sheet>
  );
}

function ClientDetails(props: Props) {
  // TOOD: Cloneelement instead?
  return <div className="form col-span-6">{props.clientDetails}</div>;
}

function VenueDetails({
  handleSaveGigWrapper,
  fieldError,
  formState,
  ...props
}: Props & FormProps) {
  const { id, gig } = props;
  const {
    venueAddressName,
    contactName,
    contactPhoneCell,
    contactPhoneLand,
    venueType,
    contactEmail,
    venueAddressStreet,
    venueAddressCity,
    venueAddressState,
    venueAddressZip,
    notesVenue,
  } = gig;

  return (
    <>
      <Label className="col-span-6">
        <Input
          name="venueAddressName"
          defaultValue={venueAddressName ? venueAddressName : undefined}
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleSaveGigWrapper({
              id: id,
              key: e.target.name as keyof GigProps,
              value: e.target.value,
            })
          }
        />
        <span>Venue</span>
        <FieldError
          formState={formState}
          error={
            fieldError.key === "venueAddressName" ? fieldError.error : null
          }
          name="venueAddressName"
        />
      </Label>

      <Label className="col-span-6">
        <Input
          name="contactName"
          defaultValue={contactName ? contactName : undefined}
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleSaveGigWrapper({
              id: id,
              key: e.target.name as keyof GigProps,
              value: e.target.value,
            })
          }
        />
        <span>Contact at Venue</span>
        <FieldError
          formState={formState}
          error={fieldError.key === "contactName" ? fieldError.error : null}
          name="contactName"
        />
      </Label>

      <Label className="col-span-2">
        <Input
          name="contactPhoneCell"
          defaultValue={contactPhoneCell ? contactPhoneCell : undefined}
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleSaveGigWrapper({
              id: id,
              key: e.target.name as keyof GigProps,
              value: e.target.value,
            })
          }
        />
        <span>Contact Phone (Cell)</span>
        <FieldError
          formState={formState}
          error={
            fieldError.key === "contactPhoneCell" ? fieldError.error : null
          }
          name="contactPhoneCell"
        />
      </Label>

      <Label className="col-span-2">
        <Input
          name="contactPhoneLand"
          defaultValue={contactPhoneLand ? contactPhoneLand : undefined}
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleSaveGigWrapper({
              id: id,
              key: e.target.name as keyof GigProps,
              value: e.target.value,
            })
          }
        />
        <span>Contact Phone (Landline)</span>
        <FieldError
          formState={formState}
          error={
            fieldError.key === "contactPhoneLand" ? fieldError.error : null
          }
          name="contactPhoneLand"
        />
      </Label>

      <Label className="col-span-2">
        <Select
          name="venueType"
          defaultValue={venueType ? venueType : undefined}
          onValueChange={(value: VenueType) => {
            void handleSaveGigWrapper({
              id: id,
              key: "venueType",
              value: value,
            });
          }}
        >
          <SelectTrigger className="bg-white capitalize">
            <SelectValue placeholder={venueType} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.values(VenueType).map((option) => (
                <SelectItem key={option} value={option} className="capitalize">
                  {option}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <span>Venue Type</span>
        <FieldError
          formState={formState}
          error={fieldError.key === "venueType" ? fieldError.error : null}
          name="venueType"
        />
      </Label>

      <Label className="col-span-6">
        <Input
          name="contactEmail"
          defaultValue={contactEmail ? contactEmail : undefined}
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleSaveGigWrapper({
              id: id,
              key: e.target.name as keyof GigProps,
              value: e.target.value,
            })
          }
        />
        <span>Contact Email</span>
        <FieldError
          formState={formState}
          error={fieldError.key === "contactEmail" ? fieldError.error : null}
          name="contactEmail"
        />
      </Label>

      <Label className="col-span-6">
        <Input
          name="venueAddressStreet"
          defaultValue={venueAddressStreet ? venueAddressStreet : undefined}
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleSaveGigWrapper({
              id: id,
              key: e.target.name as keyof GigProps,
              value: e.target.value,
            })
          }
        />
        <span>Venue Address (Street)</span>
        <FieldError
          formState={formState}
          error={
            fieldError.key === "venueAddressStreet" ? fieldError.error : null
          }
          name="venueAddressStreet"
        />
      </Label>

      <Label className="col-span-2">
        <Input
          name="venueAddressCity"
          defaultValue={venueAddressCity ? venueAddressCity : undefined}
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleSaveGigWrapper({
              id: id,
              key: e.target.name as keyof GigProps,
              value: e.target.value,
            })
          }
        />
        <span>City</span>
        <FieldError
          formState={formState}
          error={
            fieldError.key === "venueAddressCity" ? fieldError.error : null
          }
          name="venueAddressCity"
        />
      </Label>

      <Label className="col-span-2">
        <Input
          name="venueAddressState"
          defaultValue={venueAddressState ? venueAddressState : undefined}
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleSaveGigWrapper({
              id: id,
              key: e.target.name as keyof GigProps,
              value: e.target.value,
            })
          }
        />
        <span>State</span>
        <FieldError
          formState={formState}
          error={
            fieldError.key === "venueAddressState" ? fieldError.error : null
          }
          name="venueAddressState"
        />
      </Label>

      <Label className="col-span-2">
        <Input
          name="venueAddressZip"
          defaultValue={venueAddressZip ? venueAddressZip : undefined}
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleSaveGigWrapper({
              id: id,
              key: e.target.name as keyof GigProps,
              value: e.target.value,
            })
          }
        />
        <span>Zip</span>
        <FieldError
          formState={formState}
          error={fieldError.key === "venueAddressZip" ? fieldError.error : null}
          name="venueAddressZip"
        />
      </Label>

      <Label className="col-span-6">
        <Textarea
          name="notesVenue"
          defaultValue={notesVenue ? notesVenue : undefined}
          onBlur={(e: FocusEvent<HTMLTextAreaElement>) =>
            void handleSaveGigWrapper({
              id: id,
              key: e.target.name as keyof GigProps,
              value: e.target.value,
            })
          }
        />
        <span>Notes for Venue</span>
        <FieldError
          formState={formState}
          error={fieldError.key === "notesVenue" ? fieldError.error : null}
          name="notesVenue"
        />
      </Label>
    </>
  );
}
