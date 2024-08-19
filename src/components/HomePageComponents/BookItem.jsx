import React from "react";
import { Box, Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";

export default function BookItem(props) {
  return (
    <div className="w-64 h-64 object-cover">
      <Card
        sx={{
          maxWidth: 304,
          margin: "auto",
          borderRadius: 2,
          position: "relative",
        }}
      >
        <CardMedia
          image={props.item.bookCover}
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            zIndex: 0,
            backgroundColor: "rgba(0, 0, 0, 0.08)",
            backgroundPosition: "center",
            boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
            transition: "0.3s",
            borderRadius: 3,
          }}
        />
        <CardActionArea>
          <CardContent
            sx={{
              p: 3,
            }}
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              minHeight={360}
              color="common.white"
              textAlign="center"
              sx={{
                "& h2": {
                  color: "#fff",
                  letterSpacing: "2px",
                  fontSize: "2.15rem",
                  fontWeight: 700,
                  lineHeight: 1.45,
                  fontFamily: "'Playfair Display',serif",
                  mb: "1.275rem",
                },
              }}
            >
              <h2>{props.item.title}</h2>
              <p>{props.item.authorName}</p>
            </Box>
            <Typography
              variant="overline"
              sx={{
                display: "block",
                textAlign: "center",
                color: "#fff",
                letterSpacing: "3px",
                fontWeight: 200,
                fontSize: 12,
              }}
            >
              Go read!
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}
