import { Icons } from "./icons";

const Spinner = () => {
  return (
    <div
      role="status"
      className="flex flex-1 flex-col items-center justify-center self-center"
    >
      <Icons.spinner className="h-8 w-8 animate-spin text-primary-foreground/80" />
    </div>
  );
};

export { Spinner };
