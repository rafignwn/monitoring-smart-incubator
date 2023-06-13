import { updateDoc, doc, Timestamp } from "firebase/firestore";
import { store } from "../firebase";
import { useState, useContext, useEffect } from "react";
import { IncubationContext } from "../contexts/IncubationContext";

export default function ControlPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const { startTime, setStartTime } = useContext(IncubationContext);

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
          <button className="bg-green-700 text-white font-bold hover:bg-green-600 cursor-pointer px-5 py-2 rounded-sm">
            Turn On
          </button>
        </div>

        <div className="relative border-2 border-green-400 p-5 pt-8 text-center font-mono w-full sm:col-span-2 sm:mt-5">
          <p className="font-semibold whitespace-nowrap absolute -translate-y-1/2 -translate-x-1/2 left-1/2 -top-1 bg-emerald-100 px-2 text-xl text-green-500 mb-2">
            Kondisi Lampu
          </p>
          <button className="bg-emerald-600 text-white font-bold hover:bg-green-600 cursor-pointer px-5 py-2 rounded-sm">
            Lampu 'HIDUP'
          </button>
        </div>
      </div>
    </div>
  );
}
