// src/components/ChartModal.tsx
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from "@mui/material";
import { useDispatch } from "react-redux";
import { addChart, editChart, Chart } from "../redux/chartSlice";
import { v4 as uuidv4 } from "uuid";

interface ChartFormInputs {
  name: string;
  chartType: string;
  color: string;
  dataSeries: string;
  xAxis: string;
  yAxis: string;
  description: string;
}

interface ChartModalProps {
  open: boolean;
  onClose: () => void;
  initialChartData?: Chart; // optional: when editing, pre-populate the form
  isEditMode?: boolean;
}

const chartTypes = ["Line", "Bar", "Pie", "Scatter", "Area"];

const ChartModal: React.FC<ChartModalProps> = ({ open, onClose, initialChartData, isEditMode = false }) => {
  const { control, handleSubmit, reset } = useForm<ChartFormInputs>({
    defaultValues: initialChartData
      ? {
          name: initialChartData.name,
          chartType: initialChartData.chartType,
          color: initialChartData.color,
          dataSeries: initialChartData.dataseries.map(ds => ds.value).join(", "),
          xAxis: initialChartData.xAxisLabel,
          yAxis: initialChartData.yAxisLabel,
          description: initialChartData.description,
        }
      : {},
  });
  const dispatch = useDispatch();

  const onSubmit = (data: ChartFormInputs) => {
    // Parse dataSeries: split by commas and assign consecutive dates starting today
    const parsedData =
      data.dataSeries.trim() !== ""
        ? data.dataSeries.split(",").map((val, index) => ({
            value: parseFloat(val.trim()),
            date: new Date(Date.now() + index * 86400000).toISOString(),
          }))
        : [];

    if (isEditMode && initialChartData) {
      // Build the updated chart object
      const updatedChart: Partial<Chart> & { id: string } = {
        id: initialChartData.id,
        name: data.name,
        chartType: data.chartType,
        color: data.color,
        dataseries: parsedData,
        xAxisLabel: data.xAxis,
        yAxisLabel: data.yAxis,
        description: data.description,
      };
      dispatch(editChart(updatedChart));
    } else {
      // Create a new chart object
      const newChart: Chart = {
        id: uuidv4(),
        name: data.name,
        chartType: data.chartType,
        color: data.color,
        dataseries: parsedData,
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
          <Controller
            name="name"
            control={control}
            defaultValue=""
            rules={{ required: "Chart name is required" }}
            render={({ field, fieldState }) => (
              <TextField {...field} label="Chart Name" fullWidth margin="dense" error={!!fieldState.error} helperText={fieldState.error?.message} />
            )}
          />
          <Controller
            name="chartType"
            control={control}
            defaultValue=""
            rules={{ required: "Chart type is required" }}
            render={({ field, fieldState }) => (
              <TextField {...field} select label="Chart Type" fullWidth margin="dense" error={!!fieldState.error} helperText={fieldState.error?.message}>
                {chartTypes.map(type => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="color"
            control={control}
            defaultValue=""
            render={({ field }) => <TextField {...field} label="Color (Hex or Name)" fullWidth margin="dense" />}
          />
          <Controller
            name="dataSeries"
            control={control}
            defaultValue=""
            render={({ field }) => <TextField {...field} label="Data Series (comma-separated)" fullWidth margin="dense" />}
          />
          <Controller
            name="xAxis"
            control={control}
            defaultValue=""
            render={({ field }) => <TextField {...field} label="X-Axis Name" fullWidth margin="dense" />}
          />
          <Controller
            name="yAxis"
            control={control}
            defaultValue=""
            render={({ field }) => <TextField {...field} label="Y-Axis Name" fullWidth margin="dense" />}
          />
          <Controller
            name="description"
            control={control}
            defaultValue=""
            render={({ field }) => <TextField {...field} label="Description" fullWidth margin="dense" multiline rows={3} />}
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
