import { useContext, useEffect, useRef } from "react";
import { temperatureChartConfig } from "../charts/temperatureChart";
import {
  LineController,
  PointElement,
  LineElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Chart,
  Filler,
} from "chart.js";
import { humidityChartConfig } from "../charts/humidityChart";
import { DHTContext } from "../contexts/DHTContext";

Chart.register(
  LineController,
  LinearScale,
  LineElement,
  PointElement,
  CategoryScale,
  Tooltip,
  Filler
);

export default function Activity() {
  const canvasSuhuRef = useRef<HTMLCanvasElement | null>(null);
  const canvasKelembabanRef = useRef<HTMLCanvasElement | null>(null);
  let lineChartSuhu: Chart<"line", number[], number> | null = null;
  let lineChartKelembaban: Chart<"line", number[], number> | null = null;
  const { temperatures, humiditis } = useContext(DHTContext);

  useEffect(() => {
    document.title = "Activity - Smart Inkubator";

    if (canvasSuhuRef.current) {
      if (lineChartSuhu) {
        console.log("destroy");
        lineChartSuhu.destroy();
      }

      lineChartSuhu = new Chart(canvasSuhuRef.current, temperatureChartConfig);
    }

    if (canvasKelembabanRef.current) {
      if (lineChartSuhu) {
        console.log("destroy");
        lineChartKelembaban?.destroy();
      }

      lineChartKelembaban = new Chart(
        canvasKelembabanRef.current,
        humidityChartConfig
      );
    }
  }, []);

  useEffect(() => {
    // update line chart suhu
    lineChartSuhu?.data.datasets.forEach((dataset) => {
      dataset.data = temperatures;
    });

    lineChartSuhu?.update();

    // update line chart kelembaban
    lineChartKelembaban?.data.datasets.forEach((dataset) => {
      dataset.data = humiditis;
    });

    lineChartKelembaban?.update();
  }, [temperatures, humiditis]);

  return (
    <div className="flex justify-start items-center flex-col">
      <h1 className="font-bold text-2xl text-gray-800 mb-10">
        Aktifitas Suhu Inkubator
      </h1>
      <div className="w-full box-border md:w-10/12">
        <canvas className="w-full md:w-8/12" ref={canvasSuhuRef}></canvas>
      </div>
      <h1 className="font-bold text-2xl text-gray-800 mt-6 mb-10">
        Aktifitas Kelembaban Inkubator
      </h1>
      <div className="w-full box-border md:w-10/12">
        <canvas className="w-full md:w-8/12" ref={canvasKelembabanRef}></canvas>
      </div>
    </div>
  );
}
