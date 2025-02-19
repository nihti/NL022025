import React, { useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box, TextField } from "@mui/material";

interface DataPoint {
  value: number;
  date: string;
}

interface SensorChart {
    id: string;
    name: string;
    dataseries: DataPoint[];
    xAxisLabel: string | null | undefined;
    yAxisLabel: string | null | undefined;
}

interface SelectedChartProps {
  chart: SensorChart;
}

const formatDate = (date: Date): string => date.toISOString().split("T")[0];

const SelectedChart: React.FC<SelectedChartProps> = ({ chart }) => {
  // Convert date strings to Date objects
  const dates = chart.dataseries.map(point => new Date(point.date));
  const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

  // Helper: format a Date as yyyy-MM-dd for input type="date"
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  // State for period filter; default to full range
  const [startDate, setStartDate] = useState<string>(formatDate(minDate));
  const [endDate, setEndDate] = useState<string>(formatDate(maxDate));

  // Filter dataseries based on selected period
  const filteredData = chart.dataseries
    .filter(point => {
      const pointDate = new Date(point.date);
      return pointDate >= new Date(startDate) && pointDate <= new Date(endDate);
    })
    .map(point => [new Date(point.date).getTime(), point.value]);

    const options: Highcharts.Options = {
        title: { text: chart.name },
        xAxis: {
          type: "datetime",
          title: { text: chart.xAxisLabel }
        },
        yAxis: {
          title: { text: chart.yAxisLabel }
        },
        series: [{
          type: "line",
          name: "Temperature",
          data: filteredData
        }]
      };

  return (
    <Box>
      {/* Period Filter */}
      <Box display="flex" gap={2} marginBottom={2}>
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Box>
      {/* Highcharts Chart */}
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Box>
  );
};

export default SelectedChart;
