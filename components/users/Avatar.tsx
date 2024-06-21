import React from "react";
import styles from "./Avatar.module.css";

export function Avatar({
  name,
  otherStyle,
}: {
  name: string;
  otherStyle?: string;
}) {
  return (
    <div
      className={`${styles.avatar} ${otherStyle} h-9 w-9`}
      data-tooltip={name}
    >
      <img
        alt={name}
        src={
          "https://liveblocks.io/avatars/avatar-" +
          Math.floor(Math.random() * 30) +
          ".png"
        }
        className={styles.avatar_picture}
      />
    </div>
  );
}
