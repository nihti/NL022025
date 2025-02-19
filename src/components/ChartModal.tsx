// src/components/ChartModal.tsx
import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem
} from "@mui/material";
import { useDispatch } from "react-redux";
import { addChart, editChart, Chart } from "../redux/chartSlice";
import { v4 as uuidv4 } from "uuid";
// Import the JSON file so we can use it to populate the Dataseries dropdown.
import sensorData from "../data/dataseries.json";

interface ChartFormInputs {
  name: string;
  chartType: string;
  color: string;
  dataseries: string; // this will be the sensor name selected from the JSON data
  xAxis: string;
  yAxis: string;
  description: string;
}

interface ChartModalProps {
  open: boolean;
  onClose: () => void;
  initialChartData?: Chart; // when editing, pre-populate the form
  isEditMode?: boolean;
}

const chartTypes = ["Line", "Bar", "Pie", "Scatter", "Area"];
const colors = ["Blue", "Red", "Green", "Orange", "Purple"];

const ChartModal: React.FC<ChartModalProps> = ({
  open,
  onClose,
  initialChartData,
  isEditMode = false,
}) => {
  const { control, handleSubmit, reset } = useForm<ChartFormInputs>({
    defaultValues: initialChartData
      ? {
          name: initialChartData.name,
          chartType: initialChartData.chartType,
          color: initialChartData.color,
          // Assume that for editing, the dataseries was chosen from sensorData;
          // Here, we use the chart name as a proxy, or store the sensor id if available.
          dataseries: initialChartData.name,
          xAxis: initialChartData.xAxisLabel,
          yAxis: initialChartData.yAxisLabel,
          description: initialChartData.description,
        }
      : {},
  });
  const dispatch = useDispatch();

  const onSubmit = (data: ChartFormInputs) => {
    // Find the sensor in the JSON file matching the selected dataseries option.
    const sensor = sensorData.find((s: any) => s.name === data.dataseries);
    // Use the sensor's dataseries array (or empty array if not found)
    const sensorDataseries = sensor ? sensor.dataseries : [];

    if (isEditMode && initialChartData) {
      // Build an updated chart object for editing.
      const updatedChart: Partial<Chart> & { id: string } = {
        id: initialChartData.id,
        name: data.name,
        chartType: data.chartType,
        color: data.color,
        dataseries: sensorDataseries,
        xAxisLabel: data.xAxis,
        yAxisLabel: data.yAxis,
        description: data.description,
      };
      dispatch(editChart(updatedChart));
    } else {
      // Create a new chart object for adding.
      const newChart: Chart = {
        id: uuidv4(),
        name: data.name,
        chartType: data.chartType,
        color: data.color,
        dataseries: sensorDataseries,
        xAxisLabel: data.xAxis,
        yAxisLabel: data.yAxis,
        description: data.description,
      };
      dispatch(addChart(newChart));
    }
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditMode ? "Edit Chart" : "Create a New Chart"}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Chart Name */}
          <Controller
            name="name"
            control={control}
            defaultValue=""
            rules={{ required: "Chart name is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Chart Name"
                fullWidth
                margin="dense"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          {/* Chart Type Dropdown */}
          <Controller
            name="chartType"
            control={control}
            defaultValue=""
            rules={{ required: "Chart type is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                label="Chart Type"
                fullWidth
                margin="dense"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              >
                {chartTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          {/* Color Dropdown */}
          <Controller
            name="color"
            control={control}
            defaultValue=""
            rules={{ required: "Color is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                label="Color"
                fullWidth
                margin="dense"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              >
                {colors.map((col) => (
                  <MenuItem key={col} value={col}>
                    {col}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          {/* Dataseries Dropdown (from JSON data) */}
          <Controller
            name="dataseries"
            control={control}
            defaultValue=""
            rules={{ required: "Dataseries is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                label="Dataseries"
                fullWidth
                margin="dense"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              >
                {sensorData.map((s: any) => (
                  <MenuItem key={s.name} value={s.name}>
                    {s.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          {/* Optional: X-Axis Name */}
          <Controller
            name="xAxis"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField {...field} label="X-Axis Name (optional)" fullWidth margin="dense" />
            )}
          />

          {/* Optional: Y-Axis Name */}
          <Controller
            name="yAxis"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField {...field} label="Y-Axis Name (optional)" fullWidth margin="dense" />
            )}
          />

          {/* Optional: Text Description */}
          <Controller
            name="description"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Text Description (optional)"
                fullWidth
                margin="dense"
                multiline
                rows={3}
              />
            )}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained" color="primary">
          {isEditMode ? "Save Changes" : "Save Chart"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChartModal;
