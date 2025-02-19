import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DataPoint {
  value: number;
  date: string;
}

export interface Chart {
    id: string;
    name: string;
    chartType: string;
    color: string;
    dataseries: DataPoint[];
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
    editChart: (state, action: PayloadAction<Partial<Chart> & { id: string }>) => {
      const index = state.charts.findIndex(chart => chart.id === action.payload.id);
      if (index !== -1) {
        state.charts[index] = {
          ...state.charts[index],
          ...action.payload,
        };
      }
    },
  },
});

export const { initializeCharts, addChart, removeChart, editChart } = chartSlice.actions;
export default chartSlice.reducer;
