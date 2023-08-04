import { ErrorCard } from "@/components/error-card";

interface ProductNotFoundProps {
  params: {
    id: string;
  };
}

export default function ProductNotFound({ params }: ProductNotFoundProps) {
  const id = params.id;

  return (
    <ErrorCard
      title="Product not found"
      description="The product may have expired or you may have already updated your product"
      retryLink={`/dashboard/gigs/${id}`}
      retryLinkText="Go to Products"
    />
  );
}
