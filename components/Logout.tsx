"use client";

import { signOut } from "next-auth/react";

type Props = {};

const Logout = (props: Props) => {
  const logout = async () => {
    signOut();
  };
  return (
    <div onClick={logout} className="disabled:opacity-80 text-center font-medium rounded-md focus:ring ring-primary/10 outline-none flex items-center justify-center gap-2 border border-red-500 hover:bg-red-500 hover:text-white transition-colors py-2 px-4 cursor-pointer">
      Logout
    </div>
  );
};

export default Logout;
