import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function Paragraph({ children, className }: Props) {
  return (
    <p className={cn("prose-md prose max-w-3xl ", className)}>{children}</p>
  );
}
