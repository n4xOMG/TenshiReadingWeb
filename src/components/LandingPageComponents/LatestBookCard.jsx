import { Favorite, MenuBook, Star } from "@mui/icons-material";
import { Box, Button, Card, CardActions, CardContent, CardHeader, Chip, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { followBookAction } from "../../redux/book/book.action";
import { formatDate } from "../../utils/formatDate";
import { isFavouredByReqUser } from "../../utils/isFavouredByReqUser";
import { getOptimizedImageUrl } from "../../utils/optimizeImages";
import { useAuthCheck } from "../../utils/useAuthCheck";
import LoadingSpinner from "../LoadingSpinner";

export default function LatestBookCard({ book, user }) {
  const dispatch = useDispatch();
  const { checkAuth, AuthDialog } = useAuthCheck();
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(user ? isFavouredByReqUser(user, book) : false);
  const [favouriteNum, setFavouriteNum] = useState(book.favCount);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    console.log("Latest book rendered");
  });
  const handleFollowBook = useCallback(
    checkAuth(async () => {
      try {
        setLoading(true);
        setTimeout(() => {
          dispatch(followBookAction(book.id));
          setIsFavorite((prev) => !prev);
          setFavouriteNum((prev) => (isFavorite ? prev - 1 : prev + 1));
        }, 300);
      } catch (error) {
        console.error("Error following book:", error);
      } finally {
        setLoading(false);
      }
    }),
    [checkAuth, dispatch, book.id, isFavorite]
  );

  return (
    <>
      {loading || !book ? (
        <LoadingSpinner />
      ) : (
        <Card sx={{ maxWidth: "3xl", overflow: "hidden", width: "100%" }}>
          <Box sx={{ display: "flex", flexDirection: { md: "row", xs: "column" } }}>
            <Box sx={{ width: { md: "33%", xs: "100%" } }} onClick={() => navigate(`/books/${book.id}`)}>
              <img
                alt="Book cover"
                srcSet={getOptimizedImageUrl(book.bookCover)}
                style={{ aspectRatio: "300/400", objectFit: "cover", width: "100%", height: "100%" }}
              />
            </Box>
            <Box sx={{ width: { md: "67%", xs: "100%" }, p: 6 }}>
              <CardHeader
                title={
                  <Typography variant="h5" component="h2">
                    {book.title}
                  </Typography>
                }
                subheader={
                  <Typography variant="body2" color="text.secondary">
                    by {book.authorName} | Illustrated by {book.artistName}
                  </Typography>
                }
              />
              <CardContent>
                <Typography variant="body2" sx={{ textAlign: "left", mt: 1 }}>
                  {showFullDescription && book.description ? book.description : `${book.description?.slice(0, 100)}...`}
                </Typography>
                {book.description?.length > 200 && (
                  <Button
                    variant="text"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    sx={{ mt: 1, p: 0, textAlign: "left" }}
                  >
                    {showFullDescription ? "Read Less" : "Read More"}
                  </Button>
                )}
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Star sx={{ color: "#faaf00", mr: 1 }} />
                  <Typography variant="body2" fontWeight="medium">
                    {book.avgRating}
                  </Typography>
                  {book.categories.map((category) => (
                    <Chip key={category.id} label={category.name} variant="outlined" sx={{ ml: 4 }} />
                  ))}
                </Box>
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", fontSize: "body2" }}>
                  <Typography>
                    <strong>First Published:</strong> {formatDate(book.publishDate)}
                  </Typography>
                  <Typography>
                    <strong>Total Chapters:</strong> {book.chapterCount}
                  </Typography>
                  <Typography>
                    <strong>Last Updated:</strong> Chapter {book.latestChapterNumber}
                  </Typography>
                  <Typography>
                    <strong>Update Schedule:</strong> Weekly
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-start", gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<MenuBook />}
                  onClick={() => navigate(`/books/${book.id}`)}
                  sx={{
                    mt: 3,
                    backgroundColor: "black",
                    color: "white",
                    borderRadius: 2,
                    alignSelf: "flex-start",
                    "&:hover": {
                      backgroundColor: "#fdf6e3",
                      color: "black",
                    },
                  }}
                >
                  Read Now
                </Button>
                <Button
                  variant={isFavorite ? "contained" : "outlined"}
                  startIcon={<Favorite sx={{ color: isFavorite ? "red" : "inherit" }} />}
                  sx={{
                    mt: 3,
                    backgroundColor: "black",
                    color: "white",
                    borderRadius: 2,
                    alignSelf: "flex-start",
                    "&:hover": {
                      backgroundColor: "#fdf6e3",
                      color: "black",
                    },
                  }}
                  onClick={handleFollowBook}
                >
                  {favouriteNum.toLocaleString()} {isFavorite ? "Favorited" : "Favorites"}
                </Button>
              </CardActions>
            </Box>
          </Box>
        </Card>
      )}
      <AuthDialog />
    </>
  );
}
