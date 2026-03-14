import { useState, useEffect, useRef, useCallback, CSSProperties } from "react";

type CatState = "idle" | "leftPawDown" | "rightPawDown" | "bothPawsDown";

export interface BongoCatProps {
  /** Base URL path to the sprite assets directory (must contain base.png, left-up.png, left-down.png, right-up.png, right-down.png). Defaults to "/bongo-cat" */
  assetsPath?: string;
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

const baseImgStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "contain",
  pointerEvents: "none",
};

export function BongoCat({
  assetsPath = "/bongo-cat",
  bottom = 16,
  right = 16,
  width = 65,
  height = 40,
  zIndex = 9998,
  pulse: pulseEnabled = true,
  spriteMarginTop = "37%",
  className = "",
  style: userStyle,
}: BongoCatProps = {}) {
  const [state, setState] = useState<CatState>("idle");
  const [pulse, setPulse] = useState(false);
  const pawDownTimeRef = useRef(0);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const basePath = assetsPath.replace(/\/$/, "");

  const imgStyle: CSSProperties = {
    ...baseImgStyle,
    marginTop: typeof spriteMarginTop === "number" ? `${spriteMarginTop}px` : spriteMarginTop,
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
        setState(e.code.charCodeAt(0) % 2 === 0 ? "leftPawDown" : "rightPawDown");
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
    };
  }, [returnToIdle, triggerPulse]);

  const leftDown = state === "leftPawDown" || state === "bothPawsDown";
  const rightDown = state === "rightPawDown" || state === "bothPawsDown";

  const containerStyle: CSSProperties = {
    position: "fixed",
    bottom: typeof bottom === "number" ? `${bottom}px` : bottom,
    right: typeof right === "number" ? `${right}px` : right,
    width,
    height,
    zIndex,
    pointerEvents: "none",
    userSelect: "none",
    transform: pulse ? "scale(1.08)" : "scale(1)",
    transition: "transform 0.1s ease-out",
    ...userStyle,
  };

  return (
    <div className={className} style={containerStyle}>
      <img src={`${basePath}/base.png`} alt="" draggable={false} style={imgStyle} />
      <img
        src={leftDown ? `${basePath}/left-down.png` : `${basePath}/left-up.png`}
        alt=""
        draggable={false}
        style={imgStyle}
      />
      <img
        src={rightDown ? `${basePath}/right-down.png` : `${basePath}/right-up.png`}
        alt=""
        draggable={false}
        style={imgStyle}
      />
    </div>
  );
}
