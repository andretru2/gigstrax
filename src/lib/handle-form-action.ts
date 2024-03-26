import { toast } from "sonner";

interface HandleFormAction<FormData, T> {
  key: keyof FormData;
  value: unknown;
  callback: (formData: FormData) => Promise<T>;
}

export const handleFormAction = async <
  FormData extends Record<string, unknown>,
>({
  key,
  value,
  callback,
}: HandleFormAction<FormData>): Promise<void> => {
  if (!key || !value) return;

  const formData = new FormData();
  formData.append(key, value);

  const res = await callback(formData);
  if (!res) {
    return void toast.error("An unknown error occurred");
  }

  res?.status === "ERROR"
    ? startTransition(() => {
        const error = res?.issues[0];
        // Assuming setFieldError is defined elsewhere in your component or context
        setFieldError({ key, error });
        toast.error(error);
      })
    : startTransition(() => {
        toast.success(res?.message);
        // Assuming setFieldError is defined elsewhere in your component or context
        setFieldError({});
        // setState has been removed, so no need to update the state here
      });
};
