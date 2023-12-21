import { StateCreator } from "zustand";

export interface User {
  displayName?: string | null;
  photoURL?: string | null;
  uid: string;
  email: string;
}

export interface UserSlice {
  user: User | null;
  accounttype: string | null;
  fetchUser: () => object | null;
  fetchAccountType: () => string | null;
  setUser: (user: User) => void;
  setAccoutType: (accounttype: string) => void;
  removeUser: () => void;
}

export const createUserSlice: StateCreator<UserSlice> = (set, get) => ({
  user: null,
  accounttype: null,
  fetchUser: () => {
    return get().user;
  },
  fetchAccountType: () => {
    return get().accounttype;
  },
  setUser: (user: User | null) => {
    set({ user });
  },
  setAccoutType: (accounttype: string) => {
    set({ accounttype });
  },
  removeUser: () => {
    set({ user: null });
  },
});
