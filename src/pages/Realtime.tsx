import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { Toaster } from "react-hot-toast";

export default function Realtime() {
  const [temperature, setTemperature] = useState<number>(0);
  const [humidity, setHumidity] = useState<number>(0);

  useEffect(() => {
    document.title = "Dashboard - Monitor Suhu dan Kelembaban";

    const unsubTemperature = onValue(
      ref(db, "suhu"),
      (snapshot) => {
        const data: Array<number> = snapshot.val();
        setTemperature(data[data.length - 1]);
      },
      (error) => {
        console.log(error);
      }
    );

    const unsubHumidity = onValue(
      ref(db, "kelembaban"),
      (snapshot) => {
        const data: Array<number> = snapshot.val();
        setHumidity(data[data.length - 1]);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsubTemperature();
      unsubHumidity();
    };
  }, []);

  return (
    <div>
      <Toaster />
      <h1 className="text-emerald-700 text-3xl font-bold mb-10 text-center">
        Nilai Suhu dan Kelembaban Incubator
      </h1>

      <div className="flex flex-col items-center justify-center mt-20 w-full">
        <span className="text-emerald-700 text-2xl px-4 py-2 bg-emerald-200 rounded-xl uppercase font-semibold mb-8">
          REALTIME DATA
        </span>
        <div className="grid grid-cols-1 w-full place-items-center md:w-fit md:grid-cols-2">
          <div className="flex flex-col items-center justify-center border-2 border-emerald-500 w-72 h-44 rounded-full md:mr-4">
            <span className="text-3xl mb-4 font-bold text-emerald-500">
              Suhu
            </span>
            <p className="text-4xl font-bold text-emerald-600 border border-emerald-400 bg-white rounded-xl px-6 py-4">{`${temperature} °C`}</p>
          </div>
          <div className="flex flex-col items-center justify-center border-2 border-emerald-500 w-72 h-44 rounded-full mt-6 mb-8 md:ml-4">
            <span className="text-3xl mb-4 font-bold text-emerald-500">
              Kelembaban
            </span>
            <p className="text-4xl font-bold text-emerald-600 border border-emerald-400 bg-white rounded-xl px-6 py-4">{`${humidity} %`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
