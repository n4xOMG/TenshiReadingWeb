import parse from "html-react-parser";
import HTMLFlipBook from "react-pageflip";
import { Page } from "./Page";
import { useCallback, useEffect, useRef, useState } from "react";

export const Flipbook = ({ pages, totalPages, initialPage, saveProgress, onPageChange }) => {
  const flipBookRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    if (initialPage !== null && initialPage !== undefined) {
      setCurrentPage(initialPage);
    }
  }, [initialPage]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        if (currentPage < totalPages - 1) {
          flipBookRef.current.pageFlip().flipNext();
        }
      } else if (event.key === "ArrowLeft") {
        if (currentPage > 0) {
          flipBookRef.current.pageFlip().flipPrev();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentPage, totalPages]);

  const handlePageFlip = useCallback(
    (e) => {
      const pageIndex = e.data;
      console.log("handlePageFlip called with pageIndex:", pageIndex);

      if (pageIndex >= totalPages || pageIndex < 0) {
        return;
      }

      setCurrentPage(pageIndex);
      onPageChange(pageIndex); // Update the parent component's state

      if (pageIndex === totalPages - 1) {
        saveProgress();
      }
      console.log("Current page: ", pageIndex);
    },
    [totalPages, onPageChange, saveProgress]
  );

  const nonClickableAreaStyle = {
    position: "absolute",
    top: "20%",
    left: "20%",
    right: "20%",
    bottom: "20%",
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
        onFlip={handlePageFlip}
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
