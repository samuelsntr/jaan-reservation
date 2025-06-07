// src/contexts/ReservationRefreshContext.jsx
import { createContext, useContext, useState } from "react";

const ReservationRefreshContext = createContext();

export const useReservationRefresh = () =>
  useContext(ReservationRefreshContext);

export function ReservationRefreshProvider({ children }) {
  const [refreshCount, setRefreshCount] = useState(0);

  const triggerRefresh = () => {
    setRefreshCount((prev) => prev + 1);
  };

  return (
    <ReservationRefreshContext.Provider
      value={{ refreshCount, triggerRefresh }}
    >
      {children}
    </ReservationRefreshContext.Provider>
  );
}
