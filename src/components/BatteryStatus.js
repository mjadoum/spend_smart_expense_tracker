import React, { useState, useEffect } from "react";
import { CiBatteryFull, CiBatteryCharging } from "react-icons/ci";



export default function BatteryStatus() {
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [charging, setCharging] = useState(null);

  useEffect(() => {
    if ("getBattery" in navigator) {
      navigator.getBattery().then((battery) => {
        updateBatteryStatus(battery);
        battery.addEventListener("levelchange", () =>
          updateBatteryStatus(battery)
        );
        battery.addEventListener("chargingchange", () =>
          updateBatteryStatus(battery)
        );
      });
    } else {
      console.error("Battery Status API is not supported in this browser.");
    }
  }, []);

  const updateBatteryStatus = (battery) => {
    setBatteryLevel(Math.round(battery.level * 100));
    setCharging(battery.charging);
  };

  return (
    <div className="batteryBox">
      <div>
        {charging ? (
          <CiBatteryCharging className="icon-battery" />
        ) : (
          <CiBatteryFull className="icon-battery" />
        )}

        <p>{batteryLevel}%</p>
       
      </div>
    </div>
  );
}
