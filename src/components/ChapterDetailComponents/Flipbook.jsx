import HTMLFlipBook from "react-pageflip";
import { Page } from "./Page";
import parse from "html-react-parser";

export const Flipbook = ({ pages, onFlip }) => {
  return (
    <HTMLFlipBook
      width={550}
      height={733}
      size="stretch"
      minWidth={315}
      maxWidth={1000}
      minHeight={400}
      maxHeight={1533}
      showCover={true}
      mobileScrollSupport={true}
      swipeDistance={10}
      flippingTime={500}
      className="text-left text-yellow-50 bg-[#202124] px-3 "
      onFlip={onFlip}
    >
      {pages.map((page, index) => (
        <Page key={index} number={index}>
          {typeof page === "string" ? parse(page) : null}
        </Page>
      ))}
    </HTMLFlipBook>
  );
};
