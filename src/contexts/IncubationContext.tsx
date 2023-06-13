import React, { createContext, useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { store } from "../firebase";

interface IIncubation {
  startTime: number | null;
  setStartTime: React.Dispatch<React.SetStateAction<number | null>>;
}

interface IIncubationProvider {
  children: JSX.Element;
}

export const IncubationContext = createContext<IIncubation>({
  startTime: null,
  setStartTime: () => {},
});

export default function IncubationContextProvider({
  children,
}: IIncubationProvider) {
  const [startTime, setStartTime] = useState<number | null>(null);

  async function getStartTime() {
    try {
      const data = await getDoc(doc(store, "inkubasi", "Fugpmk0eneisnyf8pjh5"));
      const time = data.get("time");

      if (time) {
        setStartTime(time.seconds * 1000);
      } else {
        setStartTime(null);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getStartTime();
  }, []);

  return (
    <IncubationContext.Provider
      value={{ startTime: startTime, setStartTime: setStartTime }}
    >
      {children}
    </IncubationContext.Provider>
  );
}
