import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  FormControlLabel,
  TextField,
  Toolbar,
} from "@mui/material";
import isHotkey from "is-hotkey";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEditor } from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, withReact } from "slate-react";
import { serializeContent } from "../../../../../pages/UploadChapterPage/HtmlSerialize";
import { getCurrentUserByJwt } from "../../../../../redux/authentication/auth.actions";
import { addChapterAction, getAllChaptersByBookIdAction } from "../../../../../redux/chapter/chapter.action";
import { BlockButton } from "../../../../UploadChapterPageComponents/BlockButton";
import { Element, Leaf } from "../../../../UploadChapterPageComponents/Element";
import { InsertImageButton, withImages } from "../../../../UploadChapterPageComponents/InsertImageHandler";
import { MarkButton, toggleMark } from "../../../../UploadChapterPageComponents/MarkButton";
import { HOTKEYS } from "../../../../UploadChapterPageComponents/ToolbarFunctions";
import DOMPurify from "dompurify";
import { getAllLanguages } from "../../../../../redux/book/book.action";
export default function AddChapterModal({ open, onClose, bookId }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const jwt = localStorage.getItem("jwt");
  const { user } = useSelector((store) => store.auth);
  const { languages } = useSelector((store) => store.book);
  const [chosenLanguage, setChosenLanguage] = useState([]);
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
  const [showAdaptation, setShowAdaptation] = useState(false);
  const [adaptationSeason, setAdaptationSeason] = useState({
    season: "",
    episode: "",
    part: "",
  });

  const handleAdaptationChange = (e) => {
    const { name, value } = e.target;
    setAdaptationSeason((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    const json = Object.fromEntries(data.entries());
    const serializedContent = serializeContent(content);
    json.content = DOMPurify.sanitize(serializedContent);
    json.translatorId = user.id;
    json.language = chosenLanguage;

    if (showAdaptation) {
      json.adaptationSeason = {
        season: adaptationSeason.season,
        episode: adaptationSeason.episode,
        part: adaptationSeason.part,
      };
    }

    console.log("Form Data:", json);
    try {
      await dispatch(addChapterAction(bookId, { data: json }));
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
    const fetchLanguages = async () => {
      setLoading(true);
      try {
        await dispatch(getAllLanguages());
      } catch (e) {
        console.error("Error fetching tags: ", e);
      } finally {
        setLoading(false);
      }
    };
    if (!languages) {
      fetchLanguages();
    }
    setLoading(true);
    if (jwt) {
      dispatch(getCurrentUserByJwt(jwt)).finally(() => setLoading(false));
    }
  }, [dispatch, jwt]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box component="form" onSubmit={handleSubmit} noValidate className="rounded-lg border-stone-950 px-3">
        <TextField margin="normal" required fullWidth id="chapterNum" label="Chapter number" name="chapterNum" />
        <TextField margin="normal" required fullWidth id="title" label="Chapter title" name="title" />
        <FormControlLabel
          control={
            <Checkbox
              checked={showAdaptation}
              onChange={(e) => setShowAdaptation(e.target.checked)}
              name="showAdaptation"
              color="primary"
            />
          }
          label="Adapted Chapter"
        />
        {showAdaptation && (
          <>
            <TextField
              margin="normal"
              fullWidth
              id="season"
              label="Season"
              name="season"
              placeholder="Ex: 1, 2"
              value={adaptationSeason.season}
              onChange={handleAdaptationChange}
            />
            <TextField
              type="number"
              margin="normal"
              fullWidth
              id="episode"
              label="Episode"
              name="episode"
              placeholder="Ex: 1, 2"
              value={adaptationSeason.episode}
              onChange={handleAdaptationChange}
            />
            <TextField
              type="number"
              margin="normal"
              fullWidth
              id="part"
              label="Part"
              name="part"
              placeholder="Ex: 1, 2"
              value={adaptationSeason.part}
              onChange={handleAdaptationChange}
            />
            <Autocomplete
              limitTags={1}
              id="language"
              options={languages}
              getOptionLabel={(option) => option.name}
              defaultValue={[]}
              onChange={(event, newValue) => setChosenLanguage(newValue)}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => <TextField {...params} label="Language" placeholder="Language" />}
              sx={{ width: "500px" }}
            />
          </>
        )}
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
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  );
}
