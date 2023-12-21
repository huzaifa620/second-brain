import React from "react";
import { getServerSession } from "next-auth";
import Logout from "@/components/Logout";

const page = async () => {
  const session = await getServerSession();
  return (
    <div className="flex flex-col items-center pt-20 h-screen">
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="text-4xl font-semibold">
                User Info
            </div>
            <div className="opacity-50">
                { session ? session.user?.email : "" }
            </div>
            <div>
                <Logout />
            </div>
        </div>
    </div>
  );
};

export default page;
