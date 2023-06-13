import { useEffect, useRef } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
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

    const unsubSuhu = onValue(
      ref(db, "suhu"),
      (snapshot) => {
        const resData = snapshot.val();
        console.log(resData);
        lineChartSuhu?.data.datasets.forEach((dataset) => {
          dataset.data = resData;
        });

        lineChartSuhu?.update();
      },
      (error) => {
        console.log(error);
      }
    );

    const unsubKelembaban = onValue(
      ref(db, "kelembaban"),
      (snapshot) => {
        const resData = snapshot.val();
        console.log(resData);
        lineChartKelembaban?.data.datasets.forEach((dataset) => {
          dataset.data = resData;
        });

        lineChartKelembaban?.update();
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsubSuhu();
      unsubKelembaban();
    };
  }, []);

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
