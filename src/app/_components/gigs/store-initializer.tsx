"use client";

import { useRef } from "react";

import { useGigStore } from "@/app/_store/gig";
import { type ClientProps } from "@/server/db";

function StoreInitializer({ client }: { client: ClientProps }) {
  const initialized = useRef(false);
  const { setClient } = useGigStore();

  if (!initialized.current) {
    console.log("setting client");
    setClient(client);
    // useGigStore.setState({ client });
    initialized.current = true;
  }
  console.log(client);
  return null;
}

export default StoreInitializer;
