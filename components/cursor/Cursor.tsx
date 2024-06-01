import CursorSVG from "@/public/assets/CursorSVG";
import { CursorProps } from "@/types/types";
import React from "react";

const Cursor = ({ color, x, y, message }: CursorProps) => {
  return (
    <div
      className="pointer-events-none absolute top-0 left-0"
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
    >
      <CursorSVG color={color} />

      {message && (
        <div
          className="absolute left-2 top-5 px-4 py-2 text-sm leading-relaxed text-white rounded-[20px] whitespace-nowrap"
          style={{ backgroundColor: color }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default Cursor;
