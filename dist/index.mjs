// src/bongo-cat.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var LEFT_KEYS = /* @__PURE__ */ new Set([
  "Digit1",
  "Digit2",
  "Digit3",
  "Digit4",
  "Digit5",
  "KeyQ",
  "KeyW",
  "KeyE",
  "KeyR",
  "KeyT",
  "KeyA",
  "KeyS",
  "KeyD",
  "KeyF",
  "KeyG",
  "KeyZ",
  "KeyX",
  "KeyC",
  "KeyV",
  "KeyB",
  "Tab",
  "CapsLock",
  "ShiftLeft",
  "ControlLeft",
  "AltLeft",
  "MetaLeft",
  "Backquote",
  "Escape"
]);
var RIGHT_KEYS = /* @__PURE__ */ new Set([
  "Digit6",
  "Digit7",
  "Digit8",
  "Digit9",
  "Digit0",
  "KeyY",
  "KeyU",
  "KeyI",
  "KeyO",
  "KeyP",
  "KeyH",
  "KeyJ",
  "KeyK",
  "KeyL",
  "KeyN",
  "KeyM",
  "Enter",
  "Backspace",
  "Delete",
  "ShiftRight",
  "ControlRight",
  "AltRight",
  "MetaRight",
  "BracketLeft",
  "BracketRight",
  "Backslash",
  "Semicolon",
  "Quote",
  "Comma",
  "Period",
  "Slash",
  "Minus",
  "Equal",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight"
]);
var MIN_ANIMATION_MS = 100;
var imgStyle = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "contain",
  pointerEvents: "none"
};
function BongoCat({
  assetsPath = "/bongo-cat",
  bottom = 16,
  right = 16,
  width = 65,
  height = 40,
  zIndex = 9998,
  pulse: pulseEnabled = true,
  className = "",
  style: userStyle
} = {}) {
  const [state, setState] = useState("idle");
  const [pulse, setPulse] = useState(false);
  const pawDownTimeRef = useRef(0);
  const idleTimerRef = useRef(void 0);
  const basePath = assetsPath.replace(/\/$/, "");
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
    const onKeyDown = (e) => {
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
    const onMouseDown = (e) => {
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
  const containerStyle = {
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
    ...userStyle
  };
  return /* @__PURE__ */ jsxs("div", { className, style: containerStyle, children: [
    /* @__PURE__ */ jsx("img", { src: `${basePath}/base.png`, alt: "", draggable: false, style: imgStyle }),
    /* @__PURE__ */ jsx(
      "img",
      {
        src: leftDown ? `${basePath}/left-down.png` : `${basePath}/left-up.png`,
        alt: "",
        draggable: false,
        style: imgStyle
      }
    ),
    /* @__PURE__ */ jsx(
      "img",
      {
        src: rightDown ? `${basePath}/right-down.png` : `${basePath}/right-up.png`,
        alt: "",
        draggable: false,
        style: imgStyle
      }
    )
  ] });
}
export {
  BongoCat
};
//# sourceMappingURL=index.mjs.map