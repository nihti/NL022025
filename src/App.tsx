// src/App.tsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import MainPage from "./pages/MainPage";
import PageNotFound from "./pages/PageNotFound";
import { Box } from "@mui/material";
import ChartModal from "./components/ChartModal";

const App: React.FC = () => {
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);

  return (
    <Router>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: { xs: "column", md: "row" },
          height: "100vh",
          backgroundColor: { xs: "#fff", md: "rgba(224, 224, 224, 1)"}, // Grey background around main page
        }}
      >
        <Sidebar openAddChartModal={() => setAddModalOpen(true)} />
        <Box
            sx={{
            flexGrow: 1, // Takes remaining space
            height: { md: "calc(100% - 48px)" }, // Full height minus top and bottom margin
            backgroundColor: { md: "#fff" }, // White background inside
            border: {md: "1px solid rgba(0, 0, 0, 0.12)"}, // Full border around main content
            borderRadius: {md: "4px"}, // Rounded corners
            margin: {md: "24px"} 
            }}
          >
          <Routes>
            <Route
              path="/"
              element={
                <MainPage openAddChartModal={() => setAddModalOpen(true)} />
              }
            />
            <Route
              path="/chart/:chartName"
              element={
                <MainPage openAddChartModal={() => setAddModalOpen(true)} />
              }
            />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Box>
        {/* Chart Modal (Controlled by App.tsx) */}
        {addModalOpen && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ChartModal
              open={addModalOpen}
              onClose={() => setAddModalOpen(false)}
              isEditMode={false}
            />
          </Box>
        )}
      </Box>
    </Router>
  );
};

export default App;
