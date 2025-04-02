import React from "react";
import { Loader2 } from "lucide-react";

const ReusableLoader = ({ title }) => {
  return (
    <div className="p-4 ">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-bcg_sidebar_col" />
        <p className="text-sm text-gray-500">{title ? title : "Loading..."}</p>
      </div>
    </div>
  );
};

export default ReusableLoader;
