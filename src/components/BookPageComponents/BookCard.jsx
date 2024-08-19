import React from "react";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ModeComment from "@mui/icons-material/ModeComment";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Divider from "@mui/material/Divider";
import Rating from "@mui/material/Rating";
import { Typography } from "@mui/material";
import { followBookAction } from "../../redux/book/book.action";
import { isFollowedByReqUser } from "../../utils/isFollowedByReqUser";
import { useDispatch, useSelector } from "react-redux";

export function BookCard({ book, scrollToCommentSection }) {
  const { auth } = useSelector((store) => store);
  const dispatch = useDispatch();

  const handleFollowBook = () => {
    dispatch(followBookAction(book.id));
  };

  return (
    <Card elevation={0} sx={{ display: "flex", padding: 2, borderRadius: "16px", width: "100%", height: "auto" }}>
      <CardMedia
        component="img"
        image={book.bookCover}
        alt={book.title}
        sx={{
          width: "40%",
          height: "auto",
          borderRadius: "12px",
          boxShadow: "0 2px 8px 0 #c1c9d7, 0 -2px 8px 0 #cce1e9",
          marginRight: 2,
        }}
      />
      <CardContent sx={{ flex: 1 }}>
        <Box mb={2}>
          <Typography
            component="h3"
            sx={{
              fontSize: 20,
              fontWeight: "bold",
              letterSpacing: "0.5px",
              marginBottom: 0,
              marginRight: 1.5,
              display: "inline-block",
            }}
          >
            {book.title}
          </Typography>
          <Rating name={"rating"} value={2} size={"medium"} sx={{ verticalAlign: "text-top" }} />
        </Box>
        <Box textAlign={"left"}>
          <Typography component="p" sx={{ fontSize: 16, color: "grey.500", mb: "1.5rem", overflow: "auto" }}>
            {book.description}
          </Typography>
          <Typography component="p" sx={{ fontSize: 16, color: "grey.500", mb: "1.5rem" }}>
            Author: {book.authorName}
          </Typography>
          <Typography component="p" sx={{ fontSize: 16, color: "grey.500", mb: "1.5rem" }}>
            Illustrator: {book.artistName}
          </Typography>
        </Box>

        <Divider light sx={{ mt: 2, mb: 2 }} />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginLeft: "auto",
              gap: 2,
            }}
          >
            <Box
              component="button"
              type={"button"}
              onClick={scrollToCommentSection}
              sx={{
                display: "flex",
                alignItems: "center",
                color: "text.secondary",
                "&:hover, &:focus": {
                  color: "primary.main",
                  "& svg": {
                    opacity: 1,
                  },
                },
              }}
            >
              <ModeComment
                sx={{
                  opacity: 0.6,
                  fontSize: "1.25em",
                  verticalAlign: "middle",
                  "&:first-child": {
                    marginRight: 1,
                  },
                  "&:last-child": {
                    marginLeft: 1,
                  },
                }}
              />{" "}
              135
            </Box>
            <Box
              component="button"
              type={"button"}
              onClick={handleFollowBook}
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {isFollowedByReqUser(auth.user.id, book) ? <FavoriteIcon /> : <FavoriteBorderIcon />} 12
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
