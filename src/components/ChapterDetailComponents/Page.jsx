import React from "react";

export const Page = React.forwardRef((props, ref) => {
  return (
    <div
      className="relative h-full bg-[#202124] flex items-center justify-center p-5"
      ref={ref}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
      }}
    >
      <div
        className="page-content"
        style={{
          width: "100%",
          height: "100%",
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      >
        {props.children}
      </div>
    </div>
  );
});
