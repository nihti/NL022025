// src/components/Sidebar.tsx
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
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
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import logoMobileSmall from "../logoMobileSmall.svg";
import logoMobileLarge from "../logoMobileLarge.svg";
// import { ReactComponent as Logo } from "../logoMobileLarge.svg";
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
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Filter charts based on search input
  const filteredCharts = charts.filter((chart) =>
    chart.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle kebab menu open
  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    chartId: string
  ) => {
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    };

    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen]);

  return (
    <>
      {/* Mobile Navbar (Displayed on Small Screens) */}
      <AppBar
        position="static"
        sx={{
          display: { xs: "flex", md: "none" },
          backgroundColor: "#fff",
          padding: "6px",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Company Logo Placeholder */}
          {searchOpen ? (
            <img
              src={logoMobileSmall}
              alt="Company Logo"
              style={{ height: "32px" }}
            />
          ) : (
            <img
              src={logoMobileLarge}
              alt="Company Logo"
              style={{ height: "32px" }}
            />
          )}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Search Icon (Opens Search Field) */}
            {!searchOpen && (
              <IconButton
                onClick={() => setSearchOpen(!searchOpen)}
                sx={{ color: "#000", marginRight: 1 }}
              >
                <SearchIcon />
              </IconButton>
            )}
            {/* Search Field Expands Inside the Top Bar */}
            <Box
              ref={searchRef}
              sx={{
                display: "flex",
                alignItems: "center",
                flexGrow: searchOpen ? 1 : 0, // Expand towards logo
                transition: "flex-grow 0.3s ease-in-out",
                overflow: "hidden",
              }}
            >
              {searchOpen && (
                <TextField
                  fullWidth
                  autoFocus
                  placeholder="Search..."
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{
                    backgroundColor: "rgba(0, 0, 0, 0.06)",
                    borderRadius: "4px",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { border: "none" },
                      paddingLeft: "10px",
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
              )}
            </Box>

            {/* Hamburger Menu (Opens Sidebar Menu) */}
            <IconButton
              onClick={() => setMenuOpen(true)}
              sx={{ color: "#000" }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Menu (Hamburger Drawer for Mobile) */}
      <Drawer
        anchor="right"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        sx={{
          "& .MuiDrawer-paper": { width: "100%" },
        }}
      >
        <Box sx={{ width: "100%", padding: 2 }}>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            {/* Logo inside the menu */}
            {/* Logo inside the menu */}
            <Box sx={{ height: "40px", display: "flex", alignItems: "center" }}>
              <img
                src={logoMobileSmall}
                alt="Company Logo"
                style={{ height: "32px" }}
              />
            </Box>

            {/* Search Field Inside the Fullscreen Menu */}
            <Box sx={{ width: "80%", marginBottom: "20px" }}>
              <TextField
                fullWidth
                placeholder="Search..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  mb: { md: 2 }, // Margin bottom: 16px (Only in Desktop)
                  backgroundColor: "rgba(0, 0, 0, 0.06)",
                  borderRadius: "4px",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { border: "none" },
                    paddingLeft: "10px",
                    marginBottom: "16px",
                  },
                  "& .MuiInputBase-input": {
                    paddingLeft: "35px",
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
            </Box>
            {/* Close Button */}
            <IconButton
              onClick={() => setMenuOpen(false)}
              
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Chart List with Kebab Menu */}
          <List sx={{ width: "100%" }}>
            {filteredCharts.length > 0
              ? filteredCharts.map((chart) => (
                  <ListItem
                    key={chart.id}
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {/* Chart Name */}
                    <ListItemText primary={chart.name} />

                    {/* Kebab Menu (Edit & Delete) */}
                    <IconButton
                      onClick={(event) => handleMenuOpen(event, chart.id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </ListItem>
                ))
              : null}
          </List>
          {/* Add Chart Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={openAddChartModal}
          >
            + Add Chart
          </Button>
        </Box>
      </Drawer>

      {/* Kebab Menu Actions */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>

      {/* Edit Chart Modal */}
      {editModalOpen && chartToEdit && (
        <ChartModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          isEditMode={true}
          initialChartData={chartToEdit}
        />
      )}

      {/* Desktop Sidebar (Stays on the Left) */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          width: "250px",
          padding: 2,
          backgroundColor: "#f4f4f4",
          height: "100vh",
          borderRight: "1px solid rgba(0, 0, 0, 0.12)", // Right border only
        }}
      >
        <img
          src={logoMobileLarge}
          alt="Company Logo"
          style={{ height: "32px", marginBottom: "16px" }}
        />
        {/* Search Bar Always Visible on Desktop */}
        <TextField
          fullWidth
          placeholder="Search..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.06)",
            borderRadius: "4px",
            "& .MuiOutlinedInput-root": {
              "& fieldset": { border: "none" },
              paddingLeft: "10px",
            },
            "& .MuiInputBase-input": {
              paddingLeft: "35px",
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
        {/* Add Chart Button Always Visible on Desktop */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={openAddChartModal}
          sx={{ mt: 2 }}
        >
          + Add Chart
        </Button>

        {/* Chart List with Kebab Menu (Desktop) */}
        <List>
          {filteredCharts.length > 0 ? (
            filteredCharts.map((chart) => (
              <ListItem
                key={chart.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* Chart Name */}
                <ListItemText primary={chart.name} />

                {/* Kebab Menu (Edit & Delete) */}
                <IconButton
                  onClick={(event) => handleMenuOpen(event, chart.id)}
                >
                  <MoreVertIcon />
                </IconButton>
              </ListItem>
            ))
          ) : (
            <ListItem sx={{ display: { xs: "none", md: "block" } }}>
              <ListItemText primary="No charts found" />
            </ListItem>
          )}
        </List>
      </Box>
    </>
  );
};

export default Sidebar;
