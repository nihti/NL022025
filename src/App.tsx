// src/App.tsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import Sidebar from "./components/Sidebar";
import MainPage from "./pages/MainPage";
import PageNotFound from "./pages/PageNotFound";
import { Chart, initializeCharts } from "./redux/chartSlice";
import sensorData from "./data/dataseries.json"; // JSON data as read-only

const App: React.FC = () => {
  const dispatch = useDispatch();

  /*
  useEffect(() => {
    // Map over sensorData to add the required fields
    const chartsWithId: Chart[] = sensorData.map((chart) => ({
      ...chart,
      id: chart.name, // Or use uuidv4() for a generated id if needed
      chartType: "Line",  // Default value (update as needed)
      color: "Blue",      // Default value (update as needed)
      xAxisLabel: "Date", // Set default label for the X axis (or an empty string)
      yAxisLabel: "°C",   // Set default label for the Y axis as required
      description: "",    // Default value (update as needed)
    }));
    dispatch(initializeCharts(chartsWithId));
  }, [dispatch]);
  */

  /**
   * ○ The X-axis represents dates. Defaulttaa "Dates inputeissa"
   * ○ The Y-axis is labeled "°C" (Celsius). Defaulttaa "°C" (Celsius) inputeissa
   * ○ No timezone preprocessing is required — dates should be used as they
   * are. --- muuta tämä huomenna
   * 
   */

  /** Sitten hammeroidaan tyylit!
   * Muista myös Y-akselille samanlaiset viivat kuin X-akselille huomenna.
   * Formeissa x- ja y-akseli nimeäminen samalla viivalle
   */

  return (
    <Router>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "20px" }}>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/chart/:chartName" element={<MainPage />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
