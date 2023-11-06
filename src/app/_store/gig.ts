import { create } from "zustand";
import { type ClientProps } from "@/server/db";

type State = {
  client: ClientProps | undefined;
};

type Actions = {
  setClient: (client: Partial<ClientProps> | undefined) => void;
};

const initalState: State = {
  client: undefined,
};

export const useGigStore = create<State & Actions>((set, get) => ({
  ...initalState,
  setClient: (props: Partial<ClientProps> | undefined) => {
    set({ client: props });
  },
}));
