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
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { removeChart } from "../redux/chartSlice";
import ChartModal from "./ChartModal";

interface SidebarProps {
  openAddChartModal: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ openAddChartModal }) => {
  const charts = useSelector((state: RootState) => state.charts.charts);
  const dispatch = useDispatch();

  // State for the kebab menu
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedChartId, setSelectedChartId] = useState<string | null>(null);
  // State for controlling the Edit modal
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");

    // Filter charts based on search input
    const filteredCharts = charts.filter((chart) =>
      chart.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
        onClick={openAddChartModal}
      >
        + Add Chart
      </Button>
      {charts.length === 0 ? (
        <p>No charts</p>
      ) : (
        <>
      {/* Search Input */}
      <TextField
        fullWidth
        placeholder="Search..."
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          mb: 2,
          backgroundColor: "rgba(255, 255, 255, 0.003)", // Light transparent background
          borderRadius: "8px", // Rounded corners
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              border: "none", // Remove outline
            },
            "&:hover fieldset": {
              border: "none", // Remove hover outline
            },
            "&.Mui-focused fieldset": {
              border: "none", // Remove focus outline
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />
      <List>
        {filteredCharts.map((chart) => (
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
      </>
      )}
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
    </div>
  );
};

export default Sidebar;
