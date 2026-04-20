import React from "react";

export default function Time({ time }: { time: string }) {
  const date = new Date(time);

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return (
    <>
      {hours}:{minutes}
    </>
  );
}
