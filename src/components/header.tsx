import Paragraph from "./paragraph";
import { Separator } from "./ui/separator";

interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
  separator?: boolean;
}

export default function DashboardHeader({
  heading,
  text,
  children,
  separator,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between  ">
      <div className="grid gap-1">
        <h1 className="font-heading text-3xl font-bold md:text-4xl">
          {heading}
        </h1>
        {text && (
          <Paragraph className="text-muted-foreground">{text}</Paragraph>
        )}
        {separator && <Separator className="mt-2" />}
      </div>
      {children}
    </div>
  );
}
