import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import { Backdrop, Box, Button, CircularProgress, Dialog, TextField, Toolbar } from "@mui/material";
import DOMPurify from "dompurify";
import isHotkey from "is-hotkey";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEditor } from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, withReact } from "slate-react";
import { deserializeContent, serializeContent } from "../../../../../pages/UploadChapterPage/HtmlSerialize";
import { getCurrentUserByJwt } from "../../../../../redux/authentication/auth.actions";
import { editChapterAction, getAllChaptersByBookIdAction } from "../../../../../redux/chapter/chapter.action";
import { BlockButton } from "../../../../UploadChapterPageComponents/BlockButton";
import { Element, Leaf } from "../../../../UploadChapterPageComponents/Element";
import { InsertImageButton, withImages } from "../../../../UploadChapterPageComponents/InsertImageHandler";
import { MarkButton, toggleMark } from "../../../../UploadChapterPageComponents/MarkButton";
import { HOTKEYS } from "../../../../UploadChapterPageComponents/ToolbarFunctions";

export default function EditChapterModal({ open, onClose, bookId, chapterDetails }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const jwt = localStorage.getItem("jwt");
  const { auth } = useSelector((store) => store);
  const editor = useMemo(() => withImages(withHistory(withReact(createEditor()))), []);
  const [content, setContent] = useState(null);

  useEffect(() => {
    const fetchChapterContent = async () => {
      setLoading(true);
      try {
        const html = chapterDetails.content;
        const document = new DOMParser().parseFromString(html, "text/html");
        setContent(deserializeContent(document.body));
      } catch (error) {
        console.error("Error fetching chapter content:", error);
      } finally {
        setLoading(false);
      }
    };

    if (chapterDetails.id) {
      fetchChapterContent();
    }
  }, [dispatch, chapterDetails.id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    const json = Object.fromEntries(data.entries());
    const serializedContent = serializeContent(content); // Serialize the content to HTML
    json.content = DOMPurify.sanitize(serializedContent);
    json.translatorId = auth.user.id;
    console.log("Form Data:", json);
    try {
      await dispatch(editChapterAction(bookId, chapterDetails.id, { data: json }));
      await dispatch(getAllChaptersByBookIdAction(bookId));
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  useEffect(() => {
    setLoading(true);
    if (jwt) {
      dispatch(getCurrentUserByJwt(jwt)).finally(() => setLoading(false));
    }
  }, [dispatch, jwt]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box component="form" onSubmit={handleSubmit} noValidate className="rounded-lg border-stone-950 px-3">
        <TextField
          margin="normal"
          required
          fullWidth
          id="chapterNum"
          label="Chapter number"
          name="chapterNum"
          defaultValue={chapterDetails.chapterNum}
        />
        <TextField margin="normal" required fullWidth id="title" label="Chapter title" name="title" defaultValue={chapterDetails.title} />
        <input type="hidden" name="content" value={JSON.stringify(content)} />
        {content && (
          <Slate
            editor={editor}
            value={content}
            initialValue={content}
            onChange={(value) => {
              setContent(value);
              const isAstChange = editor.operations.some((op) => "set_selection" !== op.type);
              if (isAstChange) {
                const content = JSON.stringify(value);
                localStorage.setItem("content", content);
              }
            }}
          >
            <Toolbar>
              <MarkButton format={"bold"} icon={<FormatBoldIcon />} />
              <MarkButton format={"italic"} icon={<FormatItalicIcon />} />
              <MarkButton format={"underline"} icon={<FormatUnderlinedIcon />} />
              <BlockButton format={"left"} icon={<FormatAlignLeftIcon />} />
              <BlockButton format={"center"} icon={<FormatAlignCenterIcon />} />
              <BlockButton format={"right"} icon={<FormatAlignRightIcon />} />
              <BlockButton format={"justify"} icon={<FormatAlignJustifyIcon />} />
              <InsertImageButton />
            </Toolbar>
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder="Enter some text..."
              onKeyDown={(event) => {
                for (const hotkey in HOTKEYS) {
                  if (isHotkey(hotkey, event)) {
                    event.preventDefault();
                    const mark = HOTKEYS[hotkey];
                    toggleMark(editor, mark);
                  }
                }
              }}
            />
          </Slate>
        )}
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Upload
        </Button>
      </Box>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  );
}