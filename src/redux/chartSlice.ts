import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Chart {
    id: string;
    name: string;
    chartType: string;
    color: string;
    dataseries: { value: number; date: string }[];
    xAxisLabel: string;
    yAxisLabel: string;
    description: string;
  }  

interface ChartState {
  charts: Chart[];
}

const initialState: ChartState = {
  charts: [],
};

const chartSlice = createSlice({
  name: "charts",
  initialState,
  reducers: {
    initializeCharts: (state, action: PayloadAction<Chart[]>) => {
      state.charts = action.payload;
    },
    addChart: (state, action: PayloadAction<Chart>) => {
      state.charts.push(action.payload);
    },
    removeChart: (state, action: PayloadAction<string>) => {
      state.charts = state.charts.filter(chart => chart.id !== action.payload);
    },
    editChart: (state, action: PayloadAction<{ id: string; name: string }>) => {
      const chart = state.charts.find(chart => chart.id === action.payload.id);
      if (chart) {
        chart.name = action.payload.name;
      }
    },
  },
});

export const { initializeCharts, addChart, removeChart, editChart } = chartSlice.actions;
export default chartSlice.reducer;
