import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import fotoKuwali1 from "../assets/ayam1.jpg";
import fotoKuwali2 from "../assets/ayam2.jpg";

export default function Dashboard() {
  useEffect(() => {
    document.title = "Dashboard - Smart Inkubator";
  }, []);

  return (
    <div>
      <Toaster />
      <h1 className="text-emerald-700 text-3xl font-bold text-center">
        Selamat datang di website Smart Incubator
      </h1>
      <p className="text-emerald-600 text-xl font-normal mb-10 text-center">
        Memonitoring suhu dan kelembaban secara realtime serta mengontrol
        incubator.
      </p>
      <div className="grid mx-8 grid-cols-1 gap-8 md:grid-cols-2">
        <div className="w-full relative aspect-square border-3 border-emerald-400 overflow-hidden rounded-lg">
          <h4 className="absolute uppercase top-4 left-4 right-4 text-center font-semibold text-emerald-50 rounded-md text-2xl bg-emerald-700 px-4 py-1">
            Foto Incubator
          </h4>
          <img
            className="object-cover w-full h-full"
            src={fotoKuwali1}
            alt="Gambar Alat"
          />
        </div>

        <div className="w-full relative aspect-square border-3 border-emerald-400 overflow-hidden rounded-lg">
          <img
            className="object-cover w-full h-full"
            src={fotoKuwali2}
            alt="Gambar Alat"
          />
        </div>
      </div>
    </div>
  );
}
