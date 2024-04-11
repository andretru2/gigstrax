"use client";

import { SubmitButton } from "../form/submit-button";
import { useRouter } from "next/navigation";

interface Props {
  addMore?: boolean;
}

export function MultiEventSubmit(props: Props) {
  const router = useRouter();

  function handleSubmit() {
    //clear the gig date, but keep the start/end
    console.log("submit");
    if (!props.addMore) return router.push("/dashboard/gigs");
  }

  return (
    <SubmitButton
      onClick={handleSubmit}
      label={props.addMore ? "Create & Add More" : "Create & Finish"}
    />
  );
}
