// src/components/Sidebar.tsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { Link } from "react-router-dom";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { removeChart } from "../redux/chartSlice";
import ChartModal from "./ChartModal";

const Sidebar: React.FC = () => {
  const charts = useSelector((state: RootState) => state.charts.charts);
  const dispatch = useDispatch();

  // State for the kebab menu
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedChartId, setSelectedChartId] = useState<string | null>(null);
  // State for controlling the Edit modal
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  // State for controlling the Add modal
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);

  // Handle kebab menu open
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, chartId: string) => {
    setMenuAnchor(event.currentTarget);
    setSelectedChartId(chartId);
  };

  // Handle kebab menu close
  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedChartId(null);
  };

  // Handle delete: dispatch removal from Redux store
  const handleDelete = () => {
    if (selectedChartId) {
      dispatch(removeChart(selectedChartId));
    }
    handleMenuClose();
  };

  // Handle edit: open the edit modal
  const handleEdit = () => {
    setEditModalOpen(true);
    setMenuAnchor(null); // Close the menu without resetting selectedChartId immediately
  };

  // Get the chart data for editing
  const chartToEdit = charts.find((chart) => chart.id === selectedChartId);

  return (
    <div style={{ width: "250px", padding: "10px", background: "#f4f4f4" }}>
      <h3>Sensors</h3>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        style={{ marginBottom: "10px" }}
        onClick={() => setAddModalOpen(true)}
      >
        + Add Chart
      </Button>
      <List>
        {charts.map((chart) => (
          <ListItem
            key={chart.id}
            secondaryAction={
              <IconButton edge="end" onClick={(e) => handleMenuOpen(e, chart.id)}>
                <MoreVertIcon />
              </IconButton>
            }
            component={Link}
            to={`/chart/${chart.name}`}
          >
            <ListItemText primary={chart.name} />
          </ListItem>
        ))}
      </List>

      {/* Kebab Menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>

      {/* Edit Chart Modal */}
      {editModalOpen && chartToEdit && (
        <ChartModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          initialChartData={chartToEdit}
          isEditMode={true}
        />
      )}

      {/* Add Chart Modal */}
      {addModalOpen && (
        <ChartModal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          isEditMode={false}
        />
      )}
    </div>
  );
};

export default Sidebar;
