import { onValue, ref } from "firebase/database";
import React, { createContext, useEffect, useState } from "react";
import { db } from "../firebase";

type DHTContextType = {
  temperatures: Array<number>;
  humiditis: Array<number>;
};

export const DHTContext: React.Context<DHTContextType> = createContext({
  temperatures: [0],
  humiditis: [0],
});

export default function DHTContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [temperatures, setTemperatures] = useState<Array<number>>([]);
  const [humiditis, setHumiditis] = useState<Array<number>>([]);

  useEffect(() => {
    const unsubTemperatures = onValue(
      ref(db, "suhu"),
      (snapshot) => {
        const val = snapshot.val();

        if (val) {
          setTemperatures(val);
        }
      },
      (error) => {
        console.log(error);
      }
    );

    const unsubHumiditis = onValue(
      ref(db, "kelembaban"),
      (snapshot) => {
        const val = snapshot.val();

        if (val) {
          setHumiditis(val);
        }
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsubHumiditis();
      unsubTemperatures();
    };
  }, []);

  return (
    <DHTContext.Provider value={{ temperatures, humiditis }}>
      {children}
    </DHTContext.Provider>
  );
}
