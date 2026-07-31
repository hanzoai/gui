import { createRequire as __cr } from "module"; const require = __cr(import.meta.url);
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../../core/constants/dist/esm/constants.mjs
import { useEffect, useLayoutEffect } from "react";
var isWeb = true;
var isBrowser = typeof window < "u";
var isServer = isWeb && !isBrowser;
var isClient = isWeb && isBrowser;
var useIsomorphicLayoutEffect = isServer ? useEffect : useLayoutEffect;
var isChrome = typeof navigator < "u" && /Chrome/.test(navigator.userAgent || "");
var isWebTouchable = isClient && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
var isIos = process.env.TEST_NATIVE_PLATFORM === "ios";

// ../../ui/gui/dist/esm/createGui.mjs
import { createGui as createGuiCore } from "@hanzogui/core";
var createGui = process.env.NODE_ENV !== "development" ? createGuiCore : (conf) => {
  const sizeTokenKeys = ["$true"], hasKeys = /* @__PURE__ */ __name((expectedKeys, obj) => expectedKeys.every((k) => typeof obj[k] < "u"), "hasKeys"), guiConfig = createGuiCore(conf);
  for (const name of ["size", "space"]) {
    const tokenSet = guiConfig.tokensParsed[name];
    if (!tokenSet) throw new Error(`Expected tokens for "${name}" in ${Object.keys(guiConfig.tokensParsed).join(", ")}`);
    if (!hasKeys(sizeTokenKeys, tokenSet)) throw new Error(`
createGui() missing expected tokens.${name}:

Received: ${Object.keys(tokenSet).join(", ")}

Expected: ${sizeTokenKeys.join(", ")}

GUI expects a "true" key that is the same value as your default size. This is so 
it can size things up or down from the defaults without assuming which keys you use.

Please define a "true" or "$true" key on your size and space tokens like so (example):

size: {
  sm: 2,
  md: 10,
  true: 10, // this means "md" is your default size
  lg: 20,
}

`);
  }
  const expected = Object.keys(guiConfig.tokensParsed.size);
  for (const name of ["radius", "zIndex"]) {
    const tokenSet = guiConfig.tokensParsed[name], received = Object.keys(tokenSet);
    if (!received.some((rk) => expected.includes(rk))) throw new Error(`
createGui() invalid tokens.${name}:

Received: ${received.join(", ")}

Expected a subset of: ${expected.join(", ")}

`);
  }
  return guiConfig;
};

// ../../core/shorthands/dist/esm/index.mjs
var shorthands = {
  // web-only
  ussel: "userSelect",
  cur: "cursor",
  // gui
  pe: "pointerEvents",
  // text
  col: "color",
  ff: "fontFamily",
  fos: "fontSize",
  fost: "fontStyle",
  fow: "fontWeight",
  ls: "letterSpacing",
  lh: "lineHeight",
  ta: "textAlign",
  tt: "textTransform",
  ww: "wordWrap",
  // view
  ac: "alignContent",
  ai: "alignItems",
  als: "alignSelf",
  b: "bottom",
  bc: "backgroundColor",
  bg: "backgroundColor",
  bbc: "borderBottomColor",
  bblr: "borderBottomLeftRadius",
  bbrr: "borderBottomRightRadius",
  bbw: "borderBottomWidth",
  blc: "borderLeftColor",
  blw: "borderLeftWidth",
  boc: "borderColor",
  br: "borderRadius",
  bs: "borderStyle",
  brw: "borderRightWidth",
  brc: "borderRightColor",
  btc: "borderTopColor",
  btlr: "borderTopLeftRadius",
  btrr: "borderTopRightRadius",
  btw: "borderTopWidth",
  bw: "borderWidth",
  dsp: "display",
  f: "flex",
  fb: "flexBasis",
  fd: "flexDirection",
  fg: "flexGrow",
  fs: "flexShrink",
  fw: "flexWrap",
  h: "height",
  jc: "justifyContent",
  l: "left",
  m: "margin",
  mah: "maxHeight",
  maw: "maxWidth",
  mb: "marginBottom",
  mih: "minHeight",
  miw: "minWidth",
  ml: "marginLeft",
  mr: "marginRight",
  mt: "marginTop",
  mx: "marginHorizontal",
  my: "marginVertical",
  o: "opacity",
  ov: "overflow",
  p: "padding",
  pb: "paddingBottom",
  pl: "paddingLeft",
  pos: "position",
  pr: "paddingRight",
  pt: "paddingTop",
  px: "paddingHorizontal",
  py: "paddingVertical",
  r: "right",
  shac: "shadowColor",
  shar: "shadowRadius",
  shof: "shadowOffset",
  shop: "shadowOpacity",
  t: "top",
  w: "width",
  zi: "zIndex"
};
shorthands.bls = "borderLeftStyle";
shorthands.brs = "borderRightStyle";
shorthands.bts = "borderTopStyle";
shorthands.bbs = "borderBottomStyle";
shorthands.bxs = "boxSizing";
shorthands.bxsh = "boxShadow";
shorthands.ox = "overflowX";
shorthands.oy = "overflowY";
shorthands.ol = "outline";

// ../../core/animation-helpers/dist/esm/normalizeTransition.mjs
var SPRING_CONFIG_KEYS = /* @__PURE__ */ new Set(["stiffness", "damping", "mass", "tension", "friction", "velocity", "overshootClamping", "duration", "bounciness", "speed"]);
function isSpringConfigKey(key) {
  return SPRING_CONFIG_KEYS.has(key);
}
__name(isSpringConfigKey, "isSpringConfigKey");
function normalizeTransition(transition) {
  if (!transition) return {
    default: null,
    enter: null,
    exit: null,
    delay: void 0,
    properties: {}
  };
  if (typeof transition == "string") return {
    default: transition,
    enter: null,
    exit: null,
    delay: void 0,
    properties: {}
  };
  if (Array.isArray(transition)) {
    const [defaultAnimation, configObj] = transition, properties = {}, springConfig = {};
    let delay, enter = null, exit = null;
    if (configObj && typeof configObj == "object") for (const [key, value] of Object.entries(configObj)) key === "delay" && typeof value == "number" ? delay = value : key === "enter" && typeof value == "string" ? enter = value : key === "exit" && typeof value == "string" ? exit = value : isSpringConfigKey(key) && value !== void 0 ? springConfig[key] = value : value !== void 0 && (properties[key] = value);
    return {
      default: defaultAnimation,
      enter,
      exit,
      delay,
      properties,
      config: Object.keys(springConfig).length > 0 ? springConfig : void 0
    };
  }
  if (typeof transition == "object") {
    const properties = {}, springConfig = {};
    let defaultAnimation = null, enter = null, exit = null, delay;
    for (const [key, value] of Object.entries(transition)) key === "default" && typeof value == "string" ? defaultAnimation = value : key === "enter" && typeof value == "string" ? enter = value : key === "exit" && typeof value == "string" ? exit = value : key === "delay" && typeof value == "number" ? delay = value : isSpringConfigKey(key) && value !== void 0 ? springConfig[key] = value : value !== void 0 && (properties[key] = value);
    return {
      default: defaultAnimation,
      enter,
      exit,
      delay,
      properties,
      config: Object.keys(springConfig).length > 0 ? springConfig : void 0
    };
  }
  return {
    default: null,
    enter: null,
    exit: null,
    delay: void 0,
    properties: {}
  };
}
__name(normalizeTransition, "normalizeTransition");
function hasAnimation(normalized) {
  return normalized.default !== null || normalized.enter !== null || normalized.exit !== null || Object.keys(normalized.properties).length > 0;
}
__name(hasAnimation, "hasAnimation");
function getAnimatedProperties(normalized) {
  return Object.keys(normalized.properties);
}
__name(getAnimatedProperties, "getAnimatedProperties");
function getEffectiveAnimation(normalized, state) {
  return state === "enter" && normalized.enter ? normalized.enter : state === "exit" && normalized.exit ? normalized.exit : normalized.default;
}
__name(getEffectiveAnimation, "getEffectiveAnimation");
function getAnimationConfigsForKeys(normalized, animations2, keys, defaultAnimation) {
  const result = /* @__PURE__ */ new Map();
  for (const key of keys) {
    const propAnimation = normalized.properties[key];
    let animationValue = null;
    typeof propAnimation == "string" ? animationValue = animations2[propAnimation] ?? null : propAnimation && typeof propAnimation == "object" && propAnimation.type && (animationValue = animations2[propAnimation.type] ?? null), animationValue === null && (animationValue = defaultAnimation), result.set(key, animationValue);
  }
  return result;
}
__name(getAnimationConfigsForKeys, "getAnimationConfigsForKeys");

// ../../core/use-presence/dist/esm/PresenceContext.mjs
import * as React from "react";
import { jsx } from "react/jsx-runtime";
var PresenceContext = React.createContext(null);
var ResetPresence = /* @__PURE__ */ __name((props) => {
  const parent = React.useContext(PresenceContext);
  return /* @__PURE__ */ jsx(PresenceContext.Provider, {
    value: props.disable ? parent : null,
    children: props.children
  });
}, "ResetPresence");

// ../../core/use-presence/dist/esm/usePresence.mjs
import * as React2 from "react";
function usePresence() {
  const context = React2.useContext(PresenceContext);
  if (!context) return [true, null, context];
  const {
    id,
    isPresent: isPresent2,
    onExitComplete,
    register
  } = context;
  return React2.useEffect(() => register(id), []), !isPresent2 && onExitComplete ? [false, () => onExitComplete?.(id), context] : [true, void 0, context];
}
__name(usePresence, "usePresence");

// ../../core/animations-css/dist/esm/createAnimations.mjs
import { transformsToString } from "@hanzogui/web";
import React3 from "react";
var EXTRACT_MS_REGEX = /(\d+(?:\.\d+)?)\s*ms/;
var EXTRACT_S_REGEX = /(\d+(?:\.\d+)?)\s*s/;
function extractDuration(animation) {
  const msMatch = animation.match(EXTRACT_MS_REGEX);
  if (msMatch) return Number.parseInt(msMatch[1], 10);
  const sMatch = animation.match(EXTRACT_S_REGEX);
  return sMatch ? Math.round(Number.parseFloat(sMatch[1]) * 1e3) : 300;
}
__name(extractDuration, "extractDuration");
var MS_DURATION_REGEX = /(\d+(?:\.\d+)?)\s*ms/;
var S_DURATION_REGEX = /(\d+(?:\.\d+)?)\s*s(?!tiffness)/;
function applyDurationOverride(animation, durationMs) {
  const msReplaced = animation.replace(MS_DURATION_REGEX, `${durationMs}ms`);
  if (msReplaced !== animation) return msReplaced;
  const sReplaced = animation.replace(S_DURATION_REGEX, `${durationMs}ms`);
  return sReplaced !== animation ? sReplaced : `${durationMs}ms ${animation}`;
}
__name(applyDurationOverride, "applyDurationOverride");
var TRANSFORM_KEYS = ["x", "y", "scale", "scaleX", "scaleY", "rotate", "rotateX", "rotateY", "rotateZ", "skewX", "skewY"];
function buildTransformString(style) {
  if (!style) return "";
  const parts = [];
  if (style.x !== void 0 || style.y !== void 0) {
    const x = style.x ?? 0, y = style.y ?? 0;
    parts.push(`translate(${x}px, ${y}px)`);
  }
  if (style.scale !== void 0 && parts.push(`scale(${style.scale})`), style.scaleX !== void 0 && parts.push(`scaleX(${style.scaleX})`), style.scaleY !== void 0 && parts.push(`scaleY(${style.scaleY})`), style.rotate !== void 0) {
    const val = style.rotate, unit = typeof val == "string" && val.includes("deg") ? "" : "deg";
    parts.push(`rotate(${val}${unit})`);
  }
  return style.rotateX !== void 0 && parts.push(`rotateX(${style.rotateX}deg)`), style.rotateY !== void 0 && parts.push(`rotateY(${style.rotateY}deg)`), style.rotateZ !== void 0 && parts.push(`rotateZ(${style.rotateZ}deg)`), style.skewX !== void 0 && parts.push(`skewX(${style.skewX}deg)`), style.skewY !== void 0 && parts.push(`skewY(${style.skewY}deg)`), parts.join(" ");
}
__name(buildTransformString, "buildTransformString");
function applyStylesToNode(node, style) {
  if (!style) return;
  const transformStr = buildTransformString(style);
  transformStr && (node.style.transform = transformStr);
  for (const [key, value] of Object.entries(style)) TRANSFORM_KEYS.includes(key) || value !== void 0 && (key === "opacity" ? node.style.opacity = String(value) : key === "backgroundColor" ? node.style.backgroundColor = String(value) : key === "color" ? node.style.color = String(value) : node.style[key] = typeof value == "number" ? `${value}px` : String(value));
}
__name(applyStylesToNode, "applyStylesToNode");
function createAnimations(animations2) {
  const reactionListeners = /* @__PURE__ */ new WeakMap();
  return {
    animations: animations2,
    usePresence,
    ResetPresence,
    inputStyle: "css",
    outputStyle: "css",
    useAnimatedNumber(initial) {
      const [val, setVal] = React3.useState(initial), finishTimerRef = React3.useRef(null);
      return {
        getInstance() {
          return setVal;
        },
        getValue() {
          return val;
        },
        setValue(next, config2, onFinish) {
          if (setVal(next), finishTimerRef.current && (clearTimeout(finishTimerRef.current), finishTimerRef.current = null), onFinish) if (!config2 || config2.type === "direct" || config2.type === "timing" && config2.duration === 0) onFinish();
          else {
            const duration = config2.type === "timing" ? config2.duration : 300;
            finishTimerRef.current = setTimeout(onFinish, duration);
          }
          const listeners = reactionListeners.get(setVal);
          listeners && listeners.forEach((listener) => listener(next));
        },
        stop() {
          finishTimerRef.current && (clearTimeout(finishTimerRef.current), finishTimerRef.current = null);
        }
      };
    },
    useAnimatedNumberReaction({
      value
    }, onValue) {
      React3.useEffect(() => {
        const instance = value.getInstance();
        let queue = reactionListeners.get(instance);
        if (!queue) {
          const next = /* @__PURE__ */ new Set();
          reactionListeners.set(instance, next), queue = next;
        }
        return queue.add(onValue), () => {
          queue?.delete(onValue);
        };
      }, []);
    },
    useAnimatedNumberStyle(val, getStyle) {
      return getStyle(val.getValue());
    },
    // @ts-ignore - styleState is added by createComponent
    useAnimations: /* @__PURE__ */ __name(({
      props,
      presence,
      style,
      componentState,
      stateRef,
      styleState
    }) => {
      const isHydrating = componentState.unmounted === true, isEntering = !!componentState.unmounted, isExiting = presence?.[0] === false, sendExitComplete = presence?.[1], wasEnteringRef = React3.useRef(isEntering), justFinishedEntering = wasEnteringRef.current && !isEntering;
      React3.useEffect(() => {
        wasEnteringRef.current = isEntering;
      });
      const exitCycleIdRef = React3.useRef(0), exitCompletedRef = React3.useRef(false), wasExitingRef = React3.useRef(false), exitInterruptedRef = React3.useRef(false), justStartedExiting = isExiting && !wasExitingRef.current, justStoppedExiting = !isExiting && wasExitingRef.current;
      justStartedExiting && (exitCycleIdRef.current++, exitCompletedRef.current = false), justStoppedExiting && (exitCycleIdRef.current++, exitInterruptedRef.current = true), React3.useEffect(() => {
        wasExitingRef.current = isExiting;
      });
      const effectiveTransition = styleState?.effectiveTransition ?? props.transition, normalized = normalizeTransition(effectiveTransition), effectiveAnimationKey = getEffectiveAnimation(normalized, isExiting ? "exit" : isEntering || justFinishedEntering ? "enter" : "default"), defaultAnimation = effectiveAnimationKey ? animations2[effectiveAnimationKey] : null, animatedProperties = getAnimatedProperties(normalized), hasDefault = normalized.default !== null || normalized.enter !== null || normalized.exit !== null, hasPerPropertyConfigs = animatedProperties.length > 0;
      let keys;
      if (props.animateOnly ? keys = props.animateOnly : hasPerPropertyConfigs && !hasDefault ? keys = animatedProperties : hasPerPropertyConfigs && hasDefault ? keys = ["all", ...animatedProperties] : keys = ["all"], useIsomorphicLayoutEffect(() => {
        const host = stateRef.current.host;
        if (!sendExitComplete || !isExiting || !host) return;
        const node = host, cycleId = exitCycleIdRef.current, completeExit = /* @__PURE__ */ __name(() => {
          cycleId === exitCycleIdRef.current && (exitCompletedRef.current || (exitCompletedRef.current = true, sendExitComplete()));
        }, "completeExit");
        if (keys.length === 0) {
          completeExit();
          return;
        }
        let rafId;
        const wasInterrupted = exitInterruptedRef.current;
        let ignoreCancelEvents = wasInterrupted;
        const enterStyle = props.enterStyle, exitStyle = props.exitStyle, delayStr2 = normalized.delay ? ` ${normalized.delay}ms` : "", durationOverride2 = normalized.config?.duration, exitTransitionString = keys.map((key) => {
          const propAnimation = normalized.properties[key];
          let animationValue = null;
          return typeof propAnimation == "string" ? animationValue = animations2[propAnimation] : propAnimation && typeof propAnimation == "object" && propAnimation.type ? animationValue = animations2[propAnimation.type] : defaultAnimation && (animationValue = defaultAnimation), animationValue && durationOverride2 && (animationValue = applyDurationOverride(animationValue, durationOverride2)), animationValue ? `${key} ${animationValue}${delayStr2}` : null;
        }).filter(Boolean).join(", ");
        if (wasInterrupted) {
          if (exitInterruptedRef.current = false, node.style.transition = "none", exitStyle) {
            const resetStyle = {};
            for (const key of Object.keys(exitStyle)) key === "opacity" ? resetStyle[key] = 1 : TRANSFORM_KEYS.includes(key) ? resetStyle[key] = key === "scale" || key === "scaleX" || key === "scaleY" ? 1 : 0 : enterStyle?.[key] !== void 0 && (resetStyle[key] = enterStyle[key]);
            applyStylesToNode(node, resetStyle);
          } else node.style.opacity = "1", node.style.transform = "none";
          node.offsetHeight;
        } else if (exitStyle) {
          ignoreCancelEvents = true, node.style.transition = "none";
          const resetStyle = {};
          for (const key of Object.keys(exitStyle)) key === "opacity" ? resetStyle[key] = 1 : TRANSFORM_KEYS.includes(key) ? resetStyle[key] = key === "scale" || key === "scaleX" || key === "scaleY" ? 1 : 0 : enterStyle?.[key] !== void 0 && (resetStyle[key] = enterStyle[key]);
          applyStylesToNode(node, resetStyle), node.offsetHeight, rafId = requestAnimationFrame(() => {
            cycleId === exitCycleIdRef.current && (node.style.transition = exitTransitionString, node.offsetHeight, applyStylesToNode(node, exitStyle), ignoreCancelEvents = false);
          });
        }
        let maxDuration = defaultAnimation ? extractDuration(defaultAnimation) : 200;
        const animationConfigs = getAnimationConfigsForKeys(normalized, animations2, keys, defaultAnimation);
        for (const animationValue of animationConfigs.values()) if (animationValue) {
          const duration = extractDuration(animationValue);
          duration > maxDuration && (maxDuration = duration);
        }
        const delay = normalized.delay ?? 0, fallbackTimeout = maxDuration + delay, timeoutId = setTimeout(() => {
          completeExit();
        }, fallbackTimeout), transitioningProps = new Set(keys);
        let completedCount = 0;
        const onFinishAnimation = /* @__PURE__ */ __name((event) => {
          if (event.target !== node) return;
          const eventProp = event.propertyName;
          (transitioningProps.has(eventProp) || eventProp === "all") && (completedCount++, completedCount >= transitioningProps.size && (clearTimeout(timeoutId), completeExit()));
        }, "onFinishAnimation"), onCancelAnimation = /* @__PURE__ */ __name(() => {
          ignoreCancelEvents || (clearTimeout(timeoutId), completeExit());
        }, "onCancelAnimation");
        return node.addEventListener("transitionend", onFinishAnimation), node.addEventListener("transitioncancel", onCancelAnimation), wasInterrupted && (rafId = requestAnimationFrame(() => {
          cycleId === exitCycleIdRef.current && (node.style.transition = exitTransitionString, node.offsetHeight, applyStylesToNode(node, exitStyle), ignoreCancelEvents = false);
        })), () => {
          clearTimeout(timeoutId), rafId !== void 0 && cancelAnimationFrame(rafId), node.removeEventListener("transitionend", onFinishAnimation), node.removeEventListener("transitioncancel", onCancelAnimation), node.style.transition = "";
        };
      }, [sendExitComplete, isExiting, stateRef, keys, normalized, defaultAnimation, props.enterStyle, props.exitStyle]), isHydrating || !hasAnimation(normalized)) return null;
      Array.isArray(style.transform) && (style.transform = transformsToString(style.transform));
      const delayStr = normalized.delay ? ` ${normalized.delay}ms` : "", durationOverride = normalized.config?.duration;
      return style.transition = keys.map((key) => {
        const propAnimation = normalized.properties[key];
        let animationValue = null;
        return typeof propAnimation == "string" ? animationValue = animations2[propAnimation] : propAnimation && typeof propAnimation == "object" && propAnimation.type ? animationValue = animations2[propAnimation.type] : defaultAnimation && (animationValue = defaultAnimation), animationValue && durationOverride && (animationValue = applyDurationOverride(animationValue, durationOverride)), animationValue ? `${key} ${animationValue}${delayStr}` : null;
      }).filter(Boolean).join(", "), process.env.NODE_ENV === "development" && props.debug === "verbose" && console.info("CSS animation", {
        props,
        animations: animations2,
        normalized,
        defaultAnimation,
        style,
        isEntering,
        isExiting
      }), {
        style,
        className: isEntering ? "t_unmounted" : ""
      };
    }, "useAnimations")
  };
}
__name(createAnimations, "createAnimations");

// src/animations.ts
var animations = createAnimations({
  lazy: "ease-in 500ms",
  quick: "ease-in 100ms"
});

// src/fonts.ts
import { createFont } from "@hanzogui/core";
var fonts = {
  body: createFont({
    family: `Helvetica`,
    size: {
      2: 12,
      3: 14,
      4: 16,
      5: 18,
      7: 22,
      8: 26,
      9: 32,
      10: 38
    },
    letterSpacing: {},
    weight: {
      4: "400"
    },
    lineHeight: {
      2: 15,
      3: 17,
      4: 20,
      5: 24,
      7: 29,
      8: 33,
      9: 39,
      10: 46
    }
  }),
  heading: createFont({
    family: `Helvetica`,
    size: {
      2: 16,
      3: 20,
      4: 24,
      5: 28,
      6: 32,
      7: 40,
      8: 48,
      9: 56,
      10: 66
    },
    letterSpacing: {},
    lineHeight: {
      2: 1.5 * 16,
      3: 1.5 * 20,
      4: 1.5 * 24,
      5: 1.5 * 28,
      6: 1.5 * 32,
      7: 1.5 * 40,
      8: 1.5 * 48,
      9: 1.5 * 56,
      10: 1.5 * 66
    },
    transform: {
      5: "uppercase",
      6: "none"
    },
    weight: {
      4: "400",
      5: "700"
    }
  })
};

// src/media.ts
var media = {
  xs: { maxWidth: 660 },
  sm: { maxWidth: 800 },
  md: { maxWidth: 1020 },
  lg: { maxWidth: 1280 },
  xl: { maxWidth: 1420 },
  xxl: { maxWidth: 1600 },
  gtXs: { minWidth: 660 + 1 },
  gtSm: { minWidth: 800 + 1 },
  gtMd: { minWidth: 1020 + 1 },
  gtLg: { minWidth: 1280 + 1 },
  short: { maxHeight: 820 },
  tall: { minHeight: 820 },
  hoverNone: { hover: "none" },
  pointerCoarse: { pointer: "coarse" }
};

// ../../core/create-theme/dist/esm/isMinusZero.mjs
function isMinusZero(value) {
  return 1 / value === Number.NEGATIVE_INFINITY;
}
__name(isMinusZero, "isMinusZero");

// ../../core/create-theme/dist/esm/themeInfo.mjs
var THEME_INFO = /* @__PURE__ */ new Map();
var getThemeInfo = /* @__PURE__ */ __name((theme, name) => THEME_INFO.get(name || JSON.stringify(theme)), "getThemeInfo");
var setThemeInfo = /* @__PURE__ */ __name((theme, info) => {
  const next = {
    ...info,
    cache: /* @__PURE__ */ new Map()
  };
  THEME_INFO.set(info.name || JSON.stringify(theme), next), THEME_INFO.set(JSON.stringify(info.definition), next);
}, "setThemeInfo");

// ../../core/create-theme/dist/esm/createTheme.mjs
var identityCache = /* @__PURE__ */ new Map();
function createTheme(palette, definition, options, name, skipCache = false) {
  const cacheKey = skipCache ? "" : JSON.stringify([name, palette, definition, options]);
  if (!skipCache && identityCache.has(cacheKey)) return identityCache.get(cacheKey);
  const theme = {
    ...Object.fromEntries(Object.entries(definition).map(([key, offset]) => [key, getValue(palette, offset)])),
    ...options?.nonInheritedValues
  };
  return setThemeInfo(theme, {
    palette,
    definition,
    options,
    name
  }), cacheKey && identityCache.set(cacheKey, theme), theme;
}
__name(createTheme, "createTheme");
var getValue = /* @__PURE__ */ __name((palette, value) => {
  if (!palette) throw new Error("No palette!");
  if (typeof value == "string") return value;
  const max = palette.length - 1, next = (value === 0 ? !isMinusZero(value) : value >= 0) ? value : max + value, index = Math.min(Math.max(0, next), max);
  return palette[index];
}, "getValue");
function addChildren(themes2, getChildren) {
  const out = {
    ...themes2
  };
  for (const key in themes2) {
    const subThemes = getChildren(key, themes2[key]);
    for (const sKey in subThemes) out[`${key}_${sKey}`] = subThemes[sKey];
  }
  return out;
}
__name(addChildren, "addChildren");

// ../../core/create-theme/dist/esm/masks.mjs
var skipMask = {
  name: "skip-mask",
  mask: /* @__PURE__ */ __name((template, opts) => {
    const {
      skip
    } = opts;
    return Object.fromEntries(Object.entries(template).filter(([k]) => !skip || !(k in skip)).map(([k, v]) => [k, applyOverrides(k, v, opts)]));
  }, "mask")
};
function applyOverrides(key, value, opts) {
  let override, strategy = opts.overrideStrategy;
  const overrideSwap = opts.overrideSwap?.[key];
  if (typeof overrideSwap < "u") override = overrideSwap, strategy = "swap";
  else {
    const overrideShift = opts.overrideShift?.[key];
    if (typeof overrideShift < "u") override = overrideShift, strategy = "shift";
    else {
      const overrideDefault = opts.override?.[key];
      typeof overrideDefault < "u" && (override = overrideDefault, strategy = opts.overrideStrategy);
    }
  }
  return typeof override > "u" || typeof override == "string" ? value : strategy === "swap" ? override : value;
}
__name(applyOverrides, "applyOverrides");
var createShiftMask = /* @__PURE__ */ __name(({
  inverse
} = {}, defaultOptions) => ({
  name: "shift-mask",
  mask: /* @__PURE__ */ __name((template, opts) => {
    const {
      override,
      overrideStrategy = "shift",
      max: maxIn,
      palette,
      min = 0,
      strength = 1
    } = {
      ...defaultOptions,
      ...opts
    }, values = Object.entries(template), max = maxIn ?? (palette ? Object.values(palette).length - 1 : Number.POSITIVE_INFINITY), out = {};
    for (const [key, value] of values) {
      if (typeof value == "string") continue;
      if (typeof override?.[key] == "number") {
        const overrideVal = override[key];
        out[key] = overrideStrategy === "shift" ? value + overrideVal : overrideVal;
        continue;
      }
      if (typeof override?.[key] == "string") {
        out[key] = override[key];
        continue;
      }
      const isPositive = value === 0 ? !isMinusZero(value) : value >= 0, direction = isPositive ? 1 : -1, invert = inverse ? -1 : 1, next = value + strength * direction * invert, clamped = isPositive ? Math.max(min, Math.min(max, next)) : Math.min(-min, Math.max(-max, next));
      out[key] = clamped;
    }
    return skipMask.mask(out, opts);
  }, "mask")
}), "createShiftMask");
var createWeakenMask = /* @__PURE__ */ __name((defaultOptions) => ({
  name: "soften-mask",
  mask: createShiftMask({}, defaultOptions).mask
}), "createWeakenMask");
var createStrengthenMask = /* @__PURE__ */ __name((defaultOptions) => ({
  name: "strengthen-mask",
  mask: createShiftMask({
    inverse: true
  }, defaultOptions).mask
}), "createStrengthenMask");

// ../../core/create-theme/dist/esm/applyMask.mjs
function applyMask(theme, mask, options = {}, parentName, nextName) {
  const info = getThemeInfo(theme, parentName);
  if (!info) throw new Error(process.env.NODE_ENV !== "production" ? "No info found for theme, you must pass the theme created by createThemeFromPalette directly to extendTheme" : "\u274C Err2");
  const next = applyMaskStateless(info, mask, options, parentName);
  return setThemeInfo(next.theme, {
    definition: next.definition,
    palette: info.palette,
    name: nextName
  }), next.theme;
}
__name(applyMask, "applyMask");
function applyMaskStateless(info, mask, options = {}, parentName) {
  const skip = {
    ...options.skip
  };
  if (info.options?.nonInheritedValues) for (const key in info.options.nonInheritedValues) skip[key] = 1;
  const maskOptions = {
    parentName,
    palette: info.palette,
    ...options,
    skip
  }, template = mask.mask(info.definition, maskOptions), theme = createTheme(info.palette, template);
  return {
    ...info,
    cache: /* @__PURE__ */ new Map(),
    definition: template,
    theme
  };
}
__name(applyMaskStateless, "applyMaskStateless");

// src/tokens.ts
import { createTokens } from "@hanzogui/core";
var size = {
  0: 0,
  0.25: 2,
  0.5: 4,
  0.75: 8,
  1: 20,
  1.5: 24,
  2: 28,
  2.5: 32,
  3: 36,
  3.5: 40,
  4: 44,
  true: 44,
  4.5: 48,
  5: 52,
  5.5: 59,
  6: 64,
  6.5: 69,
  7: 74,
  7.6: 79,
  8: 84,
  8.5: 89,
  9: 94,
  9.5: 99,
  10: 104,
  11: 124,
  12: 144,
  13: 164,
  14: 184,
  15: 204,
  16: 224,
  17: 224,
  18: 244,
  19: 264,
  20: 284
};
var spaces = Object.entries(size).map(
  ([k, v]) => [k, Math.max(0, v <= 16 ? Math.round(v * 0.333) : Math.floor(v * 0.7 - 12))]
);
var spacesNegative = spaces.slice(1).map(([k, v]) => [`-${k}`, -v]);
var space = {
  ...Object.fromEntries(spaces),
  ...Object.fromEntries(spacesNegative)
};
var zIndex = {
  0: 0,
  1: 100,
  2: 200,
  3: 300,
  4: 400,
  5: 500
};
var radius = {
  0: 0,
  1: 3,
  2: 5,
  3: 7,
  4: 9,
  true: 9,
  5: 10,
  6: 16,
  7: 19,
  8: 22,
  9: 26,
  10: 34,
  11: 42,
  12: 50
};
var color = {
  darkTransparent: "rgba(10,10,10,0)",
  dark1: "#050505",
  dark2: "#151515",
  dark3: "#191919",
  dark4: "#232323",
  dark5: "#282828",
  dark6: "#323232",
  dark7: "#424242",
  dark8: "#494949",
  dark9: "#545454",
  dark10: "#626262",
  dark11: "#a5a5a5",
  dark12: "#fff",
  lightTransparent: "rgba(255,255,255,0)",
  light1: "#fff",
  light2: "#f9f9f9",
  light3: "hsl(0, 0%, 97.3%)",
  light4: "hsl(0, 0%, 95.1%)",
  light5: "hsl(0, 0%, 94.0%)",
  light6: "hsl(0, 0%, 92.0%)",
  light7: "hsl(0, 0%, 89.5%)",
  light8: "hsl(0, 0%, 81.0%)",
  light9: "hsl(0, 0%, 56.1%)",
  light10: "hsl(0, 0%, 50.3%)",
  light11: "hsl(0, 0%, 42.5%)",
  light12: "hsl(0, 0%, 9.0%)"
};
var tokens = createTokens({
  color,
  space,
  size,
  radius,
  zIndex
});

// src/themes.ts
var themes = (() => {
  const palettes = {
    light: [
      tokens.color.darkTransparent,
      tokens.color.light1,
      tokens.color.light2,
      tokens.color.light3,
      tokens.color.light4,
      tokens.color.light5,
      tokens.color.light6,
      tokens.color.light7,
      tokens.color.light8,
      tokens.color.light9,
      tokens.color.light10,
      tokens.color.light11,
      tokens.color.light12,
      tokens.color.lightTransparent
    ],
    dark: [
      tokens.color.lightTransparent,
      tokens.color.dark1,
      tokens.color.dark2,
      tokens.color.dark3,
      tokens.color.dark4,
      tokens.color.dark5,
      tokens.color.dark6,
      tokens.color.dark7,
      tokens.color.dark8,
      tokens.color.dark9,
      tokens.color.dark10,
      tokens.color.dark11,
      tokens.color.dark12,
      tokens.color.darkTransparent
    ]
  };
  const genericsTemplate = {
    background: 2,
    backgroundHover: 3,
    backgroundPress: 4,
    backgroundFocus: 2,
    color: -1,
    colorHover: -2,
    colorPress: -1,
    colorFocus: -2,
    borderColor: 4,
    borderColorHover: 5,
    borderColorPress: 3,
    borderColorFocus: 4,
    placeholderColor: -4
  };
  const colorStepsTemplate = {
    color1: 1,
    color2: 2,
    color3: 3,
    color4: 4,
    color5: 5,
    color6: 6,
    color7: 7,
    color8: 8,
    color9: 9,
    color10: 10,
    color11: 11,
    color12: 12
  };
  const shadowsTemplate = {
    shadowColor: 1,
    shadowColorHover: 1,
    shadowColorPress: 2,
    shadowColorFocus: 2
  };
  const template = {
    ...colorStepsTemplate,
    ...shadowsTemplate,
    ...genericsTemplate
  };
  const lightShadowColor = "rgba(0,0,0,0.02)";
  const lightShadowColorStrong = "rgba(0,0,0,0.066)";
  const darkShadowColor = "rgba(0,0,0,0.2)";
  const darkShadowColorStrong = "rgba(0,0,0,0.3)";
  const lightShadows = {
    shadowColor: lightShadowColorStrong,
    shadowColorHover: lightShadowColorStrong,
    shadowColorPress: lightShadowColor,
    shadowColorFocus: lightShadowColor
  };
  const darkShadows = {
    shadowColor: darkShadowColorStrong,
    shadowColorHover: darkShadowColorStrong,
    shadowColorPress: darkShadowColor,
    shadowColorFocus: darkShadowColor
  };
  const light = createTheme(palettes.light, template);
  const dark = createTheme(palettes.dark, template);
  const masks = {
    weaker: createWeakenMask(),
    stronger: createStrengthenMask()
  };
  function getComponentThemes(theme, inverse, isLight) {
    const componentMaskOptions = {
      // basically we only want the generics, avoids extra weight
      skip: {
        ...colorStepsTemplate,
        ...shadowsTemplate
      },
      // avoids the transparent ends
      max: palettes.light.length - 2,
      min: 1
    };
    const weaker1 = applyMask(theme, masks.weaker, componentMaskOptions);
    const base = applyMask(weaker1, masks.stronger, componentMaskOptions);
    const weaker2 = applyMask(weaker1, masks.weaker, componentMaskOptions);
    const stronger1 = applyMask(theme, masks.stronger, componentMaskOptions);
    const inverse1 = applyMask(inverse, masks.weaker, componentMaskOptions);
    const inverse2 = applyMask(inverse1, masks.weaker, componentMaskOptions);
    const overlayTheme = {
      background: isLight ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.9)"
    };
    return {
      ListItem: isLight ? stronger1 : base,
      Card: weaker1,
      Button: weaker2,
      Checkbox: weaker2,
      DrawerFrame: weaker1,
      SliderTrack: stronger1,
      SliderTrackActive: weaker2,
      SliderThumb: inverse1,
      Progress: weaker1,
      ProgressIndicator: inverse,
      Switch: weaker2,
      SwitchThumb: inverse2,
      TooltipArrow: weaker1,
      TooltipContent: weaker2,
      Input: stronger1,
      TextArea: stronger1,
      Tooltip: inverse1,
      SheetOverlay: overlayTheme,
      DialogOverlay: overlayTheme,
      ModalOverlay: overlayTheme
    };
  }
  __name(getComponentThemes, "getComponentThemes");
  const baseThemes = {
    light,
    dark
  };
  return addChildren(baseThemes, (name, theme) => {
    const isLight = name === "light";
    const inverseName = isLight ? "dark" : "light";
    const inverseTheme = baseThemes[inverseName];
    return getComponentThemes(theme, inverseTheme, isLight);
  });
})();

// src/gui.config.ts
var config = createGui({
  defaultFont: "body",
  animations,
  shouldAddPrefersColorThemes: true,
  shorthands,
  fonts,
  themes,
  tokens,
  media
});
var gui_config_default = config;
export {
  gui_config_default as default
};
