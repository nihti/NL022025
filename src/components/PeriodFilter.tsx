import React, { useState, useEffect } from "react";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { Box, TextField, IconButton, InputAdornment } from "@mui/material";
import { CalendarToday } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

interface PeriodFilterProps {
  chartId: string;
  dataSeries: { value: number; date: string }[];
  onFilterChange: (startDate: string, endDate: string) => void;
}

const PeriodFilter: React.FC<PeriodFilterProps> = ({ chartId, dataSeries, onFilterChange }) => {
  // Get min/max dates from JSON data
  const minDate = dayjs(dataSeries[0]?.date);
  const maxDate = dayjs(dataSeries[dataSeries.length - 1]?.date);

  const [selectedRange, setSelectedRange] = useState<[Dayjs | null, Dayjs | null]>([minDate, maxDate]);
  const [open, setOpen] = useState(false); // Controls opening the DateRangePicker

  // Format display value (e.g., "3/15/2024 - 4/1/2024")
  const displayValue =
    selectedRange[0] && selectedRange[1]
      ? `${selectedRange[0].format("M/D/YYYY")} - ${selectedRange[1].format("M/D/YYYY")}`
      : "Select Period";

  useEffect(() => {
    setSelectedRange([minDate, maxDate]);
  }, [chartId, dataSeries]);

  useEffect(() => {
    if (selectedRange[0] && selectedRange[1]) {
      onFilterChange(selectedRange[0].format("YYYY-MM-DD"), selectedRange[1].format("YYYY-MM-DD"));
    }
  }, [selectedRange, onFilterChange]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}>
        {/* Hidden DateRangePicker (opens on button click) */}
        {open && (
          <DateRangePicker
            open
            onClose={() => setOpen(false)}
            value={selectedRange}
            onChange={(newRange) => {
              if (newRange[0] && newRange[1]) {
                setSelectedRange(newRange);
              }
            }}
            minDate={minDate}
            maxDate={maxDate}
          />
        )}

        {/* Visible Input Field with Calendar Icon */}
        <TextField
          label="Period"
          variant="outlined"
          fullWidth
          sx={{ width: "270px" }}
          value={displayValue}
          InputProps={{
            readOnly: true, // Prevents manual input
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setOpen(true)}>
                  <CalendarToday />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default PeriodFilter;
