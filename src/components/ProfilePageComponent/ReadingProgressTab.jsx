import { Badge, Box, Card, CardContent, CardHeader, LinearProgress, Typography } from "@mui/material";
import React from "react";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { formatDate } from "../../utils/formatDate";
const getProgressColor = (progress) => {
  if (progress === 100) return "bg-green-500";
  if (progress >= 75) return "bg-blue-500";
  if (progress >= 50) return "bg-yellow-500";
  return "bg-red-500";
};
export default function ReadingProgressTab({ readingProgresses }) {
  return (
    <Card sx={{ mb: 4 }}>
      <CardHeader title="Reading Progress" subheader="Track your current reading adventures." />
      <CardContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {readingProgresses
            ?.sort((a, b) => new Date(b.lastReadAt) - new Date(a.lastReadAt))
            .map((progress, index) => (
              <CardContent key={index} sx={{ display: "flex", alignItems: "start", p: 4 }}>
                <img
                  src={progress.bookCover}
                  alt={progress.bookTitle}
                  style={{ width: "96px", height: "144px", objectFit: "cover", marginRight: "16px", borderRadius: "4px" }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{progress.bookTitle}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {progress.bookAuthor}
                  </Typography>
                  <Box sx={{ mt: 2, mb: 1 }}>
                    <LinearProgress variant="determinate" value={progress.progress} sx={{ width: "100%" }} />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {progress.chapterNum} {progress.chapterName}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Badge variant="outlined" sx={{ backgroundColor: getProgressColor(progress.progress), color: "white" }}>
                      {progress.progress}%
                    </Badge>
                    {progress.lastReadAt && (
                      <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
                        <ScheduleIcon sx={{ mr: 1, fontSize: 16 }} />
                        {formatDate(progress.lastReadAt)}
                      </Box>
                    )}
                  </Box>
                </Box>
              </CardContent>
            ))}
        </Box>
      </CardContent>
    </Card>
  );
}
