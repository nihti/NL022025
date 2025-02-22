// src/components/ChartModal.tsx
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { addChart, editChart, Chart } from "../redux/chartSlice";
import { v4 as uuidv4 } from "uuid";
import sensorData from "../data/dataseries.json";

interface ChartFormInputs {
  name: string;
  chartType: string;
  color: string;
  dataseries: string; // will store the sensor name selected
  xAxis: string;
  yAxis: string;
  description: string;
}

interface ChartModalProps {
  open: boolean;
  onClose: () => void;
  initialChartData?: Chart; // provided when editing
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
  const dispatch = useDispatch();

  const { control, handleSubmit, reset } = useForm<ChartFormInputs>({
    defaultValues: {
        name: initialChartData?.name || "",
        chartType: initialChartData?.chartType || "",
        color: initialChartData?.color || "",
        dataseries: initialChartData?.name || "",
        xAxis: initialChartData?.xAxisLabel || "",
        yAxis: initialChartData?.yAxisLabel || "",
        description: initialChartData?.description || "",
    },
  });

  // When the modal opens (or initialChartData changes), reset the form
  useEffect(() => {
    if (open) {
        console.log("Name:", initialChartData?.name);
        console.log("Chart Type:", initialChartData?.chartType);
        console.log("Color:", initialChartData?.color);
        console.log("Dataseries:", initialChartData?.name);
        console.log("X-Axis:", initialChartData?.xAxisLabel);
        console.log("Y-Axis:", initialChartData?.yAxisLabel);
        console.log("Description:", initialChartData?.description);
      reset({
        name: initialChartData?.name || "",
        chartType: initialChartData?.chartType || "",
        color: initialChartData?.color || "",
        dataseries: initialChartData?.name || "",
        xAxis: initialChartData?.xAxisLabel || "",
        yAxis: initialChartData?.yAxisLabel || "",
        description: initialChartData?.description || "",
      });
    }
  }, [open, initialChartData, reset]);

  const onSubmit = (data: ChartFormInputs) => {
    // Look up the selected dataseries from the JSON data.
    const sensor = sensorData.find((s: any) => s.name === data.dataseries);
    const sensorDataseries = sensor ? sensor.dataseries : [];

    if (isEditMode && initialChartData) {
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

  // A helper function to render a label with a red asterisk.
  const renderRequiredLabel = (text: string) => (
    <span>
      {text} <span style={{ color: "red" }}>*</span>
    </span>
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditMode ? "Edit Chart" : "Add Chart"}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Required: Chart Name */}
          <Controller
            name="name"
            control={control}
            rules={{ required: "Chart name is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label={renderRequiredLabel("Chart Name")}
                required
                InputLabelProps={{ required: false }}
                fullWidth
                margin="dense"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          {/* Required: Chart Type Dropdown */}
          <Controller
            name="chartType"
            control={control}
            rules={{ required: "Chart type is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                label={renderRequiredLabel("Chart Type")}
                required
                InputLabelProps={{ required: false }}
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

          {/* Required: Color Dropdown */}
          <Controller
            name="color"
            control={control}
            rules={{ required: "Color is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                label={renderRequiredLabel("Color")}
                required
                InputLabelProps={{ required: false }}
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

          {/* Required: Dataseries Dropdown */}
          <Controller
            name="dataseries"
            control={control}
            rules={{ required: "Dataseries is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                label={renderRequiredLabel("Dataseries")}
                required
                InputLabelProps={{ required: false }}
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
            render={({ field }) => (
              <TextField {...field} label="X-Axis Name (optional)" fullWidth margin="dense" />
            )}
          />

          {/* Optional: Y-Axis Name */}
          <Controller
            name="yAxis"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Y-Axis Name (optional)" fullWidth margin="dense" />
            )}
          />

          {/* Optional: Text Description */}
          <Controller
            name="description"
            control={control}
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
