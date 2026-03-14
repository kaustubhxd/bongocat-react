import * as react_jsx_runtime from 'react/jsx-runtime';
import { CSSProperties } from 'react';

interface BongoCatProps {
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
declare function BongoCat({ assetsPath, bottom, right, width, height, zIndex, pulse: pulseEnabled, spriteMarginTop, clickTooltip, messages, messageDuration, className, style: userStyle, }?: BongoCatProps): react_jsx_runtime.JSX.Element;

export { BongoCat, type BongoCatProps };
