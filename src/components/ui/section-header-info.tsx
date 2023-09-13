import { type Icons as IconProps, Icons } from "../icons";

interface Props {
  icon: keyof typeof IconProps;
  data: string;
}

export default function SectionHeaderInfo({ icon, data }: Props) {
  const Icon = Icons[icon];
  return (
    <div className="flex flex-row items-center gap-2">
      <Icon className={`h-4 w-4 text-primary/60`} />
      <div
        className={data === "incomplete" ? "italic text-destructive/60" : ""}
      >
        {data}
      </div>
    </div>
  );
}
