import {
  useBroadcastEvent,
  useEventListener,
  useMyPresence,
  useOthers,
} from "@/liveblocks.config";
import {
  CursorMode,
  CursorState,
  Reaction,
  ReactionEvent,
} from "@/types/types";
import { useCallback, useEffect, useState } from "react";
import CursorChat from "./cursor/CursorChat";
import LiveCursors from "./cursor/LiveCursors";
import ReactionSelector from "./reaction/ReactionSelector";
import useInterval from "@/hooks/useInterval";
import FlyingReaction from "./reaction/FlyingReaction";

const Live = () => {
  const others = useOthers();
  const [{ cursor }, updateMyPresence] = useMyPresence() as any;
  const [cursorState, setCursorState] = useState<CursorState>({
    mode: CursorMode.Hidden,
  });
  const broadcast = useBroadcastEvent();

  const [reactions, setReactions] = useState<Reaction[]>([]);

  const setReaction = useCallback((reaction: string) => {
    setCursorState({ mode: CursorMode.Reaction, reaction, isPressed: true });
  }, []);

  const onMouseMove = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      if (cursor === null || cursorState.mode !== CursorMode.ReactionSelector) {
        updateMyPresence({
          cursor: { x: Math.round(e.clientX), y: Math.round(e.clientY) },
        });
      }
    },
    [cursorState.mode]
  );

  const onMouseLeave = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setCursorState({
      mode: CursorMode.Hidden,
    });
    updateMyPresence({
      cursor: null,
      message: null,
    });
  }, []);

  const onMouseDown = useCallback(
    (e: React.PointerEvent) => {
      updateMyPresence({
        cursor: { x: Math.round(e.clientX), y: Math.round(e.clientY) },
      });
      setCursorState((state: CursorState) =>
        state.mode === CursorMode.Reaction
          ? { ...state, isPressed: true }
          : state
      );
    },
    [cursorState, setCursorState]
  );

  const onMouseUp = useCallback(
    (e: React.PointerEvent) => {
      setCursorState((state: CursorState) =>
        state.mode === CursorMode.Reaction
          ? { ...state, isPressed: false }
          : state
      );
    },
    [cursorState, setCursorState]
  );

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
      }
    };

    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [updateMyPresence]);

  useInterval(() => {
    setReactions((reactions) =>
      reactions.filter((reaction) => reaction.timestamp > Date.now() - 4000)
    );
  }, 1000);

  useInterval(() => {
    if (
      cursorState.mode === CursorMode.Reaction &&
      cursorState.isPressed &&
      cursor
    ) {
      console.log("concating");
      setReactions((reactions) =>
        reactions.concat([
          {
            point: { x: cursor.x, y: cursor.y },
            value: cursorState.reaction,
            timestamp: Date.now(),
          },
        ])
      );
      broadcast({
        x: cursor.x,
        y: cursor.y,
        value: cursorState.reaction,
      });
    }
  }, 100);

  useEventListener((eventData) => {
    const event = eventData.event as ReactionEvent;

    setReactions((reactions) =>
      reactions.concat([
        {
          point: { x: event.x, y: event.y },
          value: event.value,
          timestamp: Date.now(),
        },
      ])
    );
  });

  return (
    <div
      className="h-screen w-full overflow-hidden"
      onPointerMove={onMouseMove}
      onPointerLeave={onMouseLeave}
      onPointerDown={onMouseDown}
      onPointerUp={onMouseUp}
    >
      <canvas></canvas>

      {reactions.map((reaction, key) => (
        <FlyingReaction
          key={key}
          timestamp={reaction.timestamp}
          x={reaction.point.x}
          y={reaction.point.y}
          value={reaction.value}
        />
      ))}

      {cursor && cursorState.mode === CursorMode.Chat && (
        <CursorChat
          cursor={cursor}
          cursorState={cursorState}
          setCursorState={setCursorState}
          updateMyPresence={updateMyPresence}
        />
      )}

      {cursor && cursorState.mode === CursorMode.ReactionSelector && (
        <ReactionSelector setReaction={(reaction) => setReaction(reaction)} />
      )}

      <LiveCursors others={others} />
    </div>
  );
};

export default Live;
