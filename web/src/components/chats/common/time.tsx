import React from "react";

export default function Time({ time }: { time: string }) {
  return (
    <>
      {new Date(time).getHours()}:{new Date(time).getMinutes()}
    </>
  );
}
