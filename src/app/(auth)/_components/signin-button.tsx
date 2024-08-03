import { signin } from "@/app/_actions/auth/signin";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

export function SignInGoogle() {
  return (
    <form action={signin}>
      <Button type="submit">
        <Icons.gmail className="mr-2 size-4" />
        Gmail
      </Button>
    </form>
  );
}
