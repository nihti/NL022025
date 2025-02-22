import React from "react";
import { Link } from "react-router-dom";
import pageNotFound from "../pageNotFound.svg";
import { Box, Typography, Button } from "@mui/material";

const PageNotFound: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        height: "100%",
      }}
    >
      <img
        src={pageNotFound}
        alt="Company Logo"
        style={{
          width: "100%",
          minHeight: "110px",
          maxHeight: "206px",
          paddingBottom: "20px",
        }}
      />
      <Typography
        sx={{
          fontFamily: "Roboto",
          fontWeight: 500,
          fontSize: "16px",
          lineHeight: "25.6px",
          letterSpacing: "0.15px",
          textAlign: "center",
          color: "rgba(0, 0, 0, 0.87)",
        }}
      >
        Page not found. Please try again later.
      </Typography>
      <Button
        component={Link}
        to="/"
        variant="contained"
        color="primary"
        sx={{
          position: { xs: "absolute", md: "static" }, // Mobile: Positioned at bottom, Desktop: Normal position
          bottom: { xs: "20px", md: "auto" }, // Pushes button to bottom in mobile
          left: { xs: "50%", md: "auto" }, // Centers button horizontally in mobile
          transform: { xs: "translateX(-50%)", md: "none" }, // Adjusts mobile positioning
          width: { xs: "90%", md: "115px" }, // Mobile: Full width, Desktop: Fixed width
          marginTop: { md: "20px" }, // Adds 20px top padding in desktop
          textTransform: "none", // Keeps text readable
          fontWeight: 500,
          fontSize: "16px",
          padding: "8px 16px",
        }}
      >
        Go Home
      </Button>
    </Box>
  );
};

export default PageNotFound;
