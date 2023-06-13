import { useEffect, useState, useRef, useContext } from "react";
import colors from "tailwindcss/colors";
import "./index.css";
import { HamburgerButton } from "@icon-park/react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { IncubationContext } from "../contexts/IncubationContext";

export default function MainLayout() {
  const [show, setShow] = useState<boolean>(true);
  const btnShowRef = useRef<HTMLButtonElement | null>(null);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const { currentUser } = useContext(AuthContext);
  const { startTime } = useContext(IncubationContext);
  const [elapsedTime, setElapsedTime] = useState<number | null>(null);
  const intervalIncubationRef = useRef<number | undefined>(undefined);

  function timeFormat(time: number) {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  function startIncubation() {
    if (startTime) {
      const now = new Date();
      const elapsedMilliseconds = now.getTime() - startTime;
      setElapsedTime(Math.floor(elapsedMilliseconds / 1000));
    }
  }

  function handleOutsideClick(e: MouseEvent) {
    if (
      !btnShowRef.current?.contains(e.target as Node) &&
      !sidebarRef.current?.contains(e.target as Node)
    ) {
      setShow(false);
    }
  }

  useEffect(() => {
    window.addEventListener("click", handleOutsideClick);

    if (startTime) {
      intervalIncubationRef.current = window.setInterval(startIncubation, 1000);
    } else {
      setElapsedTime(null);
      clearInterval(intervalIncubationRef.current);
    }

    return () => {
      window.removeEventListener("click", handleOutsideClick);
      clearInterval(intervalIncubationRef.current);
    };
  }, [startTime]);

  return (
    <div className="layout_container">
      <div className="topbar bg-emerald-400 flex justify-between items-center px-5 py-2">
        <h4 className="text-emerald-800 tracking-widest text-lg font-bold">
          Welcome back {currentUser?.name.split(" ")[0]}!
        </h4>
        {elapsedTime && startTime && (
          <h5>
            Waktu Inkubasi :{" "}
            <span className="font-bold">{`Hari Ke-${Math.floor(
              elapsedTime / 86400
            )}, ${timeFormat(elapsedTime % 86400)}`}</span>
          </h5>
        )}
        <button
          onClick={() => setShow((prev) => !prev)}
          ref={btnShowRef}
          className="md:hidden rounded-md grid place-items-center w-10 h-10 bg-emerald-400"
        >
          <HamburgerButton size={20} fill={colors.emerald[800]} />
        </button>
      </div>

      <div
        ref={sidebarRef}
        className={`sidebar h-full md:relative z-50 fixed right-0 ${
          show ? "w-56" : "w-0"
        } transition-width duration-200 md:w-56 ease-in-out bg-emerald-200`}
      >
        <Sidebar handleClose={() => setShow(false)} />
      </div>
      <main className="overflow-y-auto">
        <div className="content bg-emerald-100 p-3 md:p-8">
          <Outlet />
        </div>
        <footer className="bg-emerald-300 flex items-center px-5 text-emerald-800 font-medium">
          <h1>&copy; Akhmad Rizki S - 20040090</h1>
        </footer>
      </main>
    </div>
  );
}
