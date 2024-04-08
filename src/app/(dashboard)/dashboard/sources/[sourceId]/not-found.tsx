import { ErrorCard } from "@/components/error-card";

export default function NotFound() {
  return (
    <ErrorCard
      title="Gig not found"
      description="Unable to find gig. Please try again or contact Andres for assistance."
      retryLinkText="Go to Gig"
    />
  );
}
