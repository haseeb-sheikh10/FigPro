import { ReactionButtonProps } from "@/types/types";
import React from "react";

const ReactionButton = ({ reaction, onSelect }: ReactionButtonProps) => {
  return (
    <button
      className="transform select-none p-2 text-xl transition-transform hover:scale-150 focus:scale-150 focus:outline-none"
      onClick={() => onSelect(reaction)}
    >
      {reaction}
    </button>
  );
};

export default ReactionButton;
