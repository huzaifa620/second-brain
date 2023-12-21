import React from "react";

type Props = {};

const Footer = (props: Props) => {
  return (
    <div className=" bg-gray-200 w-full flex pt-4 pl-2 pr-2 pb-4 lg:pb-10 lg:pl-60 lg:pr-60 flex-col ">
      <div className="w-full ">
        <div className="text-sm text-[#515154] pb-4 border-b-[#ccc] border-b-[1px] ">
          Ready to talk to a solutions specialist?{" "}
          <span className="text-[#556B2F]">Get started</span> or contact us{" "}
          <span className="text-[#556B2F]">here</span>
        </div>
        <div className="text-sm text-[#606064] mt-2">
          Copyright © 2023 Moxo Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Footer;
