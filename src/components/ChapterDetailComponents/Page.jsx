import React from "react";

export const Page = React.forwardRef((props, ref) => {
  return (
    <div className="bg-[#202124] h-full w-full flex items-center justify-center px-3" ref={ref}>
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
