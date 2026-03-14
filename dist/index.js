"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  BongoCat: () => BongoCat
});
module.exports = __toCommonJS(index_exports);

// src/bongo-cat.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
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
var DEFAULT_MESSAGES = [
  "meow~ keep typing! \u{1F431}",
  "purrr... nice clicks!",
  "i'm helping! \u{1F43E}",
  "*bonk bonk bonk*",
  "nyaa~ don't mind me~",
  "cats make everything better \u2728",
  "10/10 typing form \u{1F44F}",
  "*purring intensifies*",
  "you're doing great, hooman!",
  "boop! \u{1F43E}",
  "feed me... with keystrokes",
  "i sit on keyboard now",
  "you type, i bonk \u{1F3B9}"
];
var tooltipStyle = {
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
  pointerEvents: "none"
};
var baseImgStyle = {
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
  spriteMarginTop = "37%",
  clickTooltip = true,
  messages = DEFAULT_MESSAGES,
  messageDuration = 2e3,
  className = "",
  style: userStyle
} = {}) {
  const [state, setState] = (0, import_react.useState)("idle");
  const [pulse, setPulse] = (0, import_react.useState)(false);
  const [tooltipMsg, setTooltipMsg] = (0, import_react.useState)(null);
  const pawDownTimeRef = (0, import_react.useRef)(0);
  const idleTimerRef = (0, import_react.useRef)(void 0);
  const tooltipTimerRef = (0, import_react.useRef)(void 0);
  const basePath = assetsPath.replace(/\/$/, "");
  const imgStyle = {
    ...baseImgStyle,
    marginTop: typeof spriteMarginTop === "number" ? `${spriteMarginTop}px` : spriteMarginTop
  };
  const returnToIdle = (0, import_react.useCallback)(() => {
    const elapsed = Date.now() - pawDownTimeRef.current;
    const remaining = Math.max(0, MIN_ANIMATION_MS - elapsed);
    clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => setState("idle"), remaining);
  }, []);
  const triggerPulse = (0, import_react.useCallback)(() => {
    if (!pulseEnabled) return;
    setPulse(true);
    requestAnimationFrame(() => {
      setTimeout(() => setPulse(false), 150);
    });
  }, [pulseEnabled]);
  (0, import_react.useEffect)(() => {
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
      clearTimeout(tooltipTimerRef.current);
    };
  }, [returnToIdle, triggerPulse]);
  const handleCatClick = (0, import_react.useCallback)(() => {
    if (!clickTooltip || messages.length === 0) return;
    clearTimeout(tooltipTimerRef.current);
    setTooltipMsg(messages[Math.floor(Math.random() * messages.length)]);
    tooltipTimerRef.current = setTimeout(() => setTooltipMsg(null), messageDuration);
  }, [clickTooltip, messages, messageDuration]);
  const leftDown = state === "leftPawDown" || state === "bothPawsDown";
  const rightDown = state === "rightPawDown" || state === "bothPawsDown";
  const containerStyle = {
    position: "fixed",
    bottom: typeof bottom === "number" ? `${bottom}px` : bottom,
    right: typeof right === "number" ? `${right}px` : right,
    width,
    height,
    zIndex,
    cursor: clickTooltip ? "pointer" : void 0,
    userSelect: "none",
    transform: pulse ? "scale(1.08)" : "scale(1)",
    transition: "transform 0.1s ease-out",
    ...userStyle
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `@keyframes bongocat-fade-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}` }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "div",
      {
        className,
        style: containerStyle,
        onClick: handleCatClick,
        children: [
          tooltipMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: tooltipStyle, children: tooltipMsg }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: `${basePath}/base.png`, alt: "", draggable: false, style: imgStyle }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "img",
            {
              src: leftDown ? `${basePath}/left-down.png` : `${basePath}/left-up.png`,
              alt: "",
              draggable: false,
              style: imgStyle
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "img",
            {
              src: rightDown ? `${basePath}/right-down.png` : `${basePath}/right-up.png`,
              alt: "",
              draggable: false,
              style: imgStyle
            }
          )
        ]
      }
    )
  ] });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BongoCat
});
//# sourceMappingURL=index.js.map