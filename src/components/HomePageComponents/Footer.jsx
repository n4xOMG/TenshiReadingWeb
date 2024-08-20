import { Box, Container, Grid, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: "grey.100", py: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {[
            { title: "The Series", links: ["The Enchanted Forest", "The Enchanted Kingdom", "The Enchanted Realm", "Upcoming Books"] },
            { title: "Explore", links: ["Gallery", "Characters", "Lore", "Fan Art"] },
            { title: "Community", links: ["Forums", "Discord", "Subreddit", "Events"] },
            { title: "About", links: ["The Authors", "Publisher", "Awards", "Contact"] },
            { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Trademark"] },
          ].map((section, index) => (
            <Grid item xs={6} md={2} key={index}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {section.title}
              </Typography>
              {section.links.map((link, linkIndex) => (
                <Link key={linkIndex} href="#" sx={{ display: "block", mt: 1 }}>
                  {link}
                </Link>
              ))}
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
