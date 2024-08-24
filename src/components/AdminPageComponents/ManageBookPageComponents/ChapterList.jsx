import React from "react";
import { ChapterItem } from "./ChapterItem";
import { FixedSizeList } from "react-window";

export const ChapterList = React.memo(({ chapters, onEditChapter, onDeleteChapter }) => (
  <FixedSizeList
    height={400}
    itemCount={chapters.length}
    itemSize={80}
    width="100%"
    itemData={{ chapters, onEditChapter, onDeleteChapter }}
  >
    {({ index, style, data }) => (
      <ChapterItem chapter={data.chapters[index]} onEdit={data.onEditChapter} onDelete={data.onDeleteChapter} style={style} />
    )}
  </FixedSizeList>
));
