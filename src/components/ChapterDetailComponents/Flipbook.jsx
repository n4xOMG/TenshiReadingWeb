import parse from "html-react-parser";
import HTMLFlipBook from "react-pageflip";
import { Page } from "./Page";
import { useEffect, useRef, useState } from "react";

export const Flipbook = ({ pages, onFlip, initialPage }) => {
  const flipBookRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    if (initialPage !== null && initialPage !== undefined) {
      setCurrentPage(initialPage);
    }
  }, [initialPage]);

  const nonClickableAreaStyle = {
    position: "absolute",
    top: "5%",
    left: "8%",
    right: "8%",
    bottom: "5%",
    zIndex: 1,
  };

  return (
    <div>
      <div style={{ ...nonClickableAreaStyle }} />
      <HTMLFlipBook
        ref={flipBookRef}
        width={550}
        height={733}
        size="stretch"
        minWidth={315}
        maxWidth={2000}
        minHeight={400}
        maxHeight={2000}
        mobileScrollSupport={true}
        swipeDistance={30}
        flippingTime={500}
        showCover={true}
        className="text-left text-yellow-50 bg-[#202124] px-3 overflow-hidden"
        onFlip={onFlip}
        startPage={currentPage !== null && currentPage !== undefined ? currentPage : 0}
      >
        {pages.map((page, index) => (
          <Page key={index} number={index}>
            {typeof page === "string" ? parse(page) : null}
          </Page>
        ))}
      </HTMLFlipBook>
    </div>
  );
};
