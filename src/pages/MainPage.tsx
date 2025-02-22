// src/pages/MainPage.tsx
import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import SelectedChart from "../components/SelectedChart";
import { Box, Button } from "@mui/material";

interface MainPageProps {
  openAddChartModal: () => void;
}

const MainPage: React.FC<MainPageProps> = ({ openAddChartModal }) => {
  const { chartName } = useParams<{ chartName: string }>();
  const charts = useSelector((state: RootState) => state.charts.charts);

    // If there are no charts, show a friendly message
    if (charts.length === 0) {
      return (
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: 'center', textAlign: "center", paddingTop: "20px", height: "100%" }}>
            <p style={{ fontSize: "18px" }}>No charts created yet</p>
            <Button
              variant="contained"
              color="primary"
              sx={{ marginTop: 2 }}
              onClick={openAddChartModal} // Open chart modal when clicked
            >
              + Add Chart
            </Button>
          </Box>
      )
    }

  // Find chart by name (fallback to first if not found)
  const chart = charts.find((chart) => chart.name === chartName) || charts[0];

  return (
    <div>
      {chart ? <SelectedChart chart={chart} /> : <p>No chart selected.</p>}
    </div>
  );
};

export default MainPage;
