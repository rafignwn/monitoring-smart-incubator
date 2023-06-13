import { useEffect } from "react";

export default function Notifications() {
  useEffect(() => {
    document.title = "Notification - Monitor Suhu";
  }, []);

  return (
    <div className="bg-amber-400">
      <h1>Notifications</h1>
    </div>
  );
}
