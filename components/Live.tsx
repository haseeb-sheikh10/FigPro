import { useMyPresence, useOthers } from "@/liveblocks.config";
import { CursorMode, CursorState, Reaction } from "@/types/types";
import { useCallback, useEffect, useState } from "react";
import CursorChat from "./cursor/CursorChat";
import LiveCursors from "./cursor/LiveCursors";
import ReactionSelector from "./reaction/ReactionSelector";

const Live = () => {
  const others = useOthers();
  const [{ cursor }, updateMyPresence] = useMyPresence() as any;
  const [cursorState, setCursorState] = useState<CursorState>({
    mode: CursorMode.Hidden,
  });

  const [reactions, setReactions] = useState<Reaction[]>([]);

  const setReaction = useCallback((reaction: string) => {
    setCursorState({ mode: CursorMode.Reaction, reaction, isPressed: false });
  }, []);

  const onMouseMove = (e: React.PointerEvent) => {
    if (cursor === null || cursorState.mode !== CursorMode.ReactionSelector) {
      updateMyPresence({
        cursor: { x: Math.round(e.clientX), y: Math.round(e.clientY) },
      });
    }
  };
  const onMouseLeave = (e: React.PointerEvent) => {
    setCursorState({
      mode: CursorMode.Hidden,
    });
    updateMyPresence({
      cursor: null,
      message: null,
    });
  };

  const onMouseDown = (e: React.PointerEvent) => {
    updateMyPresence({
      cursor: { x: Math.round(e.clientX), y: Math.round(e.clientY) },
    });
    setCursorState((state: CursorState) =>
      state.mode === CursorMode.Reaction ? { ...state, isPressed: true } : state
    );
  };
  const onMouseUp = (e: React.PointerEvent) => {
    setCursorState((state: CursorState) =>
      state.mode === CursorMode.Reaction
        ? { ...state, isPressed: false }
        : state
    );
  };

  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "/") {
        setCursorState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: "",
        });
      } else if (e.key === "Escape") {
        updateMyPresence({ message: "" });
        setCursorState({
          mode: CursorMode.Hidden,
        });
      } else if (e.key === "e") {
        setCursorState({
          mode: CursorMode.ReactionSelector,
        });
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/") {
        e.preventDefault();
      } else if (e.key === "e") {
        e.preventDefault();
      }
    };

    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [updateMyPresence]);

  return (
    <div
      className="h-[100vh] w-full"
      onPointerMove={onMouseMove}
      onPointerLeave={onMouseLeave}
      onPointerDown={onMouseDown}
      onPointerUp={onMouseUp}
    >
      {cursor && cursorState.mode === CursorMode.Chat && (
        <CursorChat
          cursor={cursor}
          cursorState={cursorState}
          setCursorState={setCursorState}
          updateMyPresence={updateMyPresence}
        />
      )}
      {cursor && cursorState.mode === CursorMode.ReactionSelector && (
        <ReactionSelector setReaction={setReaction} />
      )}

      <LiveCursors others={others} />
    </div>
  );
};

export default Live;
