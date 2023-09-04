"use client";

import { useRef } from "react";

import { useGigStore } from "@/app/_store/gig";
import { type ClientProps } from "@/server/db";

function StoreInitializer({ client }: { client: ClientProps }) {
  const initialized = useRef(false);
  const { setClient } = useGigStore();
  if (!initialized.current) {
    setClient(client);
    // useGigStore.setState({ client });
    initialized.current = true;
  }
  return null;
}

export default StoreInitializer;
