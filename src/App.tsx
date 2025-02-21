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
      <Box sx={{ display: "flex", alignItems: "center", flexDirection: { xs: "column-reverse", md: "row" } }}>
        <Sidebar openAddChartModal={() => setAddModalOpen(true)} />
        <div style={{ flex: 1, padding: "20px" }}>
          <Routes>
            <Route path="/" element={<MainPage openAddChartModal={() => setAddModalOpen(true)} />} />
            <Route path="/chart/:chartName" element={<MainPage openAddChartModal={() => setAddModalOpen(true)} />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
         {/* Chart Modal (Controlled by App.tsx) */}
          {addModalOpen && (
            <ChartModal
              open={addModalOpen}
              onClose={() => setAddModalOpen(false)}
              isEditMode={false}
            />
          )}
      </Box>
    </Router>
  );
};

export default App;
