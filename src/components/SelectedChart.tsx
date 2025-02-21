import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box, TextField } from "@mui/material";
import PeriodFilter from "./PeriodFilter";
import { Chart } from "../redux/chartSlice";

interface DataPoint {
  value: number;
  date: string;
}

interface SensorChart {
    color: any;
    chartType: any;
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

const SelectedChart: React.FC<SelectedChartProps> = ({ chart }) => {
  const dataSeries = chart.dataseries;

  // Default to full range
  const [filteredRange, setFilteredRange] = useState<{ start: string; end: string }>({
    start: dataSeries[0]?.date,
    end: dataSeries[dataSeries.length - 1]?.date,
  });

  const handleFilterChange = (startDate: string, endDate: string) => {
    setFilteredRange({ start: startDate, end: endDate });
  };

  // Filter the data based on the selected period
  const filteredData = dataSeries
    .filter(({ date }) => date >= filteredRange.start && date <= filteredRange.end)
    .map(({ date, value }) => [new Date(date).getTime(), value]);
  
    // Configure Highcharts options
    const options: Highcharts.Options = {
      title: { text: chart.name },
      xAxis: {
        type: "datetime",
        title: { 
          text: chart.xAxisLabel || "Dates",
          style: { fontWeight: "bold" },
          align: "middle", // Keeps the title centered
          y: 45, // Moves the title downward below the tick labels
        },
        tickPositions: filteredData.map(([timestamp]) => timestamp), // Show all ticks
        /*tickPositioner: function () {
          const data = filteredData.map(([timestamp]) => timestamp);
          if (data.length === 0) return [];
    
          // Ensure only real timestamps from data are used as ticks
          let uniqueTicks = [...new Set(data)].sort((a, b) => a - b);
    
          // Always show first and last date
          const min = uniqueTicks[0];
          const max = uniqueTicks[uniqueTicks.length - 1];
    
          // Determine how many ticks can fit based on screen size
          const totalTicks = Math.max(4, Math.floor(this.chart.chartWidth / 90));
    
          if (uniqueTicks.length <= totalTicks) {
            return uniqueTicks; // Show all available ticks if there are few enough
          }
    
          // If too many dates, select spaced-out ones
          const step = Math.ceil(uniqueTicks.length / (totalTicks - 1));
          const selectedTicks = [min];
    
          for (let i = step; i < uniqueTicks.length - 1; i += step) {
            selectedTicks.push(uniqueTicks[i]);
          }
    
          selectedTicks.push(max);
          return selectedTicks;
        },*/
        labels: {
          formatter: function () {
            const data = filteredData.map(([timestamp]) => timestamp);
            if (data.length === 0) return '<span class="hide-label"></span>'; // Mark empty labels
    
            const min = data[0];
            const max = data[data.length - 1];
            const secondLast = data.length > 1 ? data[data.length - 2] : max;
            const totalTicks = Math.max(4, Math.floor(this.chart.chartWidth / 90));
    
            // Select the ticks that should display labels
            let visibleLabels = [min]; // Always show first date
    
            if (totalTicks > 2) {
              const step = Math.ceil(data.length / (totalTicks - 1));
              for (let i = step; i < data.length - 1; i += step) {
                visibleLabels.push(data[i]);
              }
            }
    
            visibleLabels.push(secondLast); // Show second-last date instead of last
    
            // Only show labels for the selected visible ticks
            if (visibleLabels.includes(this.value as number)) {
              const date = new Date(this.value as number);
              return `<span class="highcharts-visible-label">${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}</span>`;
            } else {
              return '<span class="hide-label"></span>'; // Add class to hide empty labels
            }
          },
    
          // align: "center", // Ensures labels are spaced correctly
          reserveSpace: false, // Prevents Highcharts from reserving space for hidden labels    
          useHTML: true, // Ensures proper rendering without extra spaces
          style: {
            fontSize: "calc(10px + 0.5vw)", // Dynamically scales font size
            whiteSpace: "nowrap", // Prevents line breaks
            overflow: "visible !important", // Ensures no ellipses
          },
        },
      },
      yAxis: {
        type: 'linear',
        title: { 
          text: chart.yAxisLabel || "°C",
          style: { fontWeight: "bold" }, 
        },
        lineWidth: 1,
        tickWidth: 1,
        labels: {
          align: 'right',
        },
      },
      legend: {
        enabled: false, // Completely hide the legend
      },
      credits: {
        enabled: false, // Hide the Highcharts.com link
      },
      chart: {
        width: null, // Ensures responsive width
        spacingLeft: 0, // Ensures the chart starts exactly at the left
        spacingBottom: 50,
      },
      series: [{
        type: chart.chartType.toLowerCase(),
        name: "",
        showInLegend: false, // Ensure the series does not appear in the legend
        marker: {
          enabled: false, // Removes the dots from the graph line
        },
        pointPlacement: "on", // Ensures the line starts exactly from the Y-axis    
        data: filteredData,
        color: chart.color.toLowerCase(), // Use the selected color from the chart state
        /*data: filteredData.map(([timestamp, value]) => [
          new Date(timestamp).getTime(), // Use raw timestamp from JSON
          value,
        ]),*/
      }]
    };
  
    return (
      <Box>
        {/* Period Filter */}
        <PeriodFilter chartId={chart.id} dataSeries={chart.dataseries} onFilterChange={handleFilterChange} />
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