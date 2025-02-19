// src/components/Sidebar.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Button, List, ListItem, ListItemText } from "@mui/material";

const Sidebar: React.FC = () => {
  const charts = useSelector((state: RootState) => state.charts.charts);

  return (
    <div style={{ width: "250px", padding: "10px", background: "#f4f4f4" }}>
      <h3>Sensors</h3>
      <Button variant="contained" color="primary" fullWidth style={{ marginBottom: "10px" }}>
        + Add Chart
      </Button>
      <List>
        {charts.map((chart) => (
          <ListItem component={Link} to={`/chart/${chart.name}`} key={chart.id}>
            <ListItemText primary={chart.name} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Sidebar;
