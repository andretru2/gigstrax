import { Icons } from "./icons";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

const Spinner = (props: Props) => {
  return (
    <div
      role="status"
      className={cn(
        props.className,
        "flex flex-1 flex-col items-center justify-center self-center",
      )}
    >
      <Icons.spinner className="h-8 w-8 animate-spin text-primary-foreground/50" />
    </div>
  );
};

export { Spinner };
