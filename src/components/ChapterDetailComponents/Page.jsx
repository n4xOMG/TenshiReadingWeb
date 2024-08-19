import React from "react";

export const Page = React.forwardRef((props, ref) => {
  return (
    <div className=" relative w-full h-full bg-[#202124] p-5" ref={ref}>
      <div className="mb-5">{props.children}</div>
      <div className=" absolute bottom-2 right-8 text-white ">Page number: {props.number}</div>
    </div>
  );
});
