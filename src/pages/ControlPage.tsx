import { updateDoc, doc, Timestamp } from "firebase/firestore";
import { db, store } from "../firebase";
import { useState, useContext, useEffect } from "react";
import { IncubationContext } from "../contexts/IncubationContext";
import { onValue, ref, set } from "firebase/database";

export default function ControlPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const { startTime, setStartTime } = useContext(IncubationContext);
  const [isOn, setIsOn] = useState<boolean | null>(null);
  const [lightOne, setLightOne] = useState<boolean | null>(null);
  const [lightTwo, setLightTwo] = useState<boolean | null>(null);

  async function handleMotorDc() {
    try {
      if (isOn == null) return;

      if (isOn) {
        setIsOn(null);
        await set(ref(db, "kondisi/dinamo"), 0);
      } else {
        setIsOn(null);
        await set(ref(db, "kondisi/dinamo"), 1);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleIncubation() {
    try {
      setLoading(true);

      if (startTime) {
        await updateDoc(doc(store, "inkubasi", "Fugpmk0eneisnyf8pjh5"), {
          time: null,
        });
        setStartTime(null);
      } else {
        await updateDoc(doc(store, "inkubasi", "Fugpmk0eneisnyf8pjh5"), {
          time: Timestamp.now(),
        });
        setStartTime(new Date().getTime());
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    document.title = "Control - Smart Incubation";

    const unsubCondition = onValue(
      ref(db, "kondisi/dinamo"),
      (snapshot) => {
        const val: number = snapshot.val();

        if (val == 1) {
          setIsOn(true);
        } else {
          setIsOn(false);
        }
      },
      (error) => {
        console.log(error);
      }
    );

    const unsubTemperature = onValue(
      ref(db, "suhu"),
      (snapshot) => {
        const data: Array<number> = snapshot.val();
        const temperature = data[data.length - 1];

        if (temperature < 37) {
          setLightOne(true);
          setLightTwo(true);
        } else if (temperature > 39 && temperature < 40) {
          setLightOne(false);
          setLightTwo(true);
        } else if (temperature > 40) {
          setLightOne(false);
          setLightTwo(false);
        }
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsubCondition();
      unsubTemperature();
    };
  }, []);

  return (
    <div>
      <h1 className="font-bold text-3xl sm:text-left text-center text-emerald-800">
        Incubator Control
      </h1>

      <div className="grid sm:grid-cols-2 grid-cols-1 mt-12 w-full lg:w-1/2 gap-8 sm:gap-4">
        {/* control inkubasi */}
        <div className="relative border-2 border-emerald-400 p-5 pt-8 font-mono w-full text-center">
          <p className="font-semibold absolute -translate-y-1/2 -translate-x-1/2 left-1/2 -top-1 bg-emerald-100 px-2 text-xl text-emerald-600 mb-2">
            Incubation
          </p>
          <button
            onClick={handleIncubation}
            disabled={loading}
            className={`${
              startTime ? "bg-red-700" : "bg-sky-700"
            } text-white font-semibold rounded-sm cursor-pointer ${
              startTime ? "hover:bg-red-600" : "hover:bg-sky-600"
            } transition-colors px-4 py-2 `}
          >
            {loading
              ? "Please Wait..."
              : startTime
              ? "Stop Incubation"
              : "Start Incubation"}
          </button>
        </div>

        {/* control motor dc */}
        <div className="relative border-2 border-emerald-400 p-5 pt-8 text-center font-mono w-full">
          <p className="font-semibold whitespace-nowrap absolute -translate-y-1/2 -translate-x-1/2 left-1/2 -top-1 bg-emerald-100 px-2 text-xl text-emerald-600 mb-2">
            Motor DC
          </p>
          <button
            onClick={handleMotorDc}
            disabled={isOn == null}
            className={`${
              isOn
                ? "bg-red-700 hover:bg-red-600"
                : "bg-green-700 hover:bg-green-600"
            } text-white font-bold cursor-pointer px-5 py-2 rounded-sm`}
          >
            {isOn == null ? "Loading..." : isOn ? "Turn Off" : "Turn On"}
          </button>
        </div>

        <div className="relative border-2 border-green-400 pb-5 px-2 sm:px-5 pt-8 text-center font-mono w-full sm:col-span-2 sm:mt-5">
          <p className="font-semibold whitespace-nowrap absolute -translate-y-1/2 -translate-x-1/2 left-1/2 -top-1 bg-emerald-100 px-2 text-xl text-green-500 mb-2">
            Kondisi Lampu
          </p>
          <span
            className={`${
              lightOne ? "bg-emerald-600" : "bg-red-600"
            } text-white inline-block font-bold cursor-pointer px-5 py-2 rounded-sm`}
          >
            Lampu 1 '{lightOne == null ? "..-.." : lightOne ? "HIDUP" : "MATI"}'
          </span>
          <span
            className={`${
              lightTwo ? "bg-emerald-600" : "bg-red-600"
            } mt-4 ml-0 xs:mt-0 xs:ml-4 inline-block text-white font-bold cursor-pointer px-5 py-2 rounded-sm`}
          >
            Lampu 2 '{lightTwo == null ? "..-.." : lightTwo ? "HIDUP" : "MATI"}'
          </span>
        </div>
      </div>
    </div>
  );
}
