import { ChartArea } from "chart.js";
import colors from "tailwindcss/colors";

function getGradient(
  ctx: CanvasRenderingContext2D,
  chartArea: ChartArea
): CanvasGradient {
  let height: number = 0;
  let width: number = 0;
  let gradient: CanvasGradient | null = null;

  const chartWidth = chartArea.right - chartArea.left;
  const chartHeight = chartArea.bottom - chartArea.top;
  if (!gradient || width !== chartWidth || height !== chartHeight) {
    // Create the gradient because this is either the first render
    // or the size of the chart has changed
    width = chartWidth;
    height = chartHeight;
    gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, colors.green[100]);
    gradient.addColorStop(0.5, colors.green[400]);
    gradient.addColorStop(1, colors.green[600]);

    return gradient;
  }

  return gradient;
}

export { getGradient };
