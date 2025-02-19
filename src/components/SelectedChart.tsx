import React, { useEffect, useState } from "react";
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
    description: string | null | undefined;
}

interface SelectedChartProps {
  chart: SensorChart;
}

const formatDate = (date: Date): string => date.toISOString().split("T")[0];


const SelectedChart: React.FC<SelectedChartProps> = ({ chart }) => {
    // Calculate the min and max dates based on the current chart's dataseries
    const dates = chart.dataseries.map(point => new Date(point.date));
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
  
    // State for the period filter
    const [startDate, setStartDate] = useState<string>(formatDate(minDate));
    const [endDate, setEndDate] = useState<string>(formatDate(maxDate));
  
    // Update the period filter whenever the chart prop changes
    useEffect(() => {
      setStartDate(formatDate(minDate));
      setEndDate(formatDate(maxDate));
    }, [chart, minDate, maxDate]);
  
    // Filter the dataseries based on the period filter
    const filteredData = chart.dataseries
      .filter(point => {
        const pointDate = new Date(point.date);
        return pointDate >= new Date(startDate) && pointDate <= new Date(endDate);
      })
      .map(point => [new Date(point.date).getTime(), point.value]);
  
    // Configure Highcharts options
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
        {chart.description && (
          <div style={{ marginTop: "20px", fontStyle: "italic", fontSize: "14px" }}>
            {chart.description}
          </div>
        )}
      </Box>
    );
  };
  
  export default SelectedChart;