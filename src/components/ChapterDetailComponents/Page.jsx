import React from "react";

export const Page = React.forwardRef((props, ref) => {
  return (
    <div className="relative w-full h-full bg-[#202124] flex items-center justify-center p-5" ref={ref} style={{ overflow: "hidden" }}>
      <div
        className="page-content"
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          width: "auto",
          height: "auto",
          objectFit: "contain", // Ensures the content fits within the page
        }}
      >
        {props.children}
      </div>
    </div>
  );
});
