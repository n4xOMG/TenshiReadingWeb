import React, { useMemo, useCallback, useState, useEffect } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import { Backdrop, Box, Button, CircularProgress, TextField, Toolbar } from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import { InsertImageButton, withImages } from "../../components/UploadChapterPageComponents/InsertImageHandler";
import { MarkButton, toggleMark } from "../../components/UploadChapterPageComponents/MarkButton";
import { HOTKEYS } from "../../components/UploadChapterPageComponents/ToolbarFunctions";
import isHotkey from "is-hotkey";
import { BlockButton } from "../../components/UploadChapterPageComponents/BlockButton";
import { Element, Leaf } from "../../components/UploadChapterPageComponents/Element";
import { addChapterAction } from "../../redux/chapter/chapter.action";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { serializeContent } from "./HtmlSerialize";
import { getCurrentUserByJwt } from "../../redux/authentication/auth.actions";
import DOMPurify from "dompurify";

const UploadChapterPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const jwt = localStorage.getItem("jwt");
  const { auth } = useSelector((store) => store);
  const editor = useMemo(() => withImages(withHistory(withReact(createEditor()))), []);
  const initialValue = useMemo(
    () =>
      JSON.parse(localStorage.getItem("content")) || [
        {
          type: "paragraph",
          children: [{ text: "A line of text in a paragraph." }],
        },
      ],
    []
  );
  const [content, setContent] = useState(initialValue);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setOpen(true);
    const data = new FormData(event.currentTarget);
    const json = Object.fromEntries(data.entries());
    const serializedContent = serializeContent(content); // Serialize the content to HTML
    json.content = DOMPurify.sanitize(serializedContent); // Sanitize the serialized content
    json.translatorId = auth.user.id;
    console.log("Form Data:", json); // Log the form data
    try {
      const response = await dispatch(addChapterAction(bookId, { data: json }));
      console.log("Response:", response);
      setOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  useEffect(() => {
    setOpen(true);
    if (jwt) {
      dispatch(getCurrentUserByJwt(jwt)).finally(() => setOpen(false));
    }
  }, [dispatch, jwt]);
  return (
    <div>
      <Box component="form" onSubmit={handleSubmit} noValidate className="rounded-lg border-stone-950 px-3">
        <TextField margin="normal" required fullWidth id="chapterNum" label="Chapter number" name="chapterNum" />
        <TextField margin="normal" required fullWidth id="title" label="Chapter title" name="title" />
        <input type="hidden" name="content" value={JSON.stringify(content)} />
        <Slate
          editor={editor}
          value={content}
          initialValue={initialValue}
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
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Upload
        </Button>
      </Box>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default UploadChapterPage;
