import { ChartConfiguration } from "chart.js";
import colors from "tailwindcss/colors";
import { getGradient } from "./utils";

export const humidityChartConfig: ChartConfiguration<"line", number[], number> =
  {
    type: "line",
    data: {
      labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      datasets: [
        {
          label: "Kelembaban",
          pointBorderWidth: 1,
          borderColor: colors.blue[500],
          borderWidth: 2,
          tension: 0.3,
          data: [],
          fill: true,
          backgroundColor: function (context) {
            const { ctx, chartArea } = context.chart;

            if (!chartArea) {
              return "";
            }

            return getGradient(ctx, chartArea);
          },
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        subtitle: {
          display: true,
          text: "Grafik Data Kelembaban",
        },
        title: {
          text: "Grafik Data Kelembaban Tofu",
          display: true,
          fullSize: true,
        },
        tooltip: {
          enabled: true,
          displayColors: true,
          axis: "y",
          backgroundColor: colors.white,
          bodyColor: colors.green[800],
          titleColor: colors.green[800],
          borderColor: colors.green[400],
          borderWidth: 1,
          boxPadding: 4,
          boxHeight: 10,
          boxWidth: 10,
          titleMarginBottom: 5,
          usePointStyle: true,
          padding: 8,
          callbacks: {
            title: (tooltipItem) => {
              return `Data ke-${tooltipItem[0].dataIndex + 1}`;
            },
            label: (tooltipItem) => {
              return `Kelembaban: ${tooltipItem.formattedValue} %`;
            },
          },
        },
      },
      scales: {
        y: {
          min: 20,
          max: 100,
          grid: {
            color: colors.green[200],
          },
          ticks: {
            stepSize: 10,
            callback: (tickValue) => {
              return `${tickValue} %`;
            },
          },
          title: {
            text: "Kelembaban %",
            display: true,
            color: colors.green[900],
            font: {
              weight: "bold",
            },
          },
        },
        x: {
          grid: {
            color: colors.green[200],
          },
          title: {
            text: "Index Data",
            display: true,
            color: colors.green[900],
            font: {
              weight: "bold",
            },
          },
        },
      },
    },
  };
