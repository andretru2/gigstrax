import { ErrorCard } from "@/components/error-card";

// interface Props {
//   params: {
//     gigId: string;
//   };
// }

export default function NotFound() {
  // const gigId = params.gigId;

  return (
    <ErrorCard
      title="Gig not found"
      description="Unable to find gig. Please try again or contact Andres for assistance."
      // retryLink={`/dashboard/gigs/${gigId}`}
      retryLinkText="Go to Gig"
    />
  );
}
