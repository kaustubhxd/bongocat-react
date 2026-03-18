import { useState, useEffect, useRef, useCallback, CSSProperties } from "react";
import base from "../assets/base.png";
import left_up from "../assets/left-up.png";
import left_down from "../assets/left-down.png";
import right_up from "../assets/right-up.png";
import right_down from "../assets/right-down.png";

type CatState = "idle" | "leftPawDown" | "rightPawDown" | "bothPawsDown";

export interface BongoCatProps {
  /** CSS bottom offset. Defaults to 16 */
  bottom?: number | string;
  /** CSS right offset. Defaults to 16 */
  right?: number | string;
  /** Width in px. Defaults to 65 */
  width?: number;
  /** Height in px. Defaults to 40 */
  height?: number;
  /** z-index. Defaults to 9998 */
  zIndex?: number;
  /** Enable scale pulse on input. Defaults to true */
  pulse?: boolean;
  /** Margin-top applied to each sprite image to ground the cat visually. Defaults to "37%" */
  spriteMarginTop?: string | number;
  /** Show a fun tooltip when the cat is clicked. Defaults to true */
  clickTooltip?: boolean;
  /** Custom tooltip messages. Uses built-in cat messages if not provided */
  messages?: string[];
  /** How long the tooltip stays visible in ms. Defaults to 2000 */
  messageDuration?: number;
  /** Additional className on the container */
  className?: string;
  /** Additional inline styles on the container */
  style?: CSSProperties;
}

// Physical key codes for the left side of the keyboard
const LEFT_KEYS = new Set([
  "Digit1", "Digit2", "Digit3", "Digit4", "Digit5",
  "KeyQ", "KeyW", "KeyE", "KeyR", "KeyT",
  "KeyA", "KeyS", "KeyD", "KeyF", "KeyG",
  "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB",
  "Tab", "CapsLock", "ShiftLeft", "ControlLeft", "AltLeft", "MetaLeft",
  "Backquote", "Escape",
]);

const RIGHT_KEYS = new Set([
  "Digit6", "Digit7", "Digit8", "Digit9", "Digit0",
  "KeyY", "KeyU", "KeyI", "KeyO", "KeyP",
  "KeyH", "KeyJ", "KeyK", "KeyL",
  "KeyN", "KeyM",
  "Enter", "Backspace", "Delete", "ShiftRight", "ControlRight", "AltRight", "MetaRight",
  "BracketLeft", "BracketRight", "Backslash", "Semicolon", "Quote",
  "Comma", "Period", "Slash", "Minus", "Equal",
  "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
]);

const MIN_ANIMATION_MS = 100;

const DEFAULT_MESSAGES = [
  "meow~ keep typing! 🐱",
  "purrr... nice clicks!",
  "i'm helping! 🐾",
  "*bonk bonk bonk*",
  "nyaa~ don't mind me~",
  "cats make everything better ✨",
  "10/10 typing form 👏",
  "*purring intensifies*",
  "you're doing great, hooman!",
  "boop! 🐾",
  "feed me... with keystrokes",
  "i sit on keyboard now",
  "you type, i bonk 🎹",
];

const tooltipStyle: CSSProperties = {
  position: "absolute",
  top: -36,
  right: 0,
  whiteSpace: "nowrap",
  borderRadius: 8,
  backgroundColor: "#18181b",
  color: "#fafafa",
  padding: "6px 12px",
  fontSize: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  animation: "bongocat-fade-in 0.15s ease-out",
  pointerEvents: "none",
};

const baseImgStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "contain",
  pointerEvents: "none",
};

export function BongoCat({
  bottom = 16,
  right = 16,
  width = 65,
  height = 40,
  zIndex = 9998,
  pulse: pulseEnabled = true,
  spriteMarginTop = "37%",
  clickTooltip = true,
  messages = DEFAULT_MESSAGES,
  messageDuration = 2000,
  className = "",
  style: userStyle,
}: BongoCatProps = {}) {
  const [state, setState] = useState<CatState>("idle");
  const [pulse, setPulse] = useState(false);
  const [tooltipMsg, setTooltipMsg] = useState<string | null>(null);
  const pawDownTimeRef = useRef(0);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const imgStyle: CSSProperties = {
    ...baseImgStyle,
    marginTop:
      typeof spriteMarginTop === "number"
        ? `${spriteMarginTop}px`
        : spriteMarginTop,
  };

  const returnToIdle = useCallback(() => {
    const elapsed = Date.now() - pawDownTimeRef.current;
    const remaining = Math.max(0, MIN_ANIMATION_MS - elapsed);

    clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => setState("idle"), remaining);
  }, []);

  const triggerPulse = useCallback(() => {
    if (!pulseEnabled) return;
    setPulse(true);
    requestAnimationFrame(() => {
      setTimeout(() => setPulse(false), 150);
    });
  }, [pulseEnabled]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;

      pawDownTimeRef.current = Date.now();
      clearTimeout(idleTimerRef.current);
      triggerPulse();

      if (LEFT_KEYS.has(e.code)) {
        setState("leftPawDown");
      } else if (RIGHT_KEYS.has(e.code)) {
        setState("rightPawDown");
      } else {
        setState(
          e.code.charCodeAt(0) % 2 === 0 ? "leftPawDown" : "rightPawDown",
        );
      }
    };

    const onKeyUp = () => {
      returnToIdle();
    };

    const onMouseDown = (e: MouseEvent) => {
      pawDownTimeRef.current = Date.now();
      clearTimeout(idleTimerRef.current);
      triggerPulse();

      if (e.button === 2) {
        setState("rightPawDown");
      } else {
        setState("leftPawDown");
      }
    };

    const onMouseUp = () => {
      returnToIdle();
    };

    const onContextMenu = () => {
      returnToIdle();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    window.addEventListener("mousedown", onMouseDown, true);
    window.addEventListener("mouseup", onMouseUp, true);
    window.addEventListener("contextmenu", onContextMenu, true);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("mousedown", onMouseDown, true);
      window.removeEventListener("mouseup", onMouseUp, true);
      window.removeEventListener("contextmenu", onContextMenu, true);
      clearTimeout(idleTimerRef.current);
      clearTimeout(tooltipTimerRef.current);
    };
  }, [returnToIdle, triggerPulse]);

  const handleCatClick = useCallback(() => {
    if (!clickTooltip || messages.length === 0) return;
    clearTimeout(tooltipTimerRef.current);
    setTooltipMsg(messages[Math.floor(Math.random() * messages.length)]);
    tooltipTimerRef.current = setTimeout(
      () => setTooltipMsg(null),
      messageDuration,
    );
  }, [clickTooltip, messages, messageDuration]);

  const leftDown = state === "leftPawDown" || state === "bothPawsDown";
  const rightDown = state === "rightPawDown" || state === "bothPawsDown";

  const containerStyle: CSSProperties = {
    position: "fixed",
    bottom: typeof bottom === "number" ? `${bottom}px` : bottom,
    right: typeof right === "number" ? `${right}px` : right,
    width,
    height,
    zIndex,
    cursor: clickTooltip ? "pointer" : undefined,
    userSelect: "none",
    transform: pulse ? "scale(1.08)" : "scale(1)",
    transition: "transform 0.1s ease-out",
    ...userStyle,
  };

  return (
    <>
      <style>{`@keyframes bongocat-fade-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div
        className={className}
        style={containerStyle}
        onClick={handleCatClick}
      >
        {tooltipMsg && <div style={tooltipStyle}>{tooltipMsg}</div>}
        <img src={base} alt="" draggable={false} style={imgStyle} />
        <img
          src={leftDown ? left_down : left_up}
          alt=""
          draggable={false}
          style={imgStyle}
        />
        <img
          src={rightDown ? right_down : right_up}
          alt=""
          draggable={false}
          style={imgStyle}
        />
      </div>
    </>
  );
}
