import { BaseUserMeta, User } from "@liveblocks/client";

export enum CursorMode {
  Hidden,
  Chat,
  ReactionSelector,
  Reaction,
}

export type CursorState =
  | {
      mode: CursorMode.Hidden;
    }
  | {
      mode: CursorMode.Chat;
      message: string;
      previousMessage: string | null;
    }
  | {
      mode: CursorMode.ReactionSelector;
    }
  | {
      mode: CursorMode.Reaction;
      reaction: string;
      isPressed: boolean;
    };

export type CursorChatProps = {
  cursor: { x: number; y: number };
  cursorState: CursorState;
  setCursorState: (cursorState: CursorState) => void;
  updateMyPresence: (
    presence: Partial<{
      cursor: { x: number; y: number };
      cursorColor: string;
      message: string;
    }>
  ) => void;
};

export type Presence = any;

export type LiveCursorsProps = {
  others: readonly User<Presence, BaseUserMeta>[];
};

export type CursorProps = {
  color: string;
  x: number;
  y: number;
  message: string;
};

export type ReactionSelectorProps = {
  setReaction: (reaction: string) => void;
};

export type ReactionButtonProps = {
  reaction: string;
  onSelect: (reaction: string) => void;
};

export type Reaction = {
  value: string;
  timestamp: number;
  point: { x: number; y: number };
};

export type FlyingReactionProps = {
  x: number;
  y: number;
  timestamp: number;
  value: string;
};
