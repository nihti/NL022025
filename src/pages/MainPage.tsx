// src/pages/MainPage.tsx
import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import SelectedChart from "../components/SelectedChart";

const MainPage: React.FC = () => {
  const { chartName } = useParams<{ chartName: string }>();
  const charts = useSelector((state: RootState) => state.charts.charts);

    // If there are no charts, show a friendly message
    if (charts.length === 0) {
      return <div>No charts created yet</div>;
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
