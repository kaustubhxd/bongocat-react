# bongocat-react

A React component that adds an animated BongoCat overlay to your app. The cat reacts to keyboard typing and mouse clicks in real-time.

Based on the sprite system from [BongoCat-mac](https://github.com/Gamma-Software/BongoCat-mac) (MIT licensed).

## Install

```bash
npm install bongocat-react
```

## Setup

1. Copy the 5 sprite PNGs into your public directory (e.g. `public/bongo-cat/`):
   - `base.png` — cat body
   - `left-up.png` / `left-down.png` — left paw states
   - `right-up.png` / `right-down.png` — right paw states

   You can find the original sprites in the `assets/` folder of this repo.

2. Add the component:

```tsx
import { BongoCat } from "bongocat-react";

function App() {
  return (
    <div>
      <BongoCat />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `assetsPath` | `string` | `"/bongo-cat"` | Base URL path to sprite PNGs |
| `bottom` | `number \| string` | `16` | CSS bottom offset |
| `right` | `number \| string` | `16` | CSS right offset |
| `width` | `number` | `65` | Container width in px |
| `height` | `number` | `40` | Container height in px |
| `zIndex` | `number` | `9998` | z-index of the overlay |
| `pulse` | `boolean` | `true` | Scale pulse animation on input |
| `className` | `string` | `""` | Additional CSS class |
| `style` | `CSSProperties` | — | Additional inline styles |

## How it works

- Listens to `keydown`/`keyup` on `document` and `mousedown`/`mouseup` on `window` (capture phase)
- Maps physical key positions (`event.code`) to left/right paw — left-half keyboard keys move the left paw, right-half keys move the right paw
- Left mouse click → left paw, right click → right paw
- `pointer-events: none` — the cat never intercepts your clicks
- Handles context menu stealing mouseup events

## Credits

- Cat sprites from [BongoCat-mac](https://github.com/Gamma-Software/BongoCat-mac) by Valentin Rudloff (MIT)
- Original BongoCat meme by [@DitzyFlama](https://twitter.com/DitzyFlama), cat art by [@StrayRogue](https://twitter.com/StrayRogue)

## License

MIT
