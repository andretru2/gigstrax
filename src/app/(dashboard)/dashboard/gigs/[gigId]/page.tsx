import { type Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Manage Product",
  description: "Manage your product",
};

interface Props {
  params: {
    storeId: string;
    productId: string;
  };
}

export default function Page({ params }: Props) {
  const storeId = Number(params.storeId);
  return <h1>create new</h1>;
}
