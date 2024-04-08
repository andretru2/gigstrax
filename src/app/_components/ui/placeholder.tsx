import { cloneElement } from "react";
import { MessageSquareWarningIcon } from "lucide-react";

type PlaceholderProps = {
  label: string;
  icon?: React.ReactElement;
  button?: React.ReactNode;
};

const Placeholder = ({
  label,
  icon = <MessageSquareWarningIcon />,
  button = null,
}: PlaceholderProps) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-y-4 self-center text-primary-foreground">
      {cloneElement(icon, {
        className: "w-16 h-16 text-primary",
      })}

      <h2 className="text-center text-base">{label}</h2>

      {button ? button : <div />}
    </div>
  );
};

export { Placeholder };
