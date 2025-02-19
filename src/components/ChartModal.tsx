import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from "@mui/material";
import { useDispatch } from "react-redux";
import { addChart } from "../redux/chartSlice";
import { v4 as uuidv4 } from "uuid";
import { Chart } from "../redux/chartSlice";

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
}

const chartTypes = ["Line", "Bar", "Pie", "Scatter", "Area"];

const ChartModal: React.FC<ChartModalProps> = ({ open, onClose }) => {
    const { control, handleSubmit, reset } = useForm<ChartFormInputs>();
    const dispatch = useDispatch();

    const onSubmit = (data: ChartFormInputs) => {
        const parsedData =
          data.dataSeries.trim() !== ""
            ? data.dataSeries.split(",").map((val, index) => ({
                value: parseFloat(val.trim()),
                date: new Date(Date.now() + index * 86400000).toISOString(),
              }))
            : [];
      
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
        reset();
        onClose();
      };      

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Create a New Chart</DialogTitle>
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
                    Save Chart
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ChartModal;
