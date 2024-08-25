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

  return (
    <HTMLFlipBook
      ref={flipBookRef}
      width={550}
      height={733}
      size="stretch"
      minWidth={315}
      maxWidth={1000}
      minHeight={400}
      maxHeight={1533}
      mobileScrollSupport={true}
      swipeDistance={1}
      flippingTime={500}
      className="text-left text-yellow-50 bg-[#202124] px-3"
      onFlip={onFlip}
      startPage={currentPage !== null && currentPage !== undefined ? currentPage : 0} // Add check here
    >
      {pages.map((page, index) => (
        <Page key={index} number={index}>
          {typeof page === "string" ? parse(page) : null}
        </Page>
      ))}
    </HTMLFlipBook>
  );
};
