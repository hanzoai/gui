import { createRequire as __cr } from "module"; const require = __cr(import.meta.url);
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../core/animation-helpers/dist/esm/normalizeTransition.mjs
var SPRING_CONFIG_KEYS = /* @__PURE__ */ new Set(["stiffness", "damping", "mass", "tension", "friction", "velocity", "overshootClamping", "duration", "bounciness", "speed"]);
function isSpringConfigKey(key) {
  return SPRING_CONFIG_KEYS.has(key);
}
__name(isSpringConfigKey, "isSpringConfigKey");
function normalizeTransition(transition) {
  if (!transition) {
    return {
      default: null,
      enter: null,
      exit: null,
      delay: void 0,
      properties: {}
    };
  }
  if (typeof transition === "string") {
    return {
      default: transition,
      enter: null,
      exit: null,
      delay: void 0,
      properties: {}
    };
  }
  if (Array.isArray(transition)) {
    const [defaultAnimation, configObj] = transition;
    const properties = {};
    const springConfig = {};
    let delay;
    let enter = null;
    let exit = null;
    if (configObj && typeof configObj === "object") {
      for (const [key, value] of Object.entries(configObj)) {
        if (key === "delay" && typeof value === "number") {
          delay = value;
        } else if (key === "enter" && typeof value === "string") {
          enter = value;
        } else if (key === "exit" && typeof value === "string") {
          exit = value;
        } else if (isSpringConfigKey(key) && value !== void 0) {
          springConfig[key] = value;
        } else if (value !== void 0) {
          properties[key] = value;
        }
      }
    }
    return {
      default: defaultAnimation,
      enter,
      exit,
      delay,
      properties,
      config: Object.keys(springConfig).length > 0 ? springConfig : void 0
    };
  }
  if (typeof transition === "object") {
    const properties = {};
    const springConfig = {};
    let defaultAnimation = null;
    let enter = null;
    let exit = null;
    let delay;
    for (const [key, value] of Object.entries(transition)) {
      if (key === "default" && typeof value === "string") {
        defaultAnimation = value;
      } else if (key === "enter" && typeof value === "string") {
        enter = value;
      } else if (key === "exit" && typeof value === "string") {
        exit = value;
      } else if (key === "delay" && typeof value === "number") {
        delay = value;
      } else if (isSpringConfigKey(key) && value !== void 0) {
        springConfig[key] = value;
      } else if (value !== void 0) {
        properties[key] = value;
      }
    }
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
  if (state === "enter" && normalized.enter) {
    return normalized.enter;
  }
  if (state === "exit" && normalized.exit) {
    return normalized.exit;
  }
  return normalized.default;
}
__name(getEffectiveAnimation, "getEffectiveAnimation");
function getAnimationConfigsForKeys(normalized, animations2, keys, defaultAnimation) {
  const result = /* @__PURE__ */ new Map();
  for (const key of keys) {
    const propAnimation = normalized.properties[key];
    let animationValue = null;
    if (typeof propAnimation === "string") {
      animationValue = animations2[propAnimation] ?? null;
    } else if (propAnimation && typeof propAnimation === "object" && propAnimation.type) {
      animationValue = animations2[propAnimation.type] ?? null;
    }
    if (animationValue === null) {
      animationValue = defaultAnimation;
    }
    result.set(key, animationValue);
  }
  return result;
}
__name(getAnimationConfigsForKeys, "getAnimationConfigsForKeys");

// ../core/constants/dist/esm/constants.mjs
import { useEffect, useLayoutEffect } from "react";
var isWeb = true;
var isBrowser = typeof document !== "undefined";
var isServer = !isBrowser;
var isClient = isBrowser;
var useIsomorphicLayoutEffect = isServer ? useEffect : useLayoutEffect;
var isChrome = typeof navigator !== "undefined" && /Chrome/.test(navigator.userAgent || "");
var isWebTouchable = isClient && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
var isAndroid = process.env.TEST_NATIVE_PLATFORM === "android" || process.env.TEST_NATIVE_PLATFORM === "androidtv";
var isIos = process.env.TEST_NATIVE_PLATFORM === "ios" || process.env.TEST_NATIVE_PLATFORM === "tvos";
var isTV = process.env.TEST_NATIVE_PLATFORM === "androidtv" || process.env.TEST_NATIVE_PLATFORM === "tvos";

// ../core/use-presence/dist/esm/PresenceContext.mjs
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

// ../core/use-presence/dist/esm/usePresence.mjs
import * as React2 from "react";
function usePresence() {
  const context = React2.useContext(PresenceContext);
  if (!context) {
    return [true, null, context];
  }
  const {
    id,
    isPresent: isPresent2,
    onExitComplete,
    register
  } = context;
  React2.useEffect(() => register(id), []);
  const safeToRemove = /* @__PURE__ */ __name(() => onExitComplete?.(id), "safeToRemove");
  return !isPresent2 && onExitComplete ? [false, safeToRemove, context] : [true, void 0, context];
}
__name(usePresence, "usePresence");

// ../core/animations-css/dist/esm/createAnimations.mjs
import { transformsToString } from "@hanzogui/web";
import React3 from "react";
var EXTRACT_MS_REGEX = /(\d+(?:\.\d+)?)\s*ms/;
var EXTRACT_S_REGEX = /(\d+(?:\.\d+)?)\s*s/;
function extractDuration(animation) {
  const msMatch = animation.match(EXTRACT_MS_REGEX);
  if (msMatch) {
    return Number.parseInt(msMatch[1], 10);
  }
  const sMatch = animation.match(EXTRACT_S_REGEX);
  if (sMatch) {
    return Math.round(Number.parseFloat(sMatch[1]) * 1e3);
  }
  return 300;
}
__name(extractDuration, "extractDuration");
var MS_DURATION_REGEX = /(\d+(?:\.\d+)?)\s*ms/;
var S_DURATION_REGEX = /(\d+(?:\.\d+)?)\s*s(?!tiffness)/;
function applyDurationOverride(animation, durationMs) {
  const msReplaced = animation.replace(MS_DURATION_REGEX, `${durationMs}ms`);
  if (msReplaced !== animation) {
    return msReplaced;
  }
  const sReplaced = animation.replace(S_DURATION_REGEX, `${durationMs}ms`);
  if (sReplaced !== animation) {
    return sReplaced;
  }
  return `${durationMs}ms ${animation}`;
}
__name(applyDurationOverride, "applyDurationOverride");
var TRANSFORM_KEYS = ["x", "y", "scale", "scaleX", "scaleY", "rotate", "rotateX", "rotateY", "rotateZ", "skewX", "skewY"];
function buildTransformString(style) {
  if (!style) return "";
  const parts = [];
  if (style.x !== void 0 || style.y !== void 0) {
    const x = style.x ?? 0;
    const y = style.y ?? 0;
    parts.push(`translate(${x}px, ${y}px)`);
  }
  if (style.scale !== void 0) {
    parts.push(`scale(${style.scale})`);
  }
  if (style.scaleX !== void 0) {
    parts.push(`scaleX(${style.scaleX})`);
  }
  if (style.scaleY !== void 0) {
    parts.push(`scaleY(${style.scaleY})`);
  }
  if (style.rotate !== void 0) {
    const val = style.rotate;
    const unit = typeof val === "string" && val.includes("deg") ? "" : "deg";
    parts.push(`rotate(${val}${unit})`);
  }
  if (style.rotateX !== void 0) {
    parts.push(`rotateX(${style.rotateX}deg)`);
  }
  if (style.rotateY !== void 0) {
    parts.push(`rotateY(${style.rotateY}deg)`);
  }
  if (style.rotateZ !== void 0) {
    parts.push(`rotateZ(${style.rotateZ}deg)`);
  }
  if (style.skewX !== void 0) {
    parts.push(`skewX(${style.skewX}deg)`);
  }
  if (style.skewY !== void 0) {
    parts.push(`skewY(${style.skewY}deg)`);
  }
  return parts.join(" ");
}
__name(buildTransformString, "buildTransformString");
function applyStylesToNode(node, style) {
  if (!style) return;
  const transformStr = buildTransformString(style);
  if (transformStr) {
    node.style.transform = transformStr;
  }
  for (const [key, value] of Object.entries(style)) {
    if (TRANSFORM_KEYS.includes(key)) continue;
    if (value === void 0) continue;
    if (key === "opacity") {
      node.style.opacity = String(value);
    } else if (key === "backgroundColor") {
      node.style.backgroundColor = String(value);
    } else if (key === "color") {
      node.style.color = String(value);
    } else {
      node.style[key] = typeof value === "number" ? `${value}px` : String(value);
    }
  }
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
      const [val, setVal] = React3.useState(initial);
      const finishTimerRef = React3.useRef(null);
      return {
        getInstance() {
          return setVal;
        },
        getValue() {
          return val;
        },
        setValue(next, config2, onFinish) {
          setVal(next);
          if (finishTimerRef.current) {
            clearTimeout(finishTimerRef.current);
            finishTimerRef.current = null;
          }
          if (onFinish) {
            if (!config2 || config2.type === "direct" || config2.type === "timing" && config2.duration === 0) {
              onFinish();
            } else {
              const duration = config2.type === "timing" ? config2.duration : 300;
              finishTimerRef.current = setTimeout(onFinish, duration);
            }
          }
          const listeners = reactionListeners.get(setVal);
          if (listeners) {
            listeners.forEach((listener) => listener(next));
          }
        },
        stop() {
          if (finishTimerRef.current) {
            clearTimeout(finishTimerRef.current);
            finishTimerRef.current = null;
          }
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
          reactionListeners.set(instance, next);
          queue = next;
        }
        queue.add(onValue);
        return () => {
          queue?.delete(onValue);
        };
      }, []);
    },
    useAnimatedNumberStyle(val, getStyle) {
      return getStyle(val.getValue());
    },
    useAnimatedNumbersStyle(vals, getStyle) {
      return getStyle(...vals.map((v) => v.getValue()));
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
      const isHydrating = componentState.unmounted === true;
      const isEntering = !!componentState.unmounted;
      const isExiting = presence?.[0] === false;
      const sendExitComplete = presence?.[1];
      const wasEnteringRef = React3.useRef(isEntering);
      const justFinishedEntering = wasEnteringRef.current && !isEntering;
      React3.useEffect(() => {
        wasEnteringRef.current = isEntering;
      });
      const exitCycleIdRef = React3.useRef(0);
      const exitCompletedRef = React3.useRef(false);
      const wasExitingRef = React3.useRef(false);
      const exitInterruptedRef = React3.useRef(false);
      const justStartedExiting = isExiting && !wasExitingRef.current;
      const justStoppedExiting = !isExiting && wasExitingRef.current;
      if (justStartedExiting) {
        exitCycleIdRef.current++;
        exitCompletedRef.current = false;
      }
      if (justStoppedExiting) {
        exitCycleIdRef.current++;
        exitInterruptedRef.current = true;
      }
      React3.useEffect(() => {
        wasExitingRef.current = isExiting;
      });
      const effectiveTransition = styleState?.effectiveTransition ?? props.transition;
      const normalized = normalizeTransition(effectiveTransition);
      const animationState = isExiting ? "exit" : isEntering || justFinishedEntering ? "enter" : "default";
      const effectiveAnimationKey = getEffectiveAnimation(normalized, animationState);
      const defaultAnimation = effectiveAnimationKey ? animations2[effectiveAnimationKey] : null;
      const animatedProperties = getAnimatedProperties(normalized);
      const hasDefault = normalized.default !== null || normalized.enter !== null || normalized.exit !== null;
      const hasPerPropertyConfigs = animatedProperties.length > 0;
      let keys;
      if (props.animateOnly) {
        keys = props.animateOnly;
      } else if (hasPerPropertyConfigs && !hasDefault) {
        keys = animatedProperties;
      } else if (hasPerPropertyConfigs && hasDefault) {
        keys = ["all", ...animatedProperties];
      } else {
        keys = ["all"];
      }
      useIsomorphicLayoutEffect(() => {
        const host = stateRef.current.host;
        if (!sendExitComplete || !isExiting || !host) return;
        const node = host;
        const cycleId = exitCycleIdRef.current;
        const completeExit = /* @__PURE__ */ __name(() => {
          if (cycleId !== exitCycleIdRef.current) return;
          if (exitCompletedRef.current) return;
          exitCompletedRef.current = true;
          sendExitComplete();
        }, "completeExit");
        if (keys.length === 0) {
          completeExit();
          return;
        }
        let rafId;
        const wasInterrupted = exitInterruptedRef.current;
        let ignoreCancelEvents = wasInterrupted;
        const enterStyle = props.enterStyle;
        const exitStyle = props.exitStyle;
        const delayStr2 = normalized.delay ? ` ${normalized.delay}ms` : "";
        const durationOverride2 = normalized.config?.duration;
        const exitTransitionString = keys.map((key) => {
          const propAnimation = normalized.properties[key];
          let animationValue = null;
          if (typeof propAnimation === "string") {
            animationValue = animations2[propAnimation];
          } else if (propAnimation && typeof propAnimation === "object" && propAnimation.type) {
            animationValue = animations2[propAnimation.type];
          } else if (defaultAnimation) {
            animationValue = defaultAnimation;
          }
          if (animationValue && durationOverride2) {
            animationValue = applyDurationOverride(animationValue, durationOverride2);
          }
          return animationValue ? `${key} ${animationValue}${delayStr2}` : null;
        }).filter(Boolean).join(", ");
        if (wasInterrupted) {
          exitInterruptedRef.current = false;
          node.style.transition = "none";
          if (exitStyle) {
            const resetStyle = {};
            for (const key of Object.keys(exitStyle)) {
              if (key === "opacity") {
                resetStyle[key] = 1;
              } else if (TRANSFORM_KEYS.includes(key)) {
                resetStyle[key] = key === "scale" || key === "scaleX" || key === "scaleY" ? 1 : 0;
              } else if (enterStyle?.[key] !== void 0) {
                resetStyle[key] = enterStyle[key];
              }
            }
            applyStylesToNode(node, resetStyle);
          } else {
            node.style.opacity = "1";
            node.style.transform = "none";
          }
          void node.offsetHeight;
        } else if (exitStyle) {
          ignoreCancelEvents = true;
          node.style.transition = "none";
          const resetStyle = {};
          for (const key of Object.keys(exitStyle)) {
            if (key === "opacity") {
              resetStyle[key] = 1;
            } else if (TRANSFORM_KEYS.includes(key)) {
              resetStyle[key] = key === "scale" || key === "scaleX" || key === "scaleY" ? 1 : 0;
            } else if (enterStyle?.[key] !== void 0) {
              resetStyle[key] = enterStyle[key];
            }
          }
          applyStylesToNode(node, resetStyle);
          void node.offsetHeight;
          rafId = requestAnimationFrame(() => {
            if (cycleId !== exitCycleIdRef.current) return;
            node.style.transition = exitTransitionString;
            void node.offsetHeight;
            applyStylesToNode(node, exitStyle);
            ignoreCancelEvents = false;
          });
        }
        let maxDuration = defaultAnimation ? extractDuration(defaultAnimation) : 200;
        const animationConfigs = getAnimationConfigsForKeys(normalized, animations2, keys, defaultAnimation);
        for (const animationValue of animationConfigs.values()) {
          if (animationValue) {
            const duration = extractDuration(animationValue);
            if (duration > maxDuration) {
              maxDuration = duration;
            }
          }
        }
        const delay = normalized.delay ?? 0;
        const fallbackTimeout = maxDuration + delay;
        const timeoutId = setTimeout(() => {
          completeExit();
        }, fallbackTimeout);
        const transitioningProps = new Set(keys);
        let completedCount = 0;
        const onFinishAnimation = /* @__PURE__ */ __name((event) => {
          if (event.target !== node) return;
          const eventProp = event.propertyName;
          if (transitioningProps.has(eventProp) || eventProp === "all") {
            completedCount++;
            if (completedCount >= transitioningProps.size) {
              clearTimeout(timeoutId);
              completeExit();
            }
          }
        }, "onFinishAnimation");
        const onCancelAnimation = /* @__PURE__ */ __name(() => {
          if (ignoreCancelEvents) return;
          clearTimeout(timeoutId);
          completeExit();
        }, "onCancelAnimation");
        node.addEventListener("transitionend", onFinishAnimation);
        node.addEventListener("transitioncancel", onCancelAnimation);
        if (wasInterrupted) {
          rafId = requestAnimationFrame(() => {
            if (cycleId !== exitCycleIdRef.current) return;
            node.style.transition = exitTransitionString;
            void node.offsetHeight;
            applyStylesToNode(node, exitStyle);
            ignoreCancelEvents = false;
          });
        }
        return () => {
          clearTimeout(timeoutId);
          if (rafId !== void 0) cancelAnimationFrame(rafId);
          node.removeEventListener("transitionend", onFinishAnimation);
          node.removeEventListener("transitioncancel", onCancelAnimation);
          node.style.transition = "";
        };
      }, [sendExitComplete, isExiting, stateRef, keys, normalized, defaultAnimation, props.enterStyle, props.exitStyle]);
      if (isHydrating) {
        return null;
      }
      if (!hasAnimation(normalized)) {
        return null;
      }
      if (Array.isArray(style.transform)) {
        style.transform = transformsToString(style.transform);
      }
      const delayStr = normalized.delay ? ` ${normalized.delay}ms` : "";
      const durationOverride = normalized.config?.duration;
      style.transition = keys.map((key) => {
        const propAnimation = normalized.properties[key];
        let animationValue = null;
        if (typeof propAnimation === "string") {
          animationValue = animations2[propAnimation];
        } else if (propAnimation && typeof propAnimation === "object" && propAnimation.type) {
          animationValue = animations2[propAnimation.type];
        } else if (defaultAnimation) {
          animationValue = defaultAnimation;
        }
        if (animationValue && durationOverride) {
          animationValue = applyDurationOverride(animationValue, durationOverride);
        }
        return animationValue ? `${key} ${animationValue}${delayStr}` : null;
      }).filter(Boolean).join(", ");
      if (process.env.NODE_ENV === "development" && props["debug"] === "verbose") {
        console.info("CSS animation", {
          props,
          animations: animations2,
          normalized,
          defaultAnimation,
          style,
          isEntering,
          isExiting
        });
      }
      return {
        style,
        className: isEntering ? "t_unmounted" : ""
      };
    }, "useAnimations")
  };
}
__name(createAnimations, "createAnimations");

// ../core/config/dist/esm/v5-css.mjs
var easeOut = "cubic-bezier(0.25, 0.1, 0.25, 1)";
var bouncy = "cubic-bezier(0.175, 0.885, 0.32, 1.275)";
var animationsCSS = createAnimations({
  "0ms": "0ms linear",
  "50ms": "50ms linear",
  "75ms": "75ms linear",
  "100ms": "100ms ease-out",
  "200ms": "200ms ease-out",
  "250ms": "250ms ease-out",
  "300ms": "300ms ease-out",
  "400ms": "400ms ease-out",
  "500ms": "500ms ease-out",
  superBouncy: `300ms cubic-bezier(0.175, 0.885, 0.32, 1.5)`,
  bouncy: `350ms ${bouncy}`,
  superLazy: `600ms ${easeOut}`,
  lazy: `500ms ${easeOut}`,
  medium: `300ms ${easeOut}`,
  slowest: `800ms ${easeOut}`,
  slow: `450ms ${easeOut}`,
  quick: `150ms ${easeOut}`,
  quickLessBouncy: `180ms ${easeOut}`,
  quicker: `120ms ${easeOut}`,
  quickerLessBouncy: `100ms ${easeOut}`,
  quickest: `80ms ${easeOut}`,
  quickestLessBouncy: `60ms ${easeOut}`
});

// ../core/animations-motion/dist/esm/createAnimations.mjs
import { fixStyles, getConfig, getSplitStyles, hooks, styleToCSS, Text, useComposedRefs, useIsomorphicLayoutEffect as useIsomorphicLayoutEffect2, useThemeWithState, View } from "@hanzogui/web";
import { useAnimate, useMotionValue, useMotionValueEvent } from "motion/react";
import React4, { forwardRef, useEffect as useEffect3, useLayoutEffect as useLayoutEffect2, useMemo, useRef, useState } from "react";
import { jsx as jsx2 } from "react/jsx-runtime";
var isServer2 = typeof window === "undefined";
function useAnimateSSRSafe() {
  if (isServer2) {
    return [useRef(null), () => {
    }];
  }
  return useAnimate();
}
__name(useAnimateSSRSafe, "useAnimateSSRSafe");
var MotionValueStrategy = /* @__PURE__ */ new WeakMap();
var PendingMotionOnFinish = /* @__PURE__ */ new WeakMap();
function settlePendingMotionOnFinish(mv, controls) {
  const onFinish = PendingMotionOnFinish.get(mv);
  if (!onFinish) return;
  PendingMotionOnFinish.delete(mv);
  controls.then(() => onFinish()).catch(() => onFinish());
}
__name(settlePendingMotionOnFinish, "settlePendingMotionOnFinish");
function createAnimations2(animations2) {
  let isHydratingGlobal;
  const hydratingComponents = /* @__PURE__ */ new Set();
  return {
    View: MotionView,
    Text: MotionText,
    isReactNative: false,
    inputStyle: "css",
    outputStyle: "inline",
    avoidReRenders: true,
    animations: animations2,
    usePresence,
    ResetPresence,
    onMount() {
      isHydratingGlobal = false;
      hydratingComponents.forEach((cb) => cb());
    },
    useAnimations: /* @__PURE__ */ __name((animationProps) => {
      if (isHydratingGlobal === void 0 && !getConfig().settings.disableSSR) {
        isHydratingGlobal = true;
      }
      const {
        props,
        style,
        componentState,
        stateRef,
        useStyleEmitter,
        presence
      } = animationProps;
      const animationKey = Array.isArray(props.transition) ? props.transition[0] : props.transition;
      const isComponentHydrating = componentState.unmounted === true;
      const isMounting = componentState.unmounted === "should-enter";
      const isEntering = !!componentState.unmounted;
      const isExiting = presence?.[0] === false;
      const sendExitComplete = presence?.[1];
      const refs = useRef(null);
      if (!refs.current) {
        refs.current = {
          isFirstRender: true,
          lastDoAnimate: null,
          lastDontAnimate: null,
          controls: null,
          lastAnimateAt: 0,
          disposed: false,
          wasExiting: false,
          isExiting: false,
          sendExitComplete: void 0,
          animationState: "default",
          frozenExitTarget: null,
          exitCompleteScheduled: false,
          wasEntering: false
        };
      }
      const justFinishedEntering = refs.current.wasEntering && !isEntering;
      useEffect3(() => {
        refs.current.wasEntering = isEntering;
      });
      const animationState = isExiting ? "exit" : isMounting || justFinishedEntering ? "enter" : "default";
      const disableAnimation = isComponentHydrating || isMounting || !animationKey;
      const [scope, animate] = useAnimateSSRSafe();
      refs.current.isExiting = isExiting;
      refs.current.sendExitComplete = sendExitComplete;
      refs.current.animationState = animationState;
      const justStartedExiting = isExiting && !refs.current.wasExiting;
      const justStoppedExiting = !isExiting && refs.current.wasExiting;
      if (justStartedExiting || justStoppedExiting) {
        refs.current.frozenExitTarget = null;
        refs.current.exitCompleteScheduled = false;
      }
      useEffect3(() => {
        refs.current.wasExiting = isExiting;
      });
      const {
        dontAnimate = {},
        doAnimate,
        animationOptions
      } = getMotionAnimatedProps(props, style, disableAnimation, animationState);
      const [firstRenderStyle] = useState(style);
      if (refs.current.isFirstRender) {
        refs.current.lastDontAnimate = firstRenderStyle;
      }
      const [isHydrating, setIsHydrating] = useState(isHydratingGlobal);
      useLayoutEffect2(() => {
        if (isHydratingGlobal) {
          hydratingComponents.add(() => {
            setIsHydrating(false);
          });
        }
        return () => {
          refs.current.disposed = true;
        };
      }, []);
      const flushAnimation = /* @__PURE__ */ __name(({
        doAnimate: doAnimateRaw = {},
        animationOptions: passedOptions = {},
        dontAnimate: dontAnimate2
      }) => {
        let startedControls = null;
        const isCurrentlyExiting = refs.current.isExiting;
        const currentSendExitComplete = refs.current.sendExitComplete;
        let doAnimate2 = doAnimateRaw;
        if (isCurrentlyExiting && refs.current.frozenExitTarget) {
          doAnimate2 = refs.current.frozenExitTarget;
        }
        const animationOptions2 = isCurrentlyExiting && currentSendExitComplete ? getAnimationOptions(props.transition ?? null, "exit") : passedOptions;
        try {
          const node = stateRef.current.host;
          if (refs.current.isFirstRender) {
            refs.current.lastDontAnimate = null;
            refs.current.lastDoAnimate = null;
          }
          if (process.env.NODE_ENV === "development") {
            if (props["debug"] && props["debug"] !== "profile") {
              console.groupCollapsed(`[motion] animate (${JSON.stringify(getDiff(refs.current.lastDoAnimate, doAnimate2), null, 2)})`);
              console.info({
                props,
                componentState,
                doAnimate: doAnimate2,
                dontAnimate: dontAnimate2,
                animationOptions: animationOptions2,
                animationProps,
                lastDoAnimate: {
                  ...refs.current.lastDoAnimate
                },
                lastDontAnimate: {
                  ...refs.current.lastDontAnimate
                },
                isExiting,
                style,
                node
              });
              console.groupCollapsed(`trace >`);
              console.trace();
              console.groupEnd();
              console.groupEnd();
            }
          }
          if (!(node instanceof HTMLElement)) {
            return;
          }
          const prevDont = refs.current.lastDontAnimate;
          if (dontAnimate2) {
            if (prevDont) {
              removeRemovedStyles(prevDont, dontAnimate2, node, doAnimate2);
              const changed = getDiff(prevDont, dontAnimate2);
              if (changed) {
                Object.assign(node.style, changed);
              }
            } else {
              Object.assign(node.style, dontAnimate2);
            }
          }
          if (doAnimate2) {
            if (prevDont) {
              for (const key in prevDont) {
                if (key in doAnimate2) {
                  node.style[key] = prevDont[key];
                  if (refs.current.lastDoAnimate) {
                    refs.current.lastDoAnimate[key] = prevDont[key];
                  }
                }
              }
            }
            const lastAnimated = refs.current.lastDoAnimate;
            if (lastAnimated) {
              removeRemovedStyles(lastAnimated, doAnimate2, node, dontAnimate2);
            }
            const diff = getDiff(refs.current.lastDoAnimate, doAnimate2);
            if (diff) {
              if (isCurrentlyExiting && !refs.current.frozenExitTarget) {
                refs.current.frozenExitTarget = {
                  ...doAnimate2
                };
              }
              const isPopperPosition = node.hasAttribute("data-popper-animate-position");
              let midFlightValues = null;
              if (refs.current.controls) {
                try {
                  const computed = getComputedStyle(node);
                  midFlightValues = {};
                  for (const key in diff) {
                    const val = computed[key];
                    if (val !== void 0 && val !== "") {
                      midFlightValues[key] = val;
                    }
                  }
                } catch {
                }
                if (isCurrentlyExiting) {
                  refs.current.controls.stop();
                }
                if (midFlightValues) {
                  for (const key in midFlightValues) {
                    ;
                    node.style[key] = midFlightValues[key];
                  }
                }
                if (isPopperPosition) {
                  const anims = node.getAnimations();
                  for (const anim of anims) {
                    anim.cancel();
                  }
                }
              }
              const fixedDiff = fixTransparentColors(diff, refs.current.lastDoAnimate, doAnimate2);
              if (midFlightValues?.transform && fixedDiff.transform) {
                fixedDiff.transform = [midFlightValues.transform, fixedDiff.transform];
              }
              startedControls = animate(scope.current, fixedDiff, animationOptions2);
              refs.current.controls = startedControls;
              refs.current.lastAnimateAt = Date.now();
            }
          }
          refs.current.lastDontAnimate = dontAnimate2 ? {
            ...dontAnimate2
          } : {};
          refs.current.lastDoAnimate = doAnimate2 ? {
            ...doAnimate2
          } : {};
        } finally {
          if (isCurrentlyExiting && currentSendExitComplete) {
            if (startedControls) {
              refs.current.exitCompleteScheduled = true;
              startedControls.finished.then(() => {
                if (refs.current.isExiting) {
                  currentSendExitComplete();
                }
              }).catch(() => {
                if (refs.current.isExiting) {
                  currentSendExitComplete();
                }
              });
            } else if (!refs.current.exitCompleteScheduled) {
              currentSendExitComplete();
            }
          }
        }
      }, "flushAnimation");
      useStyleEmitter?.((nextStyle, effectiveTransition) => {
        const animationProps2 = getMotionAnimatedProps(props, nextStyle, disableAnimation, refs.current.animationState, effectiveTransition);
        flushAnimation(animationProps2);
      });
      useIsomorphicLayoutEffect2(() => {
        if (refs.current.isFirstRender) {
          refs.current.isFirstRender = false;
          if (isHydrating) {
            if (doAnimate && Object.keys(doAnimate).length > 0) {
              refs.current.lastDoAnimate = {
                ...doAnimate
              };
            } else {
              refs.current.lastDoAnimate = dontAnimate ? {
                ...dontAnimate
              } : {};
            }
            refs.current.lastDontAnimate = dontAnimate ? {
              ...dontAnimate
            } : {};
            refs.current.lastAnimateAt = Date.now();
            return;
          }
          refs.current.lastDontAnimate = dontAnimate ? {
            ...dontAnimate
          } : {};
          refs.current.lastDoAnimate = doAnimate ? {
            ...doAnimate
          } : {};
          return;
        }
        flushAnimation({
          doAnimate,
          dontAnimate,
          animationOptions
        });
      }, [style, isExiting, disableAnimation]);
      if (process.env.NODE_ENV === "development") {
        if (props["debug"] && props["debug"] !== "profile") {
          console.groupCollapsed(`[motion] render`);
          console.info({
            style,
            doAnimate,
            dontAnimate,
            scope,
            animationOptions,
            isExiting,
            isFirstRender: refs.current.isFirstRender,
            animationProps
          });
          console.groupEnd();
        }
      }
      return {
        style: firstRenderStyle,
        ref: scope,
        render: "div"
      };
    }, "useAnimations"),
    useAnimatedNumber(initial) {
      const motionValue = useMotionValue(initial);
      return React4.useMemo(() => ({
        getInstance() {
          return motionValue;
        },
        getValue() {
          return motionValue.get();
        },
        setValue(next, config2 = {
          type: "spring"
        }, onFinish) {
          if (config2.type === "direct") {
            MotionValueStrategy.set(motionValue, {
              type: "direct"
            });
            motionValue.set(next);
            onFinish?.();
            return;
          }
          MotionValueStrategy.set(motionValue, config2);
          if (onFinish) {
            const prior = PendingMotionOnFinish.get(motionValue);
            if (prior) {
              PendingMotionOnFinish.delete(motionValue);
              prior();
            }
            PendingMotionOnFinish.set(motionValue, onFinish);
          }
          motionValue.set(next);
        },
        stop() {
          motionValue.stop();
        }
      }), [motionValue]);
    },
    useAnimatedNumberReaction({
      value
    }, onValue) {
      const instance = value.getInstance();
      useMotionValueEvent(instance, "change", onValue);
    },
    useAnimatedNumberStyle(val, getStyleProp) {
      const motionValue = val.getInstance();
      const getStyleRef = useRef(getStyleProp);
      getStyleRef.current = getStyleProp;
      return useMemo(() => {
        return {
          getStyle: /* @__PURE__ */ __name((cur) => {
            return getStyleRef.current(cur);
          }, "getStyle"),
          motionValue
        };
      }, []);
    },
    useAnimatedNumbersStyle(vals, getStyleProp) {
      const motionValues = vals.map((v) => v.getInstance());
      const getStyleRef = useRef(getStyleProp);
      getStyleRef.current = getStyleProp;
      return useMemo(() => {
        return {
          getStyle: /* @__PURE__ */ __name((...currentValues) => getStyleRef.current(...currentValues), "getStyle"),
          motionValues
        };
      }, []);
    }
  };
  function getMotionAnimatedProps(props, style, disable, animationState = "default", transitionOverride) {
    if (disable) {
      return {
        dontAnimate: style
      };
    }
    const animationOptions = getAnimationOptions(transitionOverride ?? props.transition ?? null, animationState);
    let dontAnimate;
    let doAnimate;
    const animateOnly = props.animateOnly;
    for (const key in style) {
      const value = style[key];
      if (disableAnimationProps.has(key) || animateOnly && !animateOnly.includes(key)) {
        dontAnimate ||= {};
        dontAnimate[key] = value;
      } else {
        doAnimate ||= {};
        doAnimate[key] = value;
      }
    }
    return {
      dontAnimate,
      doAnimate,
      animationOptions
    };
  }
  __name(getMotionAnimatedProps, "getMotionAnimatedProps");
  function getAnimationOptions(transitionProp, animationState = "default") {
    const normalized = normalizeTransition(transitionProp);
    let effectiveKey = getEffectiveAnimation(normalized, animationState);
    if (!effectiveKey && animationState === "default") {
      effectiveKey = normalized.enter || normalized.exit || null;
    }
    const globalConfigOverride = normalized.config ? {
      ...normalized.config
    } : void 0;
    if (!effectiveKey && Object.keys(normalized.properties).length === 0 && !globalConfigOverride) {
      return {};
    }
    const defaultConfig2 = effectiveKey ? withInferredType(animations2[effectiveKey]) : null;
    const delay = normalized.delay;
    const result = {};
    if (defaultConfig2) {
      Object.assign(result, defaultConfig2);
    }
    if (globalConfigOverride) {
      Object.assign(result, globalConfigOverride);
      if (result.type === void 0 && result.duration !== void 0 && result.damping === void 0 && result.stiffness === void 0 && result.mass === void 0) {
        result.type = "tween";
      }
    }
    if (delay) {
      result.delay = delay;
    }
    if (defaultConfig2 || globalConfigOverride || delay) {
      result.default = {
        ...defaultConfig2,
        ...globalConfigOverride,
        ...delay ? {
          delay
        } : null
      };
    }
    for (const [propName, animationNameOrConfig] of Object.entries(normalized.properties)) {
      if (typeof animationNameOrConfig === "string") {
        result[propName] = withInferredType(animations2[animationNameOrConfig]);
      } else if (animationNameOrConfig && typeof animationNameOrConfig === "object") {
        const baseConfig = animationNameOrConfig.type ? withInferredType(animations2[animationNameOrConfig.type]) : defaultConfig2;
        result[propName] = {
          ...baseConfig,
          ...animationNameOrConfig
        };
      }
    }
    convertMsToS(result);
    convertMsToS(result.default);
    for (const key in result) {
      if (key !== "default" && typeof result[key] === "object") {
        convertMsToS(result[key]);
      }
    }
    return result;
  }
  __name(getAnimationOptions, "getAnimationOptions");
}
__name(createAnimations2, "createAnimations");
function withInferredType(config2) {
  if (!config2) {
    return {
      type: "spring"
    };
  }
  const isTimingBased = config2.duration !== void 0 && config2.damping === void 0 && config2.stiffness === void 0 && config2.mass === void 0;
  return {
    type: isTimingBased ? "tween" : "spring",
    ...config2
  };
}
__name(withInferredType, "withInferredType");
function convertMsToS(config2) {
  if (!config2) return;
  if (typeof config2.delay === "number") config2.delay = config2.delay / 1e3;
  if (typeof config2.duration === "number") {
    const isTimingBased = config2.type === "tween" || config2.type === void 0 && config2.damping === void 0 && config2.stiffness === void 0 && config2.mass === void 0;
    if (isTimingBased) {
      config2.duration = config2.duration / 1e3;
    }
  }
}
__name(convertMsToS, "convertMsToS");
function removeRemovedStyles(prev, next, node, dontClearIfIn) {
  for (const key in prev) {
    if (!(key in next)) {
      if (dontClearIfIn && key in dontClearIfIn) {
        continue;
      }
      node.style[key] = "";
    }
  }
}
__name(removeRemovedStyles, "removeRemovedStyles");
var disableAnimationProps = /* @__PURE__ */ new Set(["alignContent", "alignItems", "boxSizing", "contain", "containerType", "display", "flexBasis", "flexDirection", "fontFamily", "justifyContent", "overflow", "overflowX", "overflowY", "pointerEvents", "position", "textWrap", "userSelect"]);
var MotionView = createMotionView("div");
var MotionText = createMotionView("span");
function createMotionView(defaultTag) {
  const isText = defaultTag === "span";
  const Component = forwardRef((propsIn, ref) => {
    const {
      forwardedRef,
      animation,
      render = defaultTag,
      style,
      ...propsRest
    } = propsIn;
    const [scope, animate] = useAnimateSSRSafe();
    const hostRef = useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref, hostRef, scope);
    const stateRef = useRef(null);
    if (!stateRef.current) {
      stateRef.current = {
        get host() {
          return hostRef.current;
        }
      };
    }
    const [_, state] = useThemeWithState({});
    const styles = Array.isArray(style) ? style : [style];
    const [animatedStyle, nonAnimatedStyles] = (() => {
      let animatedStyle2;
      const nonAnimatedStyles2 = [];
      for (const style2 of styles) {
        if (style2.getStyle) {
          animatedStyle2 = style2;
        } else {
          nonAnimatedStyles2.push(style2);
        }
      }
      return [animatedStyle2, nonAnimatedStyles2];
    })();
    function getProps(props2) {
      const out = getSplitStyles(props2, isText ? Text.staticConfig : View.staticConfig, state?.theme, state?.name, {
        unmounted: false
      }, {
        isAnimated: false,
        noClass: true,
        resolveValues: "auto"
      });
      if (!out) {
        return {};
      }
      if (out.viewProps.style) {
        fixStyles(out.viewProps.style);
        styleToCSS(out.viewProps.style);
      }
      return out.viewProps;
    }
    __name(getProps, "getProps");
    const props = getProps({
      ...propsRest,
      style: nonAnimatedStyles
    });
    const Element = render || "div";
    const transformedProps = hooks.usePropsTransform?.(render, props, stateRef, false);
    useEffect3(() => {
      if (!animatedStyle) return;
      if (animatedStyle.motionValues) {
        const mvs = animatedStyle.motionValues;
        const unsubs = mvs.map((mv) => mv.on("change", () => {
          const currentValues = mvs.map((v) => v.get());
          const nextStyle = animatedStyle.getStyle(...currentValues);
          const animationConfig = MotionValueStrategy.get(mv);
          const node = hostRef.current;
          const webStyle = getProps({
            style: nextStyle
          }).style;
          if (webStyle && node instanceof HTMLElement) {
            const motionAnimationConfig = animationConfig?.type === "timing" ? {
              type: "tween",
              duration: (animationConfig?.duration || 0) / 1e3
            } : animationConfig?.type === "direct" ? {
              type: "tween",
              duration: 0
            } : {
              type: "spring",
              ...animationConfig
            };
            const controls = animate(node, webStyle, motionAnimationConfig);
            settlePendingMotionOnFinish(mv, controls);
          }
        }));
        return () => unsubs.forEach((fn) => fn());
      }
      if (!animatedStyle.motionValue) return;
      return animatedStyle.motionValue.on("change", (value) => {
        const nextStyle = animatedStyle.getStyle(value);
        const animationConfig = MotionValueStrategy.get(animatedStyle.motionValue);
        const node = hostRef.current;
        const webStyle = getProps({
          style: nextStyle
        }).style;
        if (webStyle && node instanceof HTMLElement) {
          const motionAnimationConfig = animationConfig?.type === "timing" ? {
            type: "tween",
            duration: (animationConfig?.duration || 0) / 1e3
          } : animationConfig?.type === "direct" ? {
            type: "tween",
            duration: 0
          } : {
            type: "spring",
            ...animationConfig
          };
          const controls = animate(node, webStyle, motionAnimationConfig);
          settlePendingMotionOnFinish(animatedStyle.motionValue, controls);
        }
      });
    }, [animatedStyle]);
    return /* @__PURE__ */ jsx2(Element, {
      ...transformedProps,
      ref: composedRefs
    });
  });
  Component["acceptRenderProp"] = true;
  return Component;
}
__name(createMotionView, "createMotionView");
function getDiff(previous, next) {
  if (!previous) {
    return next;
  }
  let diff = null;
  for (const key in next) {
    if (next[key] !== previous[key]) {
      diff ||= {};
      diff[key] = next[key];
    }
  }
  return diff;
}
__name(getDiff, "getDiff");
function fixTransparentColors(diff, previous, next) {
  let result = diff;
  for (const key in diff) {
    if (diff[key] === "transparent") {
      let fixed = "rgba(0, 0, 0, 0)";
      const candidates = [previous?.[key], next?.[key]];
      for (const candidate of candidates) {
        if (typeof candidate === "string" && candidate !== "transparent") {
          const rgbaMatch = candidate.match(/^rgba?\(([^,]+),\s*([^,]+),\s*([^,)]+)/);
          if (rgbaMatch) {
            fixed = `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, 0)`;
            break;
          }
        }
      }
      if (result === diff) {
        result = {
          ...diff
        };
      }
      result[key] = fixed;
    }
  }
  return result;
}
__name(fixTransparentColors, "fixTransparentColors");

// ../core/config/dist/esm/v5-motion.mjs
var animationsMotion = createAnimations2({
  "0ms": {
    duration: 0
  },
  "50ms": {
    duration: 50
  },
  "75ms": {
    duration: 75
  },
  "100ms": {
    duration: 100
  },
  "200ms": {
    duration: 200
  },
  "250ms": {
    duration: 250
  },
  "300ms": {
    duration: 300
  },
  "400ms": {
    duration: 400
  },
  "500ms": {
    duration: 500
  },
  superLazy: {
    type: "spring",
    damping: 15,
    mass: 2,
    stiffness: 20
  },
  lazy: {
    type: "spring",
    damping: 11,
    mass: 0.25,
    stiffness: 12
  },
  slowest: {
    type: "spring",
    damping: 9,
    stiffness: 7.5
  },
  slow: {
    type: "spring",
    damping: 27,
    stiffness: 45
  },
  medium: {
    damping: 12,
    stiffness: 100,
    mass: 0.85
  },
  superBouncy: {
    type: "spring",
    damping: 3,
    mass: 0.7,
    stiffness: 135
  },
  bouncy: {
    type: "spring",
    damping: 5.4,
    mass: 0.9,
    stiffness: 90
  },
  quick: {
    type: "spring",
    damping: 17,
    mass: 0.5,
    stiffness: 410
  },
  quickLessBouncy: {
    type: "spring",
    damping: 40,
    mass: 1,
    stiffness: 400,
    velocity: 5
  },
  quicker: {
    type: "spring",
    damping: 20,
    mass: 0.35,
    stiffness: 450
  },
  quickerLessBouncy: {
    type: "spring",
    damping: 26,
    mass: 0.5,
    stiffness: 500
  },
  quickest: {
    type: "spring",
    damping: 22,
    mass: 0.3,
    stiffness: 550
  },
  quickestLessBouncy: {
    type: "spring",
    damping: 28,
    mass: 0.4,
    stiffness: 600
  }
});

// ../core/themes/dist/esm/generated-v5-subtle.mjs
function t(a) {
  let res = {};
  for (const [ki, vi] of a) {
    res[ks[ki]] = colors[vi];
  }
  return res;
}
__name(t, "t");
var colors = ["hsla(0, 0%, 10%, 1)", "hsla(0, 0%, 67%, 1)", "hsla(0, 0%, 100%, 0)", "hsla(0, 0%, 97%, 0.2)", "hsla(0, 0%, 97%, 0.4)", "hsla(0, 0%, 97%, 0.6)", "hsla(0, 0%, 97%, 0.8)", "hsla(0, 0%, 100%, 1)", "hsla(0, 0%, 97%, 1)", "hsla(0, 0%, 93%, 1)", "hsla(0, 0%, 85%, 1)", "hsla(0, 0%, 80%, 1)", "hsla(0, 0%, 70%, 1)", "hsla(0, 0%, 59%, 1)", "hsla(0, 0%, 45%, 1)", "hsla(0, 0%, 30%, 1)", "hsla(0, 0%, 20%, 1)", "hsla(0, 0%, 14%, 1)", "hsla(0, 0%, 2%, 1)", "hsla(0, 0%, 2%, 0)", "hsla(0, 0%, 2%, 0.2)", "hsla(0, 0%, 2%, 0.4)", "hsla(0, 0%, 2%, 0.6)", "hsla(0, 0%, 2%, 0.8)", "#090909", "#151515", "#191919", "#232323", "#333", "#444", "#666", "#777", "#858585", "#aaa", "#ccc", "#ffffff", "#fff", "#f8f8f8", "hsl(0, 0%, 93%)", "hsl(0, 0%, 85%)", "hsl(0, 0%, 80%)", "hsl(0, 0%, 70%)", "hsl(0, 0%, 59%)", "hsl(0, 0%, 45%)", "hsl(0, 0%, 30%)", "hsl(0, 0%, 20%)", "hsl(0, 0%, 14%)", "hsl(0, 0%, 2%)", "rgba(255,255,255,1)", "rgba(255,255,255,0)", "rgba(255,255,255,0.2)", "rgba(255,255,255,0.4)", "rgba(255,255,255,0.6)", "rgba(255,255,255,0.8)", "rgba(0,0,0,1)", "rgba(0,0,0,0)", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.6)", "rgba(0,0,0,0.8)", "rgba(0,0,0,0.04)", "rgba(0,0,0,0.08)", "rgba(0,0,0,0.12)", "rgba(0,0,0,0.22)", "rgba(0,0,0,0.33)", "rgba(0,0,0,0.44)", "rgba(0,0,0,0.75)", "rgba(255,255,255,0.05)", "rgba(255,255,255,0.1)", "rgba(255,255,255,0.15)", "rgba(255,255,255,0.3)", "rgba(255,255,255,0.55)", "rgba(255,255,255,0.7)", "rgba(255,255,255,0.85)", "hsl(0, 0%, 99%)", "hsl(0, 0%, 98%)", "hsl(0, 0%, 94%)", "hsl(0, 0%, 91%)", "hsl(0, 0%, 88%)", "hsl(0, 0%, 81%)", "hsl(0, 0%, 73%)", "hsl(0, 0%, 55%)", "hsl(0, 0%, 51%)", "hsl(0, 0%, 39%)", "hsl(0, 0%, 13%)", "hsl(210, 90%, 99%)", "hsl(207, 90%, 98%)", "hsl(205, 83%, 95%)", "hsl(203, 90%, 92%)", "hsl(206, 90%, 88%)", "hsl(207, 84%, 83%)", "hsl(207, 77%, 76%)", "hsl(206, 74%, 65%)", "hsl(206, 90%, 50%)", "hsl(207, 86%, 48%)", "hsl(208, 79%, 43%)", "hsl(216, 64%, 23%)", "hsl(0, 90%, 99%)", "hsl(0, 90%, 98%)", "hsl(357, 81%, 96%)", "hsl(358, 90%, 93%)", "hsl(359, 90%, 90%)", "hsl(359, 85%, 87%)", "hsl(359, 70%, 81%)", "hsl(359, 63%, 74%)", "hsl(358, 68%, 59%)", "hsl(358, 62%, 55%)", "hsl(358, 58%, 49%)", "hsl(351, 56%, 24%)", "hsl(60, 33%, 100%)", "hsl(54, 57%, 100%)", "hsl(56, 60%, 89%)", "hsl(53, 58%, 79%)", "hsl(50, 56%, 70%)", "hsl(48, 46%, 65%)", "hsl(46, 36%, 60%)", "hsl(45, 32%, 48%)", "hsl(53, 47%, 51%)", "hsl(52, 45%, 43%)", "hsl(41, 42%, 26%)", "hsl(42, 16%, 16%)", "hsl(140, 54%, 99%)", "hsl(137, 42%, 97%)", "hsl(139, 42%, 93%)", "hsl(140, 44%, 89%)", "hsl(142, 40%, 84%)", "hsl(144, 37%, 77%)", "hsl(146, 36%, 68%)", "hsl(151, 36%, 54%)", "hsl(151, 49%, 42%)", "hsl(152, 51%, 39%)", "hsl(154, 54%, 32%)", "hsl(155, 36%, 16%)", "hsl(20, 54%, 99%)", "hsl(33, 90%, 96%)", "hsl(37, 90%, 92%)", "hsl(34, 90%, 85%)", "hsl(33, 90%, 80%)", "hsl(30, 90%, 75%)", "hsl(27, 78%, 71%)", "hsl(25, 72%, 63%)", "hsl(23, 84%, 53%)", "hsl(24, 90%, 47%)", "hsl(23, 90%, 40%)", "hsl(16, 45%, 23%)", "hsl(320, 90%, 99%)", "hsl(326, 70%, 98%)", "hsl(326, 82%, 95%)", "hsl(323, 72%, 92%)", "hsl(323, 62%, 89%)", "hsl(323, 54%, 84%)", "hsl(323, 50%, 79%)", "hsl(322, 47%, 72%)", "hsl(322, 58%, 55%)", "hsl(322, 55%, 52%)", "hsl(322, 59%, 46%)", "hsl(320, 63%, 23%)", "hsl(300, 45%, 99%)", "hsl(274, 70%, 98%)", "hsl(275, 81%, 96%)", "hsl(277, 73%, 94%)", "hsl(275, 68%, 91%)", "hsl(275, 62%, 86%)", "hsl(273, 55%, 81%)", "hsl(272, 54%, 74%)", "hsl(272, 46%, 54%)", "hsl(272, 40%, 50%)", "hsl(272, 40%, 49%)", "hsl(270, 45%, 25%)", "hsl(165, 60%, 99%)", "hsl(165, 45%, 97%)", "hsl(167, 57%, 93%)", "hsl(166, 56%, 88%)", "hsl(168, 49%, 82%)", "hsl(168, 43%, 75%)", "hsl(170, 38%, 66%)", "hsl(172, 38%, 53%)", "hsl(173, 72%, 36%)", "hsl(173, 76%, 33%)", "hsl(172, 90%, 26%)", "hsl(174, 58%, 15%)", "hsl(0, 0%, 68%)", "hsl(0, 0%, 65%)", "hsl(0, 0%, 62%)", "hsl(0, 0%, 56%)", "hsl(0, 0%, 53%)", "hsl(0, 0%, 50%)", "hsl(0, 0%, 47%)", "hsl(0, 0%, 44%)", "hsl(0, 0%, 41%)", "hsl(0, 0%, 38%)", "hsl(0, 0%, 32%)", "hsla(0, 0%, 4%, 1)", "hsla(0, 0%, 8%, 1)", "hsla(0, 0%, 27%, 1)", "hsla(0, 0%, 40%, 1)", "hsla(0, 0%, 47%, 1)", "hsla(0, 0%, 52%, 1)", "hsla(0, 0%, 2%, 0.1)", "hsla(0, 0%, 2%, 0.075)", "hsla(0, 0%, 2%, 0.05)", "hsla(0, 0%, 2%, 0.025)", "hsla(0, 0%, 2%, 0.02)", "hsla(0, 0%, 2%, 0.01)", "hsla(0, 0%, 97%, 0.1)", "hsla(0, 0%, 97%, 0.075)", "hsla(0, 0%, 97%, 0.05)", "hsla(0, 0%, 97%, 0.025)", "hsla(0, 0%, 97%, 0.02)", "hsla(0, 0%, 97%, 0.01)", "hsla(0, 0%, 70%, 0.6)", "hsla(0, 0%, 4%, 0)", "hsla(0, 0%, 8%, 0.2)", "hsla(0, 0%, 8%, 0.4)", "hsla(0, 0%, 8%, 0.6)", "hsla(0, 0%, 8%, 0.8)", "hsla(0, 0%, 100%, 0.2)", "hsla(0, 0%, 100%, 0.4)", "hsla(0, 0%, 100%, 0.6)", "hsla(0, 0%, 100%, 0.8)", "rgba(0,0,0,0.15)", "rgba(0,0,0,0.23)", "rgba(0,0,0,0.45)", "rgba(0,0,0,0.65)", "rgba(0,0,0,0.9)", "rgba(255,255,255,0.45)", "rgba(255,255,255,0.65)", "rgba(255,255,255,0.95)", "hsl(0, 0%, 7%)", "hsl(0, 0%, 10%)", "hsl(0, 0%, 16%)", "hsl(0, 0%, 19%)", "hsl(0, 0%, 23%)", "hsl(0, 0%, 28%)", "hsl(0, 0%, 43%)", "hsl(0, 0%, 48%)", "hsl(0, 0%, 71%)", "hsl(215, 30%, 9%)", "hsl(218, 28%, 11%)", "hsl(212, 48%, 16%)", "hsl(209, 70%, 19%)", "hsl(207, 90%, 23%)", "hsl(209, 71%, 30%)", "hsl(211, 60%, 37%)", "hsl(211, 59%, 45%)", "hsl(210, 90%, 62%)", "hsl(210, 90%, 72%)", "hsl(205, 90%, 88%)", "hsl(0, 13%, 8%)", "hsl(355, 18%, 10%)", "hsl(350, 37%, 15%)", "hsl(348, 48%, 19%)", "hsl(350, 57%, 23%)", "hsl(352, 48%, 29%)", "hsl(355, 42%, 37%)", "hsl(358, 40%, 49%)", "hsl(360, 71%, 65%)", "hsl(2, 90%, 79%)", "hsl(350, 90%, 91%)", "hsl(47, 13%, 5%)", "hsl(45, 13%, 7%)", "hsl(45, 36%, 8%)", "hsl(48, 45%, 8%)", "hsl(47, 45%, 13%)", "hsl(48, 43%, 16%)", "hsl(46, 28%, 25%)", "hsl(45, 33%, 32%)", "hsl(53, 55%, 58%)", "hsl(60, 55%, 67%)", "hsl(53, 49%, 62%)", "hsl(53, 43%, 84%)", "hsl(154, 14%, 7%)", "hsl(153, 14%, 9%)", "hsl(152, 28%, 13%)", "hsl(154, 39%, 15%)", "hsl(154, 47%, 19%)", "hsl(153, 42%, 23%)", "hsl(152, 40%, 28%)", "hsl(151, 41%, 34%)", "hsl(151, 50%, 45%)", "hsl(151, 59%, 54%)", "hsl(144, 63%, 82%)", "hsl(27, 17%, 7%)", "hsl(28, 23%, 9%)", "hsl(29, 45%, 12%)", "hsl(28, 70%, 14%)", "hsl(28, 90%, 17%)", "hsl(27, 71%, 22%)", "hsl(25, 56%, 30%)", "hsl(23, 54%, 40%)", "hsl(26, 90%, 56%)", "hsl(26, 90%, 67%)", "hsl(30, 90%, 88%)", "hsl(315, 13%, 8%)", "hsl(316, 21%, 10%)", "hsl(315, 29%, 15%)", "hsl(315, 41%, 19%)", "hsl(318, 47%, 23%)", "hsl(319, 39%, 29%)", "hsl(321, 36%, 37%)", "hsl(322, 36%, 47%)", "hsl(323, 61%, 59%)", "hsl(327, 90%, 78%)", "hsl(326, 83%, 91%)", "hsl(282, 16%, 9%)", "hsl(279, 18%, 11%)", "hsl(279, 25%, 17%)", "hsl(277, 28%, 22%)", "hsl(276, 35%, 26%)", "hsl(275, 31%, 31%)", "hsl(274, 29%, 38%)", "hsl(273, 30%, 50%)", "hsl(272, 50%, 59%)", "hsl(272, 90%, 81%)", "hsl(275, 69%, 92%)", "hsl(173, 16%, 7%)", "hsl(175, 17%, 9%)", "hsl(174, 39%, 11%)", "hsl(176, 65%, 12%)", "hsl(175, 72%, 16%)", "hsl(174, 56%, 21%)", "hsl(174, 52%, 26%)", "hsl(173, 54%, 31%)", "hsl(172, 77%, 38%)", "hsl(170, 81%, 45%)", "hsl(163, 62%, 81%)", "hsla(0, 0%, 100%, 0.1)", "hsla(0, 0%, 100%, 0.075)", "hsla(0, 0%, 100%, 0.05)", "hsla(0, 0%, 100%, 0.025)", "hsla(0, 0%, 100%, 0.02)", "hsla(0, 0%, 100%, 0.01)", "hsla(0, 0%, 8%, 0.1)", "hsla(0, 0%, 8%, 0.075)", "hsla(0, 0%, 8%, 0.05)", "hsla(0, 0%, 8%, 0.025)", "hsla(0, 0%, 8%, 0.02)", "hsla(0, 0%, 8%, 0.01)", "hsla(0, 0%, 27%, 0.6)", "hsla(0, 0%, 99%, 0)", "hsla(0, 0%, 98%, 0.2)", "hsla(0, 0%, 98%, 0.4)", "hsla(0, 0%, 98%, 0.6)", "hsla(0, 0%, 98%, 0.8)", "hsla(0, 0%, 99%, 1)", "hsla(0, 0%, 98%, 1)", "hsla(0, 0%, 94%, 1)", "hsla(0, 0%, 91%, 1)", "hsla(0, 0%, 88%, 1)", "hsla(0, 0%, 81%, 1)", "hsla(0, 0%, 73%, 1)", "hsla(0, 0%, 55%, 1)", "hsla(0, 0%, 51%, 1)", "hsla(0, 0%, 39%, 1)", "hsla(0, 0%, 13%, 1)", "hsla(0, 0%, 13%, 0)", "hsla(0, 0%, 13%, 0.2)", "hsla(0, 0%, 13%, 0.4)", "hsla(0, 0%, 13%, 0.6)", "hsla(0, 0%, 13%, 0.8)", "hsla(0, 0%, 13%, 0.1)", "hsla(0, 0%, 13%, 0.075)", "hsla(0, 0%, 13%, 0.05)", "hsla(0, 0%, 13%, 0.025)", "hsla(0, 0%, 13%, 0.02)", "hsla(0, 0%, 13%, 0.01)", "hsla(0, 0%, 98%, 0.1)", "hsla(0, 0%, 98%, 0.075)", "hsla(0, 0%, 98%, 0.05)", "hsla(0, 0%, 98%, 0.025)", "hsla(0, 0%, 98%, 0.02)", "hsla(0, 0%, 98%, 0.01)", "hsla(0, 0%, 85%, 0.6)", "hsla(216, 100%, 99%, 0)", "hsla(207, 82%, 98%, 0.2)", "hsla(207, 82%, 98%, 0.4)", "hsla(207, 82%, 98%, 0.6)", "hsla(207, 82%, 98%, 0.8)", "hsla(216, 100%, 99%, 1)", "hsla(207, 82%, 98%, 1)", "hsla(206, 84%, 95%, 1)", "hsla(203, 90%, 92%, 1)", "hsla(206, 90%, 88%, 1)", "hsla(207, 84%, 83%, 1)", "hsla(207, 77%, 76%, 1)", "hsla(206, 74%, 65%, 1)", "hsla(206, 90%, 50%, 1)", "hsla(207, 86%, 48%, 1)", "hsla(208, 79%, 43%, 1)", "hsla(216, 64%, 23%, 1)", "hsla(216, 64%, 23%, 0)", "hsla(216, 64%, 23%, 0.2)", "hsla(216, 64%, 23%, 0.4)", "hsla(216, 64%, 23%, 0.6)", "hsla(216, 64%, 23%, 0.8)", "hsla(216, 64%, 23%, 0.1)", "hsla(216, 64%, 23%, 0.075)", "hsla(216, 64%, 23%, 0.05)", "hsla(216, 64%, 23%, 0.025)", "hsla(216, 64%, 23%, 0.02)", "hsla(216, 64%, 23%, 0.01)", "hsla(207, 82%, 98%, 0.1)", "hsla(207, 82%, 98%, 0.075)", "hsla(207, 82%, 98%, 0.05)", "hsla(207, 82%, 98%, 0.025)", "hsla(207, 82%, 98%, 0.02)", "hsla(207, 82%, 98%, 0.01)", "hsla(207, 84%, 83%, 0.6)", "hsla(0, 100%, 99%, 0)", "hsla(0, 82%, 98%, 0.2)", "hsla(0, 82%, 98%, 0.4)", "hsla(0, 82%, 98%, 0.6)", "hsla(0, 82%, 98%, 0.8)", "hsla(0, 100%, 99%, 1)", "hsla(0, 82%, 98%, 1)", "hsla(0, 80%, 96%, 1)", "hsla(358, 89%, 93%, 1)", "hsla(0, 88%, 90%, 1)", "hsla(359, 85%, 87%, 1)", "hsla(359, 69%, 81%, 1)", "hsla(359, 62%, 74%, 1)", "hsla(358, 68%, 59%, 1)", "hsla(358, 62%, 55%, 1)", "hsla(358, 58%, 49%, 1)", "hsla(351, 56%, 24%, 1)", "hsla(351, 56%, 24%, 0)", "hsla(351, 56%, 24%, 0.2)", "hsla(351, 56%, 24%, 0.4)", "hsla(351, 56%, 24%, 0.6)", "hsla(351, 56%, 24%, 0.8)", "hsla(351, 56%, 24%, 0.1)", "hsla(351, 56%, 24%, 0.075)", "hsla(351, 56%, 24%, 0.05)", "hsla(351, 56%, 24%, 0.025)", "hsla(351, 56%, 24%, 0.02)", "hsla(351, 56%, 24%, 0.01)", "hsla(0, 82%, 98%, 0.1)", "hsla(0, 82%, 98%, 0.075)", "hsla(0, 82%, 98%, 0.05)", "hsla(0, 82%, 98%, 0.025)", "hsla(0, 82%, 98%, 0.02)", "hsla(0, 82%, 98%, 0.01)", "hsla(359, 85%, 87%, 0.6)", "hsla(56, 61%, 89%, 1)", "hsla(52, 59%, 79%, 1)", "hsla(50, 56%, 70%, 1)", "hsla(48, 46%, 65%, 1)", "hsla(46, 36%, 60%, 1)", "hsla(45, 32%, 48%, 1)", "hsla(53, 47%, 51%, 1)", "hsla(52, 45%, 43%, 1)", "hsla(42, 42%, 26%, 1)", "hsla(42, 16%, 16%, 1)", "hsla(42, 16%, 16%, 0)", "hsla(42, 16%, 16%, 0.2)", "hsla(42, 16%, 16%, 0.4)", "hsla(42, 16%, 16%, 0.6)", "hsla(42, 16%, 16%, 0.8)", "hsla(42, 16%, 16%, 0.1)", "hsla(42, 16%, 16%, 0.075)", "hsla(42, 16%, 16%, 0.05)", "hsla(42, 16%, 16%, 0.025)", "hsla(42, 16%, 16%, 0.02)", "hsla(42, 16%, 16%, 0.01)", "hsla(48, 46%, 65%, 0.6)", "hsla(140, 60%, 99%, 0)", "hsla(137, 47%, 97%, 0.2)", "hsla(137, 47%, 97%, 0.4)", "hsla(137, 47%, 97%, 0.6)", "hsla(137, 47%, 97%, 0.8)", "hsla(140, 60%, 99%, 1)", "hsla(137, 47%, 97%, 1)", "hsla(136, 43%, 93%, 1)", "hsla(140, 43%, 89%, 1)", "hsla(142, 41%, 84%, 1)", "hsla(144, 37%, 77%, 1)", "hsla(145, 36%, 68%, 1)", "hsla(151, 36%, 54%, 1)", "hsla(151, 49%, 42%, 1)", "hsla(152, 51%, 39%, 1)", "hsla(153, 54%, 32%, 1)", "hsla(155, 36%, 16%, 1)", "hsla(155, 36%, 16%, 0)", "hsla(155, 36%, 16%, 0.2)", "hsla(155, 36%, 16%, 0.4)", "hsla(155, 36%, 16%, 0.6)", "hsla(155, 36%, 16%, 0.8)", "hsla(155, 36%, 16%, 0.1)", "hsla(155, 36%, 16%, 0.075)", "hsla(155, 36%, 16%, 0.05)", "hsla(155, 36%, 16%, 0.025)", "hsla(155, 36%, 16%, 0.02)", "hsla(155, 36%, 16%, 0.01)", "hsla(137, 47%, 97%, 0.1)", "hsla(137, 47%, 97%, 0.075)", "hsla(137, 47%, 97%, 0.05)", "hsla(137, 47%, 97%, 0.025)", "hsla(137, 47%, 97%, 0.02)", "hsla(137, 47%, 97%, 0.01)", "hsla(144, 37%, 77%, 0.6)", "hsla(20, 60%, 99%, 0)", "hsla(33, 90%, 96%, 0.2)", "hsla(33, 90%, 96%, 0.4)", "hsla(33, 90%, 96%, 0.6)", "hsla(33, 90%, 96%, 0.8)", "hsla(20, 60%, 99%, 1)", "hsla(33, 90%, 96%, 1)", "hsla(37, 90%, 92%, 1)", "hsla(34, 90%, 85%, 1)", "hsla(33, 90%, 80%, 1)", "hsla(30, 91%, 75%, 1)", "hsla(27, 78%, 71%, 1)", "hsla(25, 72%, 63%, 1)", "hsla(23, 84%, 53%, 1)", "hsla(24, 90%, 47%, 1)", "hsla(23, 90%, 40%, 1)", "hsla(16, 45%, 23%, 1)", "hsla(16, 45%, 23%, 0)", "hsla(16, 45%, 23%, 0.2)", "hsla(16, 45%, 23%, 0.4)", "hsla(16, 45%, 23%, 0.6)", "hsla(16, 45%, 23%, 0.8)", "hsla(16, 45%, 23%, 0.1)", "hsla(16, 45%, 23%, 0.075)", "hsla(16, 45%, 23%, 0.05)", "hsla(16, 45%, 23%, 0.025)", "hsla(16, 45%, 23%, 0.02)", "hsla(16, 45%, 23%, 0.01)", "hsla(33, 90%, 96%, 0.1)", "hsla(33, 90%, 96%, 0.075)", "hsla(33, 90%, 96%, 0.05)", "hsla(33, 90%, 96%, 0.025)", "hsla(33, 90%, 96%, 0.02)", "hsla(33, 90%, 96%, 0.01)", "hsla(30, 91%, 75%, 0.6)", "hsla(324, 100%, 99%, 0)", "hsla(326, 64%, 98%, 0.2)", "hsla(326, 64%, 98%, 0.4)", "hsla(326, 64%, 98%, 0.6)", "hsla(326, 64%, 98%, 0.8)", "hsla(324, 100%, 99%, 1)", "hsla(326, 64%, 98%, 1)", "hsla(326, 84%, 95%, 1)", "hsla(323, 71%, 92%, 1)", "hsla(323, 61%, 89%, 1)", "hsla(323, 54%, 84%, 1)", "hsla(323, 50%, 79%, 1)", "hsla(321, 47%, 72%, 1)", "hsla(322, 58%, 55%, 1)", "hsla(322, 55%, 52%, 1)", "hsla(322, 59%, 46%, 1)", "hsla(320, 63%, 23%, 1)", "hsla(320, 63%, 23%, 0)", "hsla(320, 63%, 23%, 0.2)", "hsla(320, 63%, 23%, 0.4)", "hsla(320, 63%, 23%, 0.6)", "hsla(320, 63%, 23%, 0.8)", "hsla(320, 63%, 23%, 0.1)", "hsla(320, 63%, 23%, 0.075)", "hsla(320, 63%, 23%, 0.05)", "hsla(320, 63%, 23%, 0.025)", "hsla(320, 63%, 23%, 0.02)", "hsla(320, 63%, 23%, 0.01)", "hsla(326, 64%, 98%, 0.1)", "hsla(326, 64%, 98%, 0.075)", "hsla(326, 64%, 98%, 0.05)", "hsla(326, 64%, 98%, 0.025)", "hsla(326, 64%, 98%, 0.02)", "hsla(326, 64%, 98%, 0.01)", "hsla(323, 54%, 84%, 0.6)", "hsla(300, 60%, 99%, 0)", "hsla(274, 64%, 98%, 0.2)", "hsla(274, 64%, 98%, 0.4)", "hsla(274, 64%, 98%, 0.6)", "hsla(274, 64%, 98%, 0.8)", "hsla(300, 60%, 99%, 1)", "hsla(274, 64%, 98%, 1)", "hsla(274, 80%, 96%, 1)", "hsla(275, 73%, 94%, 1)", "hsla(276, 70%, 91%, 1)", "hsla(275, 61%, 86%, 1)", "hsla(273, 55%, 81%, 1)", "hsla(272, 55%, 74%, 1)", "hsla(272, 46%, 54%, 1)", "hsla(272, 40%, 50%, 1)", "hsla(272, 40%, 49%, 1)", "hsla(271, 45%, 25%, 1)", "hsla(272, 45%, 25%, 0)", "hsla(272, 45%, 25%, 0.2)", "hsla(272, 45%, 25%, 0.4)", "hsla(272, 45%, 25%, 0.6)", "hsla(272, 45%, 25%, 0.8)", "hsla(272, 45%, 25%, 0.1)", "hsla(272, 45%, 25%, 0.075)", "hsla(272, 45%, 25%, 0.05)", "hsla(272, 45%, 25%, 0.025)", "hsla(272, 45%, 25%, 0.02)", "hsla(272, 45%, 25%, 0.01)", "hsla(274, 64%, 98%, 0.1)", "hsla(274, 64%, 98%, 0.075)", "hsla(274, 64%, 98%, 0.05)", "hsla(274, 64%, 98%, 0.025)", "hsla(274, 64%, 98%, 0.02)", "hsla(274, 64%, 98%, 0.01)", "hsla(275, 61%, 86%, 0.6)", "hsla(160, 60%, 99%, 0)", "hsla(163, 47%, 97%, 0.2)", "hsla(163, 47%, 97%, 0.4)", "hsla(163, 47%, 97%, 0.6)", "hsla(163, 47%, 97%, 0.8)", "hsla(160, 60%, 99%, 1)", "hsla(163, 47%, 97%, 1)", "hsla(168, 56%, 93%, 1)", "hsla(166, 57%, 88%, 1)", "hsla(168, 49%, 82%, 1)", "hsla(168, 43%, 75%, 1)", "hsla(170, 38%, 66%, 1)", "hsla(172, 38%, 53%, 1)", "hsla(173, 72%, 36%, 1)", "hsla(173, 76%, 33%, 1)", "hsla(172, 89%, 26%, 1)", "hsla(175, 58%, 15%, 1)", "hsla(176, 58%, 15%, 0)", "hsla(176, 58%, 15%, 0.2)", "hsla(176, 58%, 15%, 0.4)", "hsla(176, 58%, 15%, 0.6)", "hsla(176, 58%, 15%, 0.8)", "hsla(176, 58%, 15%, 0.1)", "hsla(176, 58%, 15%, 0.075)", "hsla(176, 58%, 15%, 0.05)", "hsla(176, 58%, 15%, 0.025)", "hsla(176, 58%, 15%, 0.02)", "hsla(176, 58%, 15%, 0.01)", "hsla(163, 47%, 97%, 0.1)", "hsla(163, 47%, 97%, 0.075)", "hsla(163, 47%, 97%, 0.05)", "hsla(163, 47%, 97%, 0.025)", "hsla(163, 47%, 97%, 0.02)", "hsla(163, 47%, 97%, 0.01)", "hsla(168, 43%, 75%, 0.6)", "hsla(0, 0%, 68%, 0)", "hsla(0, 0%, 65%, 0.2)", "hsla(0, 0%, 65%, 0.4)", "hsla(0, 0%, 65%, 0.6)", "hsla(0, 0%, 65%, 0.8)", "hsla(0, 0%, 68%, 1)", "hsla(0, 0%, 65%, 1)", "hsla(0, 0%, 62%, 1)", "hsla(0, 0%, 56%, 1)", "hsla(0, 0%, 53%, 1)", "hsla(0, 0%, 50%, 1)", "hsla(0, 0%, 44%, 1)", "hsla(0, 0%, 41%, 1)", "hsla(0, 0%, 38%, 1)", "hsla(0, 0%, 32%, 1)", "hsla(0, 0%, 32%, 0)", "hsla(0, 0%, 32%, 0.2)", "hsla(0, 0%, 32%, 0.4)", "hsla(0, 0%, 32%, 0.6)", "hsla(0, 0%, 32%, 0.8)", "hsla(0, 0%, 32%, 0.1)", "hsla(0, 0%, 32%, 0.075)", "hsla(0, 0%, 32%, 0.05)", "hsla(0, 0%, 32%, 0.025)", "hsla(0, 0%, 32%, 0.02)", "hsla(0, 0%, 32%, 0.01)", "hsla(0, 0%, 65%, 0.1)", "hsla(0, 0%, 65%, 0.075)", "hsla(0, 0%, 65%, 0.05)", "hsla(0, 0%, 65%, 0.025)", "hsla(0, 0%, 65%, 0.02)", "hsla(0, 0%, 65%, 0.01)", "hsla(0, 0%, 53%, 0.6)", "hsla(0, 0%, 7%, 0)", "hsla(0, 0%, 10%, 0.2)", "hsla(0, 0%, 10%, 0.4)", "hsla(0, 0%, 10%, 0.6)", "hsla(0, 0%, 10%, 0.8)", "hsla(0, 0%, 7%, 1)", "hsla(0, 0%, 16%, 1)", "hsla(0, 0%, 19%, 1)", "hsla(0, 0%, 23%, 1)", "hsla(0, 0%, 28%, 1)", "hsla(0, 0%, 43%, 1)", "hsla(0, 0%, 48%, 1)", "hsla(0, 0%, 71%, 1)", "hsla(0, 0%, 93%, 0)", "hsla(0, 0%, 93%, 0.2)", "hsla(0, 0%, 93%, 0.4)", "hsla(0, 0%, 93%, 0.6)", "hsla(0, 0%, 93%, 0.8)", "hsla(0, 0%, 93%, 0.1)", "hsla(0, 0%, 93%, 0.075)", "hsla(0, 0%, 93%, 0.05)", "hsla(0, 0%, 93%, 0.025)", "hsla(0, 0%, 93%, 0.02)", "hsla(0, 0%, 93%, 0.01)", "hsla(0, 0%, 10%, 0.1)", "hsla(0, 0%, 10%, 0.075)", "hsla(0, 0%, 10%, 0.05)", "hsla(0, 0%, 10%, 0.025)", "hsla(0, 0%, 10%, 0.02)", "hsla(0, 0%, 10%, 0.01)", "hsla(0, 0%, 23%, 0.6)", "hsla(214, 30%, 9%, 0)", "hsla(218, 29%, 11%, 0.2)", "hsla(218, 29%, 11%, 0.4)", "hsla(218, 29%, 11%, 0.6)", "hsla(218, 29%, 11%, 0.8)", "hsla(214, 30%, 9%, 1)", "hsla(218, 29%, 11%, 1)", "hsla(212, 48%, 16%, 1)", "hsla(209, 69%, 19%, 1)", "hsla(207, 90%, 23%, 1)", "hsla(209, 71%, 30%, 1)", "hsla(211, 60%, 37%, 1)", "hsla(211, 59%, 45%, 1)", "hsla(210, 90%, 62%, 1)", "hsla(210, 90%, 72%, 1)", "hsla(205, 90%, 88%, 1)", "hsla(205, 90%, 88%, 0)", "hsla(205, 90%, 88%, 0.2)", "hsla(205, 90%, 88%, 0.4)", "hsla(205, 90%, 88%, 0.6)", "hsla(205, 90%, 88%, 0.8)", "hsla(205, 90%, 88%, 0.1)", "hsla(205, 90%, 88%, 0.075)", "hsla(205, 90%, 88%, 0.05)", "hsla(205, 90%, 88%, 0.025)", "hsla(205, 90%, 88%, 0.02)", "hsla(205, 90%, 88%, 0.01)", "hsla(218, 29%, 11%, 0.1)", "hsla(218, 29%, 11%, 0.075)", "hsla(218, 29%, 11%, 0.05)", "hsla(218, 29%, 11%, 0.025)", "hsla(218, 29%, 11%, 0.02)", "hsla(218, 29%, 11%, 0.01)", "hsla(209, 71%, 30%, 0.6)", "hsla(0, 12%, 8%, 0)", "hsla(353, 18%, 10%, 0.2)", "hsla(353, 18%, 10%, 0.4)", "hsla(353, 18%, 10%, 0.6)", "hsla(353, 18%, 10%, 0.8)", "hsla(0, 12%, 8%, 1)", "hsla(353, 18%, 10%, 1)", "hsla(349, 37%, 15%, 1)", "hsla(349, 48%, 19%, 1)", "hsla(350, 57%, 23%, 1)", "hsla(352, 48%, 29%, 1)", "hsla(355, 42%, 37%, 1)", "hsla(358, 40%, 49%, 1)", "hsla(0, 71%, 65%, 1)", "hsla(2, 91%, 79%, 1)", "hsla(350, 91%, 91%, 1)", "hsla(350, 91%, 91%, 0)", "hsla(350, 91%, 91%, 0.2)", "hsla(350, 91%, 91%, 0.4)", "hsla(350, 91%, 91%, 0.6)", "hsla(350, 91%, 91%, 0.8)", "hsla(350, 91%, 91%, 0.1)", "hsla(350, 91%, 91%, 0.075)", "hsla(350, 91%, 91%, 0.05)", "hsla(350, 91%, 91%, 0.025)", "hsla(350, 91%, 91%, 0.02)", "hsla(350, 91%, 91%, 0.01)", "hsla(353, 18%, 10%, 0.1)", "hsla(353, 18%, 10%, 0.075)", "hsla(353, 18%, 10%, 0.05)", "hsla(353, 18%, 10%, 0.025)", "hsla(353, 18%, 10%, 0.02)", "hsla(353, 18%, 10%, 0.01)", "hsla(352, 48%, 29%, 0.6)", "hsla(60, 12%, 5%, 0)", "hsla(45, 11%, 7%, 0.2)", "hsla(45, 11%, 7%, 0.4)", "hsla(45, 11%, 7%, 0.6)", "hsla(45, 11%, 7%, 0.8)", "hsla(60, 12%, 5%, 1)", "hsla(45, 11%, 7%, 1)", "hsla(44, 37%, 8%, 1)", "hsla(47, 46%, 8%, 1)", "hsla(48, 45%, 13%, 1)", "hsla(48, 43%, 16%, 1)", "hsla(45, 28%, 25%, 1)", "hsla(44, 33%, 32%, 1)", "hsla(53, 55%, 58%, 1)", "hsla(60, 55%, 67%, 1)", "hsla(53, 49%, 62%, 1)", "hsla(53, 43%, 84%, 1)", "hsla(53, 43%, 84%, 0)", "hsla(53, 43%, 84%, 0.2)", "hsla(53, 43%, 84%, 0.4)", "hsla(53, 43%, 84%, 0.6)", "hsla(53, 43%, 84%, 0.8)", "hsla(53, 43%, 84%, 0.1)", "hsla(53, 43%, 84%, 0.075)", "hsla(53, 43%, 84%, 0.05)", "hsla(53, 43%, 84%, 0.025)", "hsla(53, 43%, 84%, 0.02)", "hsla(53, 43%, 84%, 0.01)", "hsla(45, 11%, 7%, 0.1)", "hsla(45, 11%, 7%, 0.075)", "hsla(45, 11%, 7%, 0.05)", "hsla(45, 11%, 7%, 0.025)", "hsla(45, 11%, 7%, 0.02)", "hsla(45, 11%, 7%, 0.01)", "hsla(48, 43%, 16%, 0.6)", "hsla(156, 14%, 7%, 0)", "hsla(150, 13%, 9%, 0.2)", "hsla(150, 13%, 9%, 0.4)", "hsla(150, 13%, 9%, 0.6)", "hsla(150, 13%, 9%, 0.8)", "hsla(156, 14%, 7%, 1)", "hsla(150, 13%, 9%, 1)", "hsla(153, 27%, 13%, 1)", "hsla(154, 39%, 15%, 1)", "hsla(153, 46%, 19%, 1)", "hsla(153, 42%, 23%, 1)", "hsla(152, 40%, 28%, 1)", "hsla(151, 41%, 34%, 1)", "hsla(151, 50%, 45%, 1)", "hsla(151, 59%, 54%, 1)", "hsla(144, 63%, 82%, 1)", "hsla(144, 63%, 82%, 0)", "hsla(144, 63%, 82%, 0.2)", "hsla(144, 63%, 82%, 0.4)", "hsla(144, 63%, 82%, 0.6)", "hsla(144, 63%, 82%, 0.8)", "hsla(144, 63%, 82%, 0.1)", "hsla(144, 63%, 82%, 0.075)", "hsla(144, 63%, 82%, 0.05)", "hsla(144, 63%, 82%, 0.025)", "hsla(144, 63%, 82%, 0.02)", "hsla(144, 63%, 82%, 0.01)", "hsla(150, 13%, 9%, 0.1)", "hsla(150, 13%, 9%, 0.075)", "hsla(150, 13%, 9%, 0.05)", "hsla(150, 13%, 9%, 0.025)", "hsla(150, 13%, 9%, 0.02)", "hsla(150, 13%, 9%, 0.01)", "hsla(153, 42%, 23%, 0.6)", "hsla(30, 17%, 7%, 0)", "hsla(30, 22%, 9%, 0.2)", "hsla(30, 22%, 9%, 0.4)", "hsla(30, 22%, 9%, 0.6)", "hsla(30, 22%, 9%, 0.8)", "hsla(30, 17%, 7%, 1)", "hsla(30, 22%, 9%, 1)", "hsla(29, 44%, 12%, 1)", "hsla(28, 69%, 14%, 1)", "hsla(28, 91%, 17%, 1)", "hsla(27, 71%, 22%, 1)", "hsla(25, 56%, 30%, 1)", "hsla(23, 54%, 40%, 1)", "hsla(26, 90%, 56%, 1)", "hsla(26, 90%, 67%, 1)", "hsla(29, 90%, 88%, 1)", "hsla(28, 90%, 88%, 0)", "hsla(28, 90%, 88%, 0.2)", "hsla(28, 90%, 88%, 0.4)", "hsla(28, 90%, 88%, 0.6)", "hsla(28, 90%, 88%, 0.8)", "hsla(28, 90%, 88%, 0.1)", "hsla(28, 90%, 88%, 0.075)", "hsla(28, 90%, 88%, 0.05)", "hsla(28, 90%, 88%, 0.025)", "hsla(28, 90%, 88%, 0.02)", "hsla(28, 90%, 88%, 0.01)", "hsla(30, 22%, 9%, 0.1)", "hsla(30, 22%, 9%, 0.075)", "hsla(30, 22%, 9%, 0.05)", "hsla(30, 22%, 9%, 0.025)", "hsla(30, 22%, 9%, 0.02)", "hsla(30, 22%, 9%, 0.01)", "hsla(27, 71%, 22%, 0.6)", "hsla(312, 12%, 8%, 0)", "hsla(316, 22%, 10%, 0.2)", "hsla(316, 22%, 10%, 0.4)", "hsla(316, 22%, 10%, 0.6)", "hsla(316, 22%, 10%, 0.8)", "hsla(312, 12%, 8%, 1)", "hsla(316, 22%, 10%, 1)", "hsla(314, 29%, 15%, 1)", "hsla(315, 40%, 19%, 1)", "hsla(317, 47%, 23%, 1)", "hsla(319, 39%, 29%, 1)", "hsla(320, 36%, 37%, 1)", "hsla(322, 36%, 47%, 1)", "hsla(323, 61%, 59%, 1)", "hsla(327, 89%, 78%, 1)", "hsla(325, 83%, 91%, 1)", "hsla(325, 83%, 91%, 0)", "hsla(325, 83%, 91%, 0.2)", "hsla(325, 83%, 91%, 0.4)", "hsla(325, 83%, 91%, 0.6)", "hsla(325, 83%, 91%, 0.8)", "hsla(325, 83%, 91%, 0.1)", "hsla(325, 83%, 91%, 0.075)", "hsla(325, 83%, 91%, 0.05)", "hsla(325, 83%, 91%, 0.025)", "hsla(325, 83%, 91%, 0.02)", "hsla(325, 83%, 91%, 0.01)", "hsla(316, 22%, 10%, 0.1)", "hsla(316, 22%, 10%, 0.075)", "hsla(316, 22%, 10%, 0.05)", "hsla(316, 22%, 10%, 0.025)", "hsla(316, 22%, 10%, 0.02)", "hsla(316, 22%, 10%, 0.01)", "hsla(319, 39%, 29%, 0.6)", "hsla(278, 17%, 9%, 0)", "hsla(282, 18%, 11%, 0.2)", "hsla(282, 18%, 11%, 0.4)", "hsla(282, 18%, 11%, 0.6)", "hsla(282, 18%, 11%, 0.8)", "hsla(278, 17%, 9%, 1)", "hsla(282, 18%, 11%, 1)", "hsla(280, 24%, 17%, 1)", "hsla(278, 29%, 22%, 1)", "hsla(276, 35%, 26%, 1)", "hsla(274, 31%, 31%, 1)", "hsla(274, 29%, 38%, 1)", "hsla(273, 30%, 50%, 1)", "hsla(272, 50%, 59%, 1)", "hsla(272, 90%, 81%, 1)", "hsla(274, 70%, 92%, 1)", "hsla(275, 71%, 92%, 0)", "hsla(275, 71%, 92%, 0.2)", "hsla(275, 71%, 92%, 0.4)", "hsla(275, 71%, 92%, 0.6)", "hsla(275, 71%, 92%, 0.8)", "hsla(275, 71%, 92%, 0.1)", "hsla(275, 71%, 92%, 0.075)", "hsla(275, 71%, 92%, 0.05)", "hsla(275, 71%, 92%, 0.025)", "hsla(275, 71%, 92%, 0.02)", "hsla(275, 71%, 92%, 0.01)", "hsla(282, 18%, 11%, 0.1)", "hsla(282, 18%, 11%, 0.075)", "hsla(282, 18%, 11%, 0.05)", "hsla(282, 18%, 11%, 0.025)", "hsla(282, 18%, 11%, 0.02)", "hsla(282, 18%, 11%, 0.01)", "hsla(274, 31%, 31%, 0.6)", "hsla(170, 17%, 7%, 0)", "hsla(173, 17%, 9%, 0.2)", "hsla(173, 17%, 9%, 0.4)", "hsla(173, 17%, 9%, 0.6)", "hsla(173, 17%, 9%, 0.8)", "hsla(170, 17%, 7%, 1)", "hsla(173, 17%, 9%, 1)", "hsla(175, 39%, 11%, 1)", "hsla(177, 64%, 12%, 1)", "hsla(175, 73%, 16%, 1)", "hsla(174, 56%, 21%, 1)", "hsla(174, 52%, 26%, 1)", "hsla(173, 54%, 31%, 1)", "hsla(172, 77%, 38%, 1)", "hsla(170, 81%, 45%, 1)", "hsla(163, 63%, 81%, 1)", "hsla(163, 63%, 81%, 0)", "hsla(163, 63%, 81%, 0.2)", "hsla(163, 63%, 81%, 0.4)", "hsla(163, 63%, 81%, 0.6)", "hsla(163, 63%, 81%, 0.8)", "hsla(163, 63%, 81%, 0.1)", "hsla(163, 63%, 81%, 0.075)", "hsla(163, 63%, 81%, 0.05)", "hsla(163, 63%, 81%, 0.025)", "hsla(163, 63%, 81%, 0.02)", "hsla(163, 63%, 81%, 0.01)", "hsla(173, 17%, 9%, 0.1)", "hsla(173, 17%, 9%, 0.075)", "hsla(173, 17%, 9%, 0.05)", "hsla(173, 17%, 9%, 0.025)", "hsla(173, 17%, 9%, 0.02)", "hsla(173, 17%, 9%, 0.01)", "hsla(174, 56%, 21%, 0.6)", "hsla(0, 0%, 4%, 0.2)", "hsla(0, 0%, 4%, 0.4)", "hsla(0, 0%, 4%, 0.6)", "hsla(0, 0%, 4%, 0.8)", "hsla(0, 0%, 99%, 0.2)", "hsla(0, 0%, 99%, 0.4)", "hsla(0, 0%, 99%, 0.6)", "hsla(0, 0%, 99%, 0.8)", "hsla(216, 100%, 99%, 0.2)", "hsla(216, 100%, 99%, 0.4)", "hsla(216, 100%, 99%, 0.6)", "hsla(216, 100%, 99%, 0.8)", "hsla(0, 100%, 99%, 0.2)", "hsla(0, 100%, 99%, 0.4)", "hsla(0, 100%, 99%, 0.6)", "hsla(0, 100%, 99%, 0.8)", "hsla(140, 60%, 99%, 0.2)", "hsla(140, 60%, 99%, 0.4)", "hsla(140, 60%, 99%, 0.6)", "hsla(140, 60%, 99%, 0.8)", "hsla(20, 60%, 99%, 0.2)", "hsla(20, 60%, 99%, 0.4)", "hsla(20, 60%, 99%, 0.6)", "hsla(20, 60%, 99%, 0.8)", "hsla(324, 100%, 99%, 0.2)", "hsla(324, 100%, 99%, 0.4)", "hsla(324, 100%, 99%, 0.6)", "hsla(324, 100%, 99%, 0.8)", "hsla(300, 60%, 99%, 0.2)", "hsla(300, 60%, 99%, 0.4)", "hsla(300, 60%, 99%, 0.6)", "hsla(300, 60%, 99%, 0.8)", "hsla(160, 60%, 99%, 0.2)", "hsla(160, 60%, 99%, 0.4)", "hsla(160, 60%, 99%, 0.6)", "hsla(160, 60%, 99%, 0.8)", "hsla(0, 0%, 68%, 0.2)", "hsla(0, 0%, 68%, 0.4)", "hsla(0, 0%, 68%, 0.6)", "hsla(0, 0%, 68%, 0.8)", "hsla(0, 0%, 7%, 0.2)", "hsla(0, 0%, 7%, 0.4)", "hsla(0, 0%, 7%, 0.6)", "hsla(0, 0%, 7%, 0.8)", "hsla(214, 30%, 9%, 0.2)", "hsla(214, 30%, 9%, 0.4)", "hsla(214, 30%, 9%, 0.6)", "hsla(214, 30%, 9%, 0.8)", "hsla(0, 12%, 8%, 0.2)", "hsla(0, 12%, 8%, 0.4)", "hsla(0, 12%, 8%, 0.6)", "hsla(0, 12%, 8%, 0.8)", "hsla(60, 12%, 5%, 0.2)", "hsla(60, 12%, 5%, 0.4)", "hsla(60, 12%, 5%, 0.6)", "hsla(60, 12%, 5%, 0.8)", "hsla(156, 14%, 7%, 0.2)", "hsla(156, 14%, 7%, 0.4)", "hsla(156, 14%, 7%, 0.6)", "hsla(156, 14%, 7%, 0.8)", "hsla(30, 17%, 7%, 0.2)", "hsla(30, 17%, 7%, 0.4)", "hsla(30, 17%, 7%, 0.6)", "hsla(30, 17%, 7%, 0.8)", "hsla(312, 12%, 8%, 0.2)", "hsla(312, 12%, 8%, 0.4)", "hsla(312, 12%, 8%, 0.6)", "hsla(312, 12%, 8%, 0.8)", "hsla(278, 17%, 9%, 0.2)", "hsla(278, 17%, 9%, 0.4)", "hsla(278, 17%, 9%, 0.6)", "hsla(278, 17%, 9%, 0.8)", "hsla(170, 17%, 7%, 0.2)", "hsla(170, 17%, 7%, 0.4)", "hsla(170, 17%, 7%, 0.6)", "hsla(170, 17%, 7%, 0.8)"];
var ks = ["accentBackground", "accentColor", "background0", "background02", "background04", "background06", "background08", "color1", "color2", "color3", "color4", "color5", "color6", "color7", "color8", "color9", "color10", "color11", "color12", "color0", "color02", "color04", "color06", "color08", "color", "colorHover", "colorPress", "colorFocus", "background", "backgroundHover", "backgroundPress", "backgroundFocus", "backgroundActive", "borderColor", "borderColorHover", "borderColorFocus", "borderColorPress", "placeholderColor", "colorTransparent", "black1", "black2", "black3", "black4", "black5", "black6", "black7", "black8", "black9", "black10", "black11", "black12", "white1", "white2", "white3", "white4", "white5", "white6", "white7", "white8", "white9", "white10", "white11", "white12", "white", "white0", "white02", "white04", "white06", "white08", "black", "black0", "black02", "black04", "black06", "black08", "shadow1", "shadow2", "shadow3", "shadow4", "shadow5", "shadow6", "shadow7", "shadow8", "highlight1", "highlight2", "highlight3", "highlight4", "highlight5", "highlight6", "highlight7", "highlight8", "shadowColor", "gray1", "gray2", "gray3", "gray4", "gray5", "gray6", "gray7", "gray8", "gray9", "gray10", "gray11", "gray12", "blue1", "blue2", "blue3", "blue4", "blue5", "blue6", "blue7", "blue8", "blue9", "blue10", "blue11", "blue12", "red1", "red2", "red3", "red4", "red5", "red6", "red7", "red8", "red9", "red10", "red11", "red12", "yellow1", "yellow2", "yellow3", "yellow4", "yellow5", "yellow6", "yellow7", "yellow8", "yellow9", "yellow10", "yellow11", "yellow12", "green1", "green2", "green3", "green4", "green5", "green6", "green7", "green8", "green9", "green10", "green11", "green12", "orange1", "orange2", "orange3", "orange4", "orange5", "orange6", "orange7", "orange8", "orange9", "orange10", "orange11", "orange12", "pink1", "pink2", "pink3", "pink4", "pink5", "pink6", "pink7", "pink8", "pink9", "pink10", "pink11", "pink12", "purple1", "purple2", "purple3", "purple4", "purple5", "purple6", "purple7", "purple8", "purple9", "purple10", "purple11", "purple12", "teal1", "teal2", "teal3", "teal4", "teal5", "teal6", "teal7", "teal8", "teal9", "teal10", "teal11", "teal12", "neutral1", "neutral2", "neutral3", "neutral4", "neutral5", "neutral6", "neutral7", "neutral8", "neutral9", "neutral10", "neutral11", "neutral12", "accent1", "accent2", "accent3", "accent4", "accent5", "accent6", "accent7", "accent8", "accent9", "accent10", "accent11", "accent12", "color01", "color0075", "color005", "color0025", "color002", "color001", "background01", "background0075", "background005", "background0025", "background002", "background001", "outlineColor"];
var n1 = t([[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9], [10, 10], [11, 11], [12, 12], [13, 13], [14, 14], [15, 15], [16, 16], [17, 17], [18, 18], [19, 19], [20, 20], [21, 21], [22, 22], [23, 23], [24, 18], [25, 18], [26, 18], [27, 23], [28, 8], [29, 7], [30, 9], [31, 9], [32, 8], [33, 10], [34, 9], [35, 10], [36, 11], [37, 15], [38, 19], [39, 24], [40, 25], [41, 26], [42, 27], [43, 28], [44, 29], [45, 30], [46, 31], [47, 32], [48, 33], [49, 34], [50, 35], [51, 36], [52, 37], [53, 38], [54, 39], [55, 40], [56, 41], [57, 42], [58, 43], [59, 44], [60, 45], [61, 46], [62, 47], [63, 48], [64, 49], [65, 50], [66, 51], [67, 52], [68, 53], [69, 54], [70, 55], [71, 56], [72, 57], [73, 58], [74, 59], [75, 60], [76, 61], [77, 62], [78, 63], [79, 64], [80, 65], [81, 58], [82, 66], [83, 67], [84, 68], [85, 69], [86, 70], [87, 51], [88, 71], [89, 72], [90, 73], [91, 62], [92, 74], [93, 75], [94, 76], [95, 77], [96, 78], [97, 39], [98, 79], [99, 80], [100, 81], [101, 82], [102, 83], [103, 84], [104, 85], [105, 86], [106, 87], [107, 88], [108, 89], [109, 90], [110, 91], [111, 92], [112, 93], [113, 94], [114, 95], [115, 96], [116, 97], [117, 98], [118, 99], [119, 100], [120, 101], [121, 102], [122, 103], [123, 104], [124, 105], [125, 106], [126, 107], [127, 108], [128, 109], [129, 110], [130, 111], [131, 112], [132, 113], [133, 114], [134, 115], [135, 116], [136, 117], [137, 118], [138, 119], [139, 120], [140, 121], [141, 122], [142, 123], [143, 124], [144, 125], [145, 126], [146, 127], [147, 128], [148, 129], [149, 130], [150, 131], [151, 132], [152, 133], [153, 134], [154, 135], [155, 136], [156, 137], [157, 138], [158, 139], [159, 140], [160, 141], [161, 142], [162, 143], [163, 144], [164, 145], [165, 146], [166, 147], [167, 148], [168, 149], [169, 150], [170, 151], [171, 152], [172, 153], [173, 154], [174, 155], [175, 156], [176, 157], [177, 158], [178, 159], [179, 160], [180, 161], [181, 162], [182, 163], [183, 164], [184, 165], [185, 166], [186, 167], [187, 168], [188, 169], [189, 170], [190, 171], [191, 172], [192, 173], [193, 174], [194, 175], [195, 176], [196, 177], [197, 178], [198, 179], [199, 180], [200, 181], [201, 182], [202, 183], [203, 42], [204, 184], [205, 185], [206, 186], [207, 187], [208, 188], [209, 189], [210, 190], [211, 191], [212, 192], [213, 193], [214, 0], [215, 17], [216, 16], [217, 194], [218, 195], [219, 196], [220, 197], [221, 1], [222, 11], [223, 7], [224, 198], [225, 199], [226, 200], [227, 201], [228, 202], [229, 203], [230, 204], [231, 205], [232, 206], [233, 207], [234, 208], [235, 209], [236, 210]]);
var n2 = t([[0, 16], [1, 9], [2, 211], [3, 212], [4, 213], [5, 214], [6, 215], [7, 192], [8, 193], [9, 0], [10, 17], [11, 16], [12, 194], [13, 195], [14, 196], [15, 197], [16, 1], [17, 11], [18, 7], [19, 2], [20, 216], [21, 217], [22, 218], [23, 219], [24, 7], [25, 219], [26, 7], [27, 11], [28, 193], [29, 0], [30, 192], [31, 0], [32, 193], [33, 17], [34, 16], [35, 17], [36, 0], [37, 197], [38, 2], [39, 24], [40, 25], [41, 26], [42, 27], [43, 28], [44, 29], [45, 30], [46, 31], [47, 32], [48, 33], [49, 34], [50, 35], [51, 36], [52, 37], [53, 38], [54, 39], [55, 40], [56, 41], [57, 42], [58, 43], [59, 44], [60, 45], [61, 46], [62, 47], [63, 48], [64, 49], [65, 50], [66, 51], [67, 52], [68, 53], [69, 54], [70, 55], [71, 56], [72, 57], [73, 58], [74, 59], [75, 220], [76, 221], [77, 64], [78, 222], [79, 223], [80, 59], [81, 224], [82, 54], [83, 68], [84, 50], [85, 70], [86, 225], [87, 226], [88, 73], [89, 227], [90, 48], [91, 64], [92, 228], [93, 229], [94, 84], [95, 230], [96, 231], [97, 232], [98, 233], [99, 190], [100, 234], [101, 235], [102, 236], [103, 38], [104, 237], [105, 238], [106, 239], [107, 240], [108, 241], [109, 242], [110, 243], [111, 244], [112, 93], [113, 245], [114, 246], [115, 247], [116, 248], [117, 249], [118, 250], [119, 251], [120, 252], [121, 253], [122, 254], [123, 255], [124, 105], [125, 256], [126, 257], [127, 258], [128, 259], [129, 260], [130, 261], [131, 262], [132, 263], [133, 264], [134, 265], [135, 266], [136, 267], [137, 268], [138, 269], [139, 270], [140, 271], [141, 272], [142, 273], [143, 274], [144, 275], [145, 276], [146, 277], [147, 278], [148, 129], [149, 279], [150, 280], [151, 281], [152, 282], [153, 283], [154, 284], [155, 285], [156, 286], [157, 287], [158, 288], [159, 289], [160, 141], [161, 290], [162, 291], [163, 292], [164, 293], [165, 294], [166, 295], [167, 296], [168, 297], [169, 298], [170, 299], [171, 300], [172, 153], [173, 301], [174, 302], [175, 303], [176, 304], [177, 305], [178, 306], [179, 307], [180, 308], [181, 309], [182, 310], [183, 311], [184, 165], [185, 312], [186, 313], [187, 314], [188, 315], [189, 316], [190, 317], [191, 318], [192, 319], [193, 320], [194, 321], [195, 322], [196, 177], [197, 323], [198, 324], [199, 325], [200, 181], [201, 182], [202, 183], [203, 42], [204, 184], [205, 185], [206, 186], [207, 187], [208, 188], [209, 189], [210, 190], [211, 191], [212, 7], [213, 8], [214, 9], [215, 10], [216, 11], [217, 12], [218, 13], [219, 14], [220, 15], [221, 16], [222, 17], [223, 18], [224, 326], [225, 327], [226, 328], [227, 329], [228, 330], [229, 331], [230, 332], [231, 333], [232, 334], [233, 335], [234, 336], [235, 337], [236, 338]]);
var n3 = t([[0, 9], [1, 16], [2, 211], [3, 212], [4, 213], [5, 214], [6, 215], [7, 192], [8, 193], [9, 0], [10, 17], [11, 16], [12, 194], [13, 195], [14, 196], [15, 197], [16, 1], [17, 11], [18, 7], [19, 2], [20, 216], [21, 217], [22, 218], [23, 219], [24, 7], [25, 7], [26, 7], [27, 219], [28, 193], [29, 192], [30, 0], [31, 0], [32, 193], [33, 17], [34, 0], [35, 17], [36, 16], [37, 197], [38, 2], [224, 326], [225, 327], [226, 328], [227, 329], [228, 330], [229, 331], [230, 332], [231, 333], [232, 334], [233, 335], [234, 336], [235, 337], [236, 338]]);
var n4 = t([[0, 1], [1, 0], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9], [10, 10], [11, 11], [12, 12], [13, 13], [14, 14], [15, 15], [16, 16], [17, 17], [18, 18], [19, 19], [20, 20], [21, 21], [22, 22], [23, 23], [24, 18], [25, 23], [26, 18], [27, 17], [28, 8], [29, 9], [30, 7], [31, 9], [32, 8], [33, 10], [34, 11], [35, 10], [36, 9], [37, 15], [38, 19], [224, 198], [225, 199], [226, 200], [227, 201], [228, 202], [229, 203], [230, 204], [231, 205], [232, 206], [233, 207], [234, 208], [235, 209], [236, 210]]);
var n5 = t([[0, 0], [1, 1], [2, 211], [3, 212], [4, 213], [5, 214], [6, 215], [7, 192], [8, 193], [9, 0], [10, 17], [11, 16], [12, 194], [13, 195], [14, 196], [15, 197], [16, 1], [17, 11], [18, 7], [19, 2], [20, 216], [21, 217], [22, 218], [23, 219], [24, 7], [25, 7], [26, 7], [27, 219], [28, 193], [29, 192], [30, 0], [31, 0], [32, 193], [33, 17], [34, 0], [35, 17], [36, 16], [37, 197], [38, 2], [224, 326], [225, 327], [226, 328], [227, 329], [228, 330], [229, 331], [230, 332], [231, 333], [232, 334], [233, 335], [234, 336], [235, 337], [236, 338]]);
var n6 = t([[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9], [10, 10], [11, 11], [12, 12], [13, 13], [14, 14], [15, 15], [16, 16], [17, 17], [18, 18], [19, 19], [20, 20], [21, 21], [22, 22], [23, 23], [24, 18], [25, 18], [26, 18], [27, 23], [28, 8], [29, 7], [30, 9], [31, 9], [32, 8], [33, 10], [34, 9], [35, 10], [36, 11], [37, 15], [38, 19], [224, 198], [225, 199], [226, 200], [227, 201], [228, 202], [229, 203], [230, 204], [231, 205], [232, 206], [233, 207], [234, 208], [235, 209], [236, 210]]);
var n7 = t([[0, 0], [1, 1], [2, 339], [3, 340], [4, 341], [5, 342], [6, 343], [7, 344], [8, 345], [9, 346], [10, 347], [11, 348], [12, 10], [13, 349], [14, 350], [15, 351], [16, 352], [17, 353], [18, 354], [19, 355], [20, 356], [21, 357], [22, 358], [23, 359], [24, 354], [25, 354], [26, 354], [27, 359], [28, 345], [29, 344], [30, 346], [31, 346], [32, 345], [33, 347], [34, 346], [35, 347], [36, 348], [37, 351], [38, 355], [224, 360], [225, 361], [226, 362], [227, 363], [228, 364], [229, 365], [230, 366], [231, 367], [232, 368], [233, 369], [234, 370], [235, 371], [236, 372]]);
var n8 = t([[0, 0], [1, 1], [2, 373], [3, 374], [4, 375], [5, 376], [6, 377], [7, 378], [8, 379], [9, 380], [10, 381], [11, 382], [12, 383], [13, 384], [14, 385], [15, 386], [16, 387], [17, 388], [18, 389], [19, 390], [20, 391], [21, 392], [22, 393], [23, 394], [24, 389], [25, 389], [26, 389], [27, 394], [28, 379], [29, 378], [30, 380], [31, 380], [32, 379], [33, 381], [34, 380], [35, 381], [36, 382], [37, 386], [38, 390], [224, 395], [225, 396], [226, 397], [227, 398], [228, 399], [229, 400], [230, 401], [231, 402], [232, 403], [233, 404], [234, 405], [235, 406], [236, 407]]);
var n9 = t([[0, 0], [1, 1], [2, 408], [3, 409], [4, 410], [5, 411], [6, 412], [7, 413], [8, 414], [9, 415], [10, 416], [11, 417], [12, 418], [13, 419], [14, 420], [15, 421], [16, 422], [17, 423], [18, 424], [19, 425], [20, 426], [21, 427], [22, 428], [23, 429], [24, 424], [25, 424], [26, 424], [27, 429], [28, 414], [29, 413], [30, 415], [31, 415], [32, 414], [33, 416], [34, 415], [35, 416], [36, 417], [37, 421], [38, 425], [224, 430], [225, 431], [226, 432], [227, 433], [228, 434], [229, 435], [230, 436], [231, 437], [232, 438], [233, 439], [234, 440], [235, 441], [236, 442]]);
var n10 = t([[0, 0], [1, 1], [2, 2], [3, 216], [4, 217], [5, 218], [6, 219], [7, 7], [8, 7], [9, 443], [10, 444], [11, 445], [12, 446], [13, 447], [14, 448], [15, 449], [16, 450], [17, 451], [18, 452], [19, 453], [20, 454], [21, 455], [22, 456], [23, 457], [24, 452], [25, 452], [26, 452], [27, 457], [28, 7], [29, 7], [30, 443], [31, 443], [32, 7], [33, 444], [34, 443], [35, 444], [36, 445], [37, 449], [38, 453], [224, 458], [225, 459], [226, 460], [227, 461], [228, 462], [229, 463], [230, 326], [231, 327], [232, 328], [233, 329], [234, 330], [235, 331], [236, 464]]);
var n11 = t([[0, 0], [1, 1], [2, 465], [3, 466], [4, 467], [5, 468], [6, 469], [7, 470], [8, 471], [9, 472], [10, 473], [11, 474], [12, 475], [13, 476], [14, 477], [15, 478], [16, 479], [17, 480], [18, 481], [19, 482], [20, 483], [21, 484], [22, 485], [23, 486], [24, 481], [25, 481], [26, 481], [27, 486], [28, 471], [29, 470], [30, 472], [31, 472], [32, 471], [33, 473], [34, 472], [35, 473], [36, 474], [37, 478], [38, 482], [224, 487], [225, 488], [226, 489], [227, 490], [228, 491], [229, 492], [230, 493], [231, 494], [232, 495], [233, 496], [234, 497], [235, 498], [236, 499]]);
var n12 = t([[0, 0], [1, 1], [2, 500], [3, 501], [4, 502], [5, 503], [6, 504], [7, 505], [8, 506], [9, 507], [10, 508], [11, 509], [12, 510], [13, 511], [14, 512], [15, 513], [16, 514], [17, 515], [18, 516], [19, 517], [20, 518], [21, 519], [22, 520], [23, 521], [24, 516], [25, 516], [26, 516], [27, 521], [28, 506], [29, 505], [30, 507], [31, 507], [32, 506], [33, 508], [34, 507], [35, 508], [36, 509], [37, 513], [38, 517], [224, 522], [225, 523], [226, 524], [227, 525], [228, 526], [229, 527], [230, 528], [231, 529], [232, 530], [233, 531], [234, 532], [235, 533], [236, 534]]);
var n13 = t([[0, 0], [1, 1], [2, 535], [3, 536], [4, 537], [5, 538], [6, 539], [7, 540], [8, 541], [9, 542], [10, 543], [11, 544], [12, 545], [13, 546], [14, 547], [15, 548], [16, 549], [17, 550], [18, 551], [19, 552], [20, 553], [21, 554], [22, 555], [23, 556], [24, 551], [25, 551], [26, 551], [27, 556], [28, 541], [29, 540], [30, 542], [31, 542], [32, 541], [33, 543], [34, 542], [35, 543], [36, 544], [37, 548], [38, 552], [224, 557], [225, 558], [226, 559], [227, 560], [228, 561], [229, 562], [230, 563], [231, 564], [232, 565], [233, 566], [234, 567], [235, 568], [236, 569]]);
var n14 = t([[0, 0], [1, 1], [2, 570], [3, 571], [4, 572], [5, 573], [6, 574], [7, 575], [8, 576], [9, 577], [10, 578], [11, 579], [12, 580], [13, 581], [14, 582], [15, 583], [16, 584], [17, 585], [18, 586], [19, 587], [20, 588], [21, 589], [22, 590], [23, 591], [24, 586], [25, 586], [26, 586], [27, 591], [28, 576], [29, 575], [30, 577], [31, 577], [32, 576], [33, 578], [34, 577], [35, 578], [36, 579], [37, 583], [38, 587], [224, 592], [225, 593], [226, 594], [227, 595], [228, 596], [229, 597], [230, 598], [231, 599], [232, 600], [233, 601], [234, 602], [235, 603], [236, 604]]);
var n15 = t([[0, 0], [1, 1], [2, 605], [3, 606], [4, 607], [5, 608], [6, 609], [7, 610], [8, 611], [9, 612], [10, 613], [11, 614], [12, 615], [13, 616], [14, 617], [15, 618], [16, 619], [17, 620], [18, 621], [19, 622], [20, 623], [21, 624], [22, 625], [23, 626], [24, 621], [25, 621], [26, 621], [27, 626], [28, 611], [29, 610], [30, 612], [31, 612], [32, 611], [33, 613], [34, 612], [35, 613], [36, 614], [37, 618], [38, 622], [224, 627], [225, 628], [226, 629], [227, 630], [228, 631], [229, 632], [230, 633], [231, 634], [232, 635], [233, 636], [234, 637], [235, 638], [236, 639]]);
var n16 = t([[0, 0], [1, 1], [2, 640], [3, 641], [4, 642], [5, 643], [6, 644], [7, 645], [8, 646], [9, 647], [10, 13], [11, 648], [12, 649], [13, 650], [14, 196], [15, 651], [16, 652], [17, 653], [18, 654], [19, 655], [20, 656], [21, 657], [22, 658], [23, 659], [24, 654], [25, 654], [26, 654], [27, 659], [28, 646], [29, 645], [30, 647], [31, 647], [32, 646], [33, 13], [34, 647], [35, 13], [36, 648], [37, 651], [38, 655], [224, 660], [225, 661], [226, 662], [227, 663], [228, 664], [229, 665], [230, 666], [231, 667], [232, 668], [233, 669], [234, 670], [235, 671], [236, 672]]);
var n17 = t([[0, 16], [1, 9], [2, 211], [3, 212], [4, 213], [5, 214], [6, 215], [7, 192], [8, 193], [9, 0], [10, 17], [11, 16], [12, 194], [13, 195], [14, 196], [15, 197], [16, 1], [17, 11], [18, 7], [19, 2], [20, 216], [21, 217], [22, 218], [23, 219], [24, 7], [25, 219], [26, 7], [27, 11], [28, 193], [29, 0], [30, 192], [31, 0], [32, 193], [33, 17], [34, 16], [35, 17], [36, 0], [37, 197], [38, 2], [224, 326], [225, 327], [226, 328], [227, 329], [228, 330], [229, 331], [230, 332], [231, 333], [232, 334], [233, 335], [234, 336], [235, 337], [236, 338]]);
var n18 = t([[0, 16], [1, 9], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9], [10, 10], [11, 11], [12, 12], [13, 13], [14, 14], [15, 15], [16, 16], [17, 17], [18, 18], [19, 19], [20, 20], [21, 21], [22, 22], [23, 23], [24, 18], [25, 23], [26, 18], [27, 17], [28, 8], [29, 9], [30, 7], [31, 9], [32, 8], [33, 10], [34, 11], [35, 10], [36, 9], [37, 15], [38, 19], [224, 198], [225, 199], [226, 200], [227, 201], [228, 202], [229, 203], [230, 204], [231, 205], [232, 206], [233, 207], [234, 208], [235, 209], [236, 210]]);
var n19 = t([[0, 16], [1, 9], [2, 673], [3, 674], [4, 675], [5, 676], [6, 677], [7, 678], [8, 0], [9, 354], [10, 679], [11, 680], [12, 681], [13, 682], [14, 653], [15, 683], [16, 684], [17, 685], [18, 9], [19, 686], [20, 687], [21, 688], [22, 689], [23, 690], [24, 9], [25, 690], [26, 9], [27, 685], [28, 0], [29, 354], [30, 678], [31, 354], [32, 0], [33, 679], [34, 680], [35, 679], [36, 354], [37, 683], [38, 686], [224, 691], [225, 692], [226, 693], [227, 694], [228, 695], [229, 696], [230, 697], [231, 698], [232, 699], [233, 700], [234, 701], [235, 702], [236, 703]]);
var n20 = t([[0, 16], [1, 9], [2, 704], [3, 705], [4, 706], [5, 707], [6, 708], [7, 709], [8, 710], [9, 711], [10, 712], [11, 713], [12, 714], [13, 715], [14, 716], [15, 386], [16, 717], [17, 718], [18, 719], [19, 720], [20, 721], [21, 722], [22, 723], [23, 724], [24, 719], [25, 724], [26, 719], [27, 718], [28, 710], [29, 711], [30, 709], [31, 711], [32, 710], [33, 712], [34, 713], [35, 712], [36, 711], [37, 386], [38, 720], [224, 725], [225, 726], [226, 727], [227, 728], [228, 729], [229, 730], [230, 731], [231, 732], [232, 733], [233, 734], [234, 735], [235, 736], [236, 737]]);
var n21 = t([[0, 16], [1, 9], [2, 738], [3, 739], [4, 740], [5, 741], [6, 742], [7, 743], [8, 744], [9, 745], [10, 746], [11, 747], [12, 748], [13, 749], [14, 750], [15, 421], [16, 751], [17, 752], [18, 753], [19, 754], [20, 755], [21, 756], [22, 757], [23, 758], [24, 753], [25, 758], [26, 753], [27, 752], [28, 744], [29, 745], [30, 743], [31, 745], [32, 744], [33, 746], [34, 747], [35, 746], [36, 745], [37, 421], [38, 754], [224, 759], [225, 760], [226, 761], [227, 762], [228, 763], [229, 764], [230, 765], [231, 766], [232, 767], [233, 768], [234, 769], [235, 770], [236, 771]]);
var n22 = t([[0, 16], [1, 9], [2, 772], [3, 773], [4, 774], [5, 775], [6, 776], [7, 777], [8, 778], [9, 779], [10, 780], [11, 781], [12, 782], [13, 783], [14, 784], [15, 785], [16, 786], [17, 787], [18, 788], [19, 789], [20, 790], [21, 791], [22, 792], [23, 793], [24, 788], [25, 793], [26, 788], [27, 787], [28, 778], [29, 779], [30, 777], [31, 779], [32, 778], [33, 780], [34, 781], [35, 780], [36, 779], [37, 785], [38, 789], [224, 794], [225, 795], [226, 796], [227, 797], [228, 798], [229, 799], [230, 800], [231, 801], [232, 802], [233, 803], [234, 804], [235, 805], [236, 806]]);
var n23 = t([[0, 16], [1, 9], [2, 807], [3, 808], [4, 809], [5, 810], [6, 811], [7, 812], [8, 813], [9, 814], [10, 815], [11, 816], [12, 817], [13, 818], [14, 819], [15, 478], [16, 820], [17, 821], [18, 822], [19, 823], [20, 824], [21, 825], [22, 826], [23, 827], [24, 822], [25, 827], [26, 822], [27, 821], [28, 813], [29, 814], [30, 812], [31, 814], [32, 813], [33, 815], [34, 816], [35, 815], [36, 814], [37, 478], [38, 823], [224, 828], [225, 829], [226, 830], [227, 831], [228, 832], [229, 833], [230, 834], [231, 835], [232, 836], [233, 837], [234, 838], [235, 839], [236, 840]]);
var n24 = t([[0, 16], [1, 9], [2, 841], [3, 842], [4, 843], [5, 844], [6, 845], [7, 846], [8, 847], [9, 848], [10, 849], [11, 850], [12, 851], [13, 852], [14, 853], [15, 513], [16, 854], [17, 855], [18, 856], [19, 857], [20, 858], [21, 859], [22, 860], [23, 861], [24, 856], [25, 861], [26, 856], [27, 855], [28, 847], [29, 848], [30, 846], [31, 848], [32, 847], [33, 849], [34, 850], [35, 849], [36, 848], [37, 513], [38, 857], [224, 862], [225, 863], [226, 864], [227, 865], [228, 866], [229, 867], [230, 868], [231, 869], [232, 870], [233, 871], [234, 872], [235, 873], [236, 874]]);
var n25 = t([[0, 16], [1, 9], [2, 875], [3, 876], [4, 877], [5, 878], [6, 879], [7, 880], [8, 881], [9, 882], [10, 883], [11, 884], [12, 885], [13, 886], [14, 887], [15, 548], [16, 888], [17, 889], [18, 890], [19, 891], [20, 892], [21, 893], [22, 894], [23, 895], [24, 890], [25, 895], [26, 890], [27, 889], [28, 881], [29, 882], [30, 880], [31, 882], [32, 881], [33, 883], [34, 884], [35, 883], [36, 882], [37, 548], [38, 891], [224, 896], [225, 897], [226, 898], [227, 899], [228, 900], [229, 901], [230, 902], [231, 903], [232, 904], [233, 905], [234, 906], [235, 907], [236, 908]]);
var n26 = t([[0, 16], [1, 9], [2, 909], [3, 910], [4, 911], [5, 912], [6, 913], [7, 914], [8, 915], [9, 916], [10, 917], [11, 918], [12, 919], [13, 920], [14, 921], [15, 583], [16, 922], [17, 923], [18, 924], [19, 925], [20, 926], [21, 927], [22, 928], [23, 929], [24, 924], [25, 929], [26, 924], [27, 923], [28, 915], [29, 916], [30, 914], [31, 916], [32, 915], [33, 917], [34, 918], [35, 917], [36, 916], [37, 583], [38, 925], [224, 930], [225, 931], [226, 932], [227, 933], [228, 934], [229, 935], [230, 936], [231, 937], [232, 938], [233, 939], [234, 940], [235, 941], [236, 942]]);
var n27 = t([[0, 16], [1, 9], [2, 943], [3, 944], [4, 945], [5, 946], [6, 947], [7, 948], [8, 949], [9, 950], [10, 951], [11, 952], [12, 953], [13, 954], [14, 955], [15, 618], [16, 956], [17, 957], [18, 958], [19, 959], [20, 960], [21, 961], [22, 962], [23, 963], [24, 958], [25, 963], [26, 958], [27, 957], [28, 949], [29, 950], [30, 948], [31, 950], [32, 949], [33, 951], [34, 952], [35, 951], [36, 950], [37, 618], [38, 959], [224, 964], [225, 965], [226, 966], [227, 967], [228, 968], [229, 969], [230, 970], [231, 971], [232, 972], [233, 973], [234, 974], [235, 975], [236, 976]]);
var n28 = t([[0, 16], [1, 9], [2, 640], [3, 641], [4, 642], [5, 643], [6, 644], [7, 645], [8, 646], [9, 647], [10, 13], [11, 648], [12, 649], [13, 650], [14, 196], [15, 651], [16, 652], [17, 653], [18, 654], [19, 655], [20, 656], [21, 657], [22, 658], [23, 659], [24, 654], [25, 659], [26, 654], [27, 653], [28, 646], [29, 647], [30, 645], [31, 647], [32, 646], [33, 13], [34, 648], [35, 13], [36, 647], [37, 651], [38, 655], [224, 660], [225, 661], [226, 662], [227, 663], [228, 664], [229, 665], [230, 666], [231, 667], [232, 668], [233, 669], [234, 670], [235, 671], [236, 672]]);
var n29 = t([[24, 17], [25, 17], [26, 17], [27, 18], [28, 9], [29, 8], [30, 10], [31, 11], [32, 9], [33, 11], [34, 10], [35, 11], [36, 12], [224, 198], [225, 199], [226, 200], [227, 201], [228, 202], [229, 203], [230, 204], [231, 205], [232, 206], [233, 207], [234, 208], [235, 209], [3, 3], [4, 4], [5, 5], [6, 6], [236, 210]]);
var n30 = t([[24, 17], [25, 17], [26, 17], [27, 18], [28, 10], [29, 9], [30, 11], [31, 13], [32, 10], [33, 12], [34, 11], [35, 12], [36, 13], [224, 198], [225, 199], [226, 200], [227, 201], [228, 202], [229, 203], [230, 204], [231, 205], [232, 206], [233, 207], [234, 208], [235, 209], [3, 3], [4, 4], [5, 5], [6, 6], [236, 210]]);
var n31 = t([[24, 11], [25, 7], [26, 11], [27, 1], [28, 0], [29, 17], [30, 193], [31, 16], [32, 0], [33, 16], [34, 194], [35, 16], [36, 17], [224, 326], [225, 327], [226, 328], [227, 329], [228, 330], [229, 331], [230, 332], [231, 333], [232, 334], [233, 335], [234, 336], [235, 337], [3, 212], [4, 213], [5, 214], [6, 215], [236, 338]]);
var n32 = t([[24, 11], [25, 7], [26, 11], [27, 1], [28, 17], [29, 16], [30, 0], [31, 195], [32, 17], [33, 194], [34, 195], [35, 194], [36, 16], [224, 326], [225, 327], [226, 328], [227, 329], [228, 330], [229, 331], [230, 332], [231, 333], [232, 334], [233, 335], [234, 336], [235, 337], [3, 212], [4, 213], [5, 214], [6, 215], [236, 338]]);
var n33 = t([[0, 1], [1, 0], [2, 2], [3, 212], [4, 213], [5, 214], [6, 215], [7, 7], [8, 11], [9, 1], [10, 197], [11, 196], [12, 195], [13, 194], [14, 16], [15, 17], [16, 0], [17, 193], [18, 192], [19, 211], [20, 977], [21, 978], [22, 979], [23, 980], [24, 192], [25, 192], [26, 192], [27, 980], [28, 11], [29, 7], [30, 1], [31, 1], [32, 11], [33, 197], [34, 1], [35, 197], [36, 196], [37, 17], [38, 211], [224, 326], [225, 327], [226, 328], [227, 329], [228, 330], [229, 331], [230, 332], [231, 333], [232, 334], [233, 335], [234, 336], [235, 337], [236, 338]]);
var n34 = t([[24, 11], [25, 11], [26, 11], [27, 7], [28, 0], [29, 193], [30, 17], [31, 16], [32, 0], [33, 16], [34, 17], [35, 16], [36, 194], [224, 326], [225, 327], [226, 328], [227, 329], [228, 330], [229, 331], [230, 332], [231, 333], [232, 334], [233, 335], [234, 336], [235, 337], [3, 212], [4, 213], [5, 214], [6, 215], [236, 338]]);
var n35 = t([[24, 11], [25, 11], [26, 11], [27, 7], [28, 17], [29, 0], [30, 16], [31, 195], [32, 17], [33, 194], [34, 16], [35, 194], [36, 195], [224, 326], [225, 327], [226, 328], [227, 329], [228, 330], [229, 331], [230, 332], [231, 333], [232, 334], [233, 335], [234, 336], [235, 337], [3, 212], [4, 213], [5, 214], [6, 215], [236, 338]]);
var n36 = t([[0, 1], [1, 0], [2, 19], [3, 3], [4, 4], [5, 5], [6, 6], [7, 18], [8, 17], [9, 16], [10, 15], [11, 14], [12, 13], [13, 12], [14, 11], [15, 10], [16, 9], [17, 8], [18, 7], [19, 2], [20, 216], [21, 217], [22, 218], [23, 219], [24, 7], [25, 7], [26, 7], [27, 219], [28, 17], [29, 18], [30, 16], [31, 16], [32, 17], [33, 15], [34, 16], [35, 15], [36, 14], [37, 10], [38, 2], [224, 198], [225, 199], [226, 200], [227, 201], [228, 202], [229, 203], [230, 204], [231, 205], [232, 206], [233, 207], [234, 208], [235, 209], [236, 210]]);
var n37 = t([[0, 1], [1, 0], [2, 355], [3, 340], [4, 341], [5, 342], [6, 343], [7, 354], [8, 353], [9, 352], [10, 351], [11, 350], [12, 349], [13, 10], [14, 348], [15, 347], [16, 346], [17, 345], [18, 344], [19, 339], [20, 981], [21, 982], [22, 983], [23, 984], [24, 344], [25, 344], [26, 344], [27, 984], [28, 353], [29, 354], [30, 352], [31, 352], [32, 353], [33, 351], [34, 352], [35, 351], [36, 350], [37, 347], [38, 339], [224, 360], [225, 361], [226, 362], [227, 363], [228, 364], [229, 365], [230, 366], [231, 367], [232, 368], [233, 369], [234, 370], [235, 371], [236, 372]]);
var n38 = t([[24, 353], [25, 353], [26, 353], [27, 354], [28, 346], [29, 345], [30, 347], [31, 348], [32, 346], [33, 348], [34, 347], [35, 348], [36, 10], [224, 360], [225, 361], [226, 362], [227, 363], [228, 364], [229, 365], [230, 366], [231, 367], [232, 368], [233, 369], [234, 370], [235, 371], [3, 340], [4, 341], [5, 342], [6, 343], [236, 372]]);
var n39 = t([[24, 353], [25, 353], [26, 353], [27, 354], [28, 347], [29, 346], [30, 348], [31, 349], [32, 347], [33, 10], [34, 348], [35, 10], [36, 349], [224, 360], [225, 361], [226, 362], [227, 363], [228, 364], [229, 365], [230, 366], [231, 367], [232, 368], [233, 369], [234, 370], [235, 371], [3, 340], [4, 341], [5, 342], [6, 343], [236, 372]]);
var n40 = t([[0, 1], [1, 0], [2, 390], [3, 374], [4, 375], [5, 376], [6, 377], [7, 389], [8, 388], [9, 387], [10, 386], [11, 385], [12, 384], [13, 383], [14, 382], [15, 381], [16, 380], [17, 379], [18, 378], [19, 373], [20, 985], [21, 986], [22, 987], [23, 988], [24, 378], [25, 378], [26, 378], [27, 988], [28, 388], [29, 389], [30, 387], [31, 387], [32, 388], [33, 386], [34, 387], [35, 386], [36, 385], [37, 381], [38, 373], [224, 395], [225, 396], [226, 397], [227, 398], [228, 399], [229, 400], [230, 401], [231, 402], [232, 403], [233, 404], [234, 405], [235, 406], [236, 407]]);
var n41 = t([[24, 388], [25, 388], [26, 388], [27, 389], [28, 380], [29, 379], [30, 381], [31, 382], [32, 380], [33, 382], [34, 381], [35, 382], [36, 383], [224, 395], [225, 396], [226, 397], [227, 398], [228, 399], [229, 400], [230, 401], [231, 402], [232, 403], [233, 404], [234, 405], [235, 406], [3, 374], [4, 375], [5, 376], [6, 377], [236, 407]]);
var n42 = t([[24, 388], [25, 388], [26, 388], [27, 389], [28, 381], [29, 380], [30, 382], [31, 384], [32, 381], [33, 383], [34, 382], [35, 383], [36, 384], [224, 395], [225, 396], [226, 397], [227, 398], [228, 399], [229, 400], [230, 401], [231, 402], [232, 403], [233, 404], [234, 405], [235, 406], [3, 374], [4, 375], [5, 376], [6, 377], [236, 407]]);
var n43 = t([[0, 1], [1, 0], [2, 425], [3, 409], [4, 410], [5, 411], [6, 412], [7, 424], [8, 423], [9, 422], [10, 421], [11, 420], [12, 419], [13, 418], [14, 417], [15, 416], [16, 415], [17, 414], [18, 413], [19, 408], [20, 989], [21, 990], [22, 991], [23, 992], [24, 413], [25, 413], [26, 413], [27, 992], [28, 423], [29, 424], [30, 422], [31, 422], [32, 423], [33, 421], [34, 422], [35, 421], [36, 420], [37, 416], [38, 408], [224, 430], [225, 431], [226, 432], [227, 433], [228, 434], [229, 435], [230, 436], [231, 437], [232, 438], [233, 439], [234, 440], [235, 441], [236, 442]]);
var n44 = t([[24, 423], [25, 423], [26, 423], [27, 424], [28, 415], [29, 414], [30, 416], [31, 417], [32, 415], [33, 417], [34, 416], [35, 417], [36, 418], [224, 430], [225, 431], [226, 432], [227, 433], [228, 434], [229, 435], [230, 436], [231, 437], [232, 438], [233, 439], [234, 440], [235, 441], [3, 409], [4, 410], [5, 411], [6, 412], [236, 442]]);
var n45 = t([[24, 423], [25, 423], [26, 423], [27, 424], [28, 416], [29, 415], [30, 417], [31, 419], [32, 416], [33, 418], [34, 417], [35, 418], [36, 419], [224, 430], [225, 431], [226, 432], [227, 433], [228, 434], [229, 435], [230, 436], [231, 437], [232, 438], [233, 439], [234, 440], [235, 441], [3, 409], [4, 410], [5, 411], [6, 412], [236, 442]]);
var n46 = t([[0, 1], [1, 0], [2, 453], [3, 216], [4, 217], [5, 218], [6, 219], [7, 452], [8, 451], [9, 450], [10, 449], [11, 448], [12, 447], [13, 446], [14, 445], [15, 444], [16, 443], [17, 7], [18, 7], [19, 2], [20, 216], [21, 217], [22, 218], [23, 219], [24, 7], [25, 7], [26, 7], [27, 219], [28, 451], [29, 452], [30, 450], [31, 450], [32, 451], [33, 449], [34, 450], [35, 449], [36, 448], [37, 444], [38, 2], [224, 458], [225, 459], [226, 460], [227, 461], [228, 462], [229, 463], [230, 326], [231, 327], [232, 328], [233, 329], [234, 330], [235, 331], [236, 464]]);
var n47 = t([[24, 451], [25, 451], [26, 451], [27, 452], [28, 443], [29, 7], [30, 444], [31, 445], [32, 443], [33, 445], [34, 444], [35, 445], [36, 446], [224, 458], [225, 459], [226, 460], [227, 461], [228, 462], [229, 463], [230, 326], [231, 327], [232, 328], [233, 329], [234, 330], [235, 331], [3, 216], [4, 217], [5, 218], [6, 219], [236, 464]]);
var n48 = t([[24, 451], [25, 451], [26, 451], [27, 452], [28, 444], [29, 443], [30, 445], [31, 447], [32, 444], [33, 446], [34, 445], [35, 446], [36, 447], [224, 458], [225, 459], [226, 460], [227, 461], [228, 462], [229, 463], [230, 326], [231, 327], [232, 328], [233, 329], [234, 330], [235, 331], [3, 216], [4, 217], [5, 218], [6, 219], [236, 464]]);
var n49 = t([[0, 1], [1, 0], [2, 482], [3, 466], [4, 467], [5, 468], [6, 469], [7, 481], [8, 480], [9, 479], [10, 478], [11, 477], [12, 476], [13, 475], [14, 474], [15, 473], [16, 472], [17, 471], [18, 470], [19, 465], [20, 993], [21, 994], [22, 995], [23, 996], [24, 470], [25, 470], [26, 470], [27, 996], [28, 480], [29, 481], [30, 479], [31, 479], [32, 480], [33, 478], [34, 479], [35, 478], [36, 477], [37, 473], [38, 465], [224, 487], [225, 488], [226, 489], [227, 490], [228, 491], [229, 492], [230, 493], [231, 494], [232, 495], [233, 496], [234, 497], [235, 498], [236, 499]]);
var n50 = t([[24, 480], [25, 480], [26, 480], [27, 481], [28, 472], [29, 471], [30, 473], [31, 474], [32, 472], [33, 474], [34, 473], [35, 474], [36, 475], [224, 487], [225, 488], [226, 489], [227, 490], [228, 491], [229, 492], [230, 493], [231, 494], [232, 495], [233, 496], [234, 497], [235, 498], [3, 466], [4, 467], [5, 468], [6, 469], [236, 499]]);
var n51 = t([[24, 480], [25, 480], [26, 480], [27, 481], [28, 473], [29, 472], [30, 474], [31, 476], [32, 473], [33, 475], [34, 474], [35, 475], [36, 476], [224, 487], [225, 488], [226, 489], [227, 490], [228, 491], [229, 492], [230, 493], [231, 494], [232, 495], [233, 496], [234, 497], [235, 498], [3, 466], [4, 467], [5, 468], [6, 469], [236, 499]]);
var n52 = t([[0, 1], [1, 0], [2, 517], [3, 501], [4, 502], [5, 503], [6, 504], [7, 516], [8, 515], [9, 514], [10, 513], [11, 512], [12, 511], [13, 510], [14, 509], [15, 508], [16, 507], [17, 506], [18, 505], [19, 500], [20, 997], [21, 998], [22, 999], [23, 1e3], [24, 505], [25, 505], [26, 505], [27, 1e3], [28, 515], [29, 516], [30, 514], [31, 514], [32, 515], [33, 513], [34, 514], [35, 513], [36, 512], [37, 508], [38, 500], [224, 522], [225, 523], [226, 524], [227, 525], [228, 526], [229, 527], [230, 528], [231, 529], [232, 530], [233, 531], [234, 532], [235, 533], [236, 534]]);
var n53 = t([[24, 515], [25, 515], [26, 515], [27, 516], [28, 507], [29, 506], [30, 508], [31, 509], [32, 507], [33, 509], [34, 508], [35, 509], [36, 510], [224, 522], [225, 523], [226, 524], [227, 525], [228, 526], [229, 527], [230, 528], [231, 529], [232, 530], [233, 531], [234, 532], [235, 533], [3, 501], [4, 502], [5, 503], [6, 504], [236, 534]]);
var n54 = t([[24, 515], [25, 515], [26, 515], [27, 516], [28, 508], [29, 507], [30, 509], [31, 511], [32, 508], [33, 510], [34, 509], [35, 510], [36, 511], [224, 522], [225, 523], [226, 524], [227, 525], [228, 526], [229, 527], [230, 528], [231, 529], [232, 530], [233, 531], [234, 532], [235, 533], [3, 501], [4, 502], [5, 503], [6, 504], [236, 534]]);
var n55 = t([[0, 1], [1, 0], [2, 552], [3, 536], [4, 537], [5, 538], [6, 539], [7, 551], [8, 550], [9, 549], [10, 548], [11, 547], [12, 546], [13, 545], [14, 544], [15, 543], [16, 542], [17, 541], [18, 540], [19, 535], [20, 1001], [21, 1002], [22, 1003], [23, 1004], [24, 540], [25, 540], [26, 540], [27, 1004], [28, 550], [29, 551], [30, 549], [31, 549], [32, 550], [33, 548], [34, 549], [35, 548], [36, 547], [37, 543], [38, 535], [224, 557], [225, 558], [226, 559], [227, 560], [228, 561], [229, 562], [230, 563], [231, 564], [232, 565], [233, 566], [234, 567], [235, 568], [236, 569]]);
var n56 = t([[24, 550], [25, 550], [26, 550], [27, 551], [28, 542], [29, 541], [30, 543], [31, 544], [32, 542], [33, 544], [34, 543], [35, 544], [36, 545], [224, 557], [225, 558], [226, 559], [227, 560], [228, 561], [229, 562], [230, 563], [231, 564], [232, 565], [233, 566], [234, 567], [235, 568], [3, 536], [4, 537], [5, 538], [6, 539], [236, 569]]);
var n57 = t([[24, 550], [25, 550], [26, 550], [27, 551], [28, 543], [29, 542], [30, 544], [31, 546], [32, 543], [33, 545], [34, 544], [35, 545], [36, 546], [224, 557], [225, 558], [226, 559], [227, 560], [228, 561], [229, 562], [230, 563], [231, 564], [232, 565], [233, 566], [234, 567], [235, 568], [3, 536], [4, 537], [5, 538], [6, 539], [236, 569]]);
var n58 = t([[0, 1], [1, 0], [2, 587], [3, 571], [4, 572], [5, 573], [6, 574], [7, 586], [8, 585], [9, 584], [10, 583], [11, 582], [12, 581], [13, 580], [14, 579], [15, 578], [16, 577], [17, 576], [18, 575], [19, 570], [20, 1005], [21, 1006], [22, 1007], [23, 1008], [24, 575], [25, 575], [26, 575], [27, 1008], [28, 585], [29, 586], [30, 584], [31, 584], [32, 585], [33, 583], [34, 584], [35, 583], [36, 582], [37, 578], [38, 570], [224, 592], [225, 593], [226, 594], [227, 595], [228, 596], [229, 597], [230, 598], [231, 599], [232, 600], [233, 601], [234, 602], [235, 603], [236, 604]]);
var n59 = t([[24, 585], [25, 585], [26, 585], [27, 586], [28, 577], [29, 576], [30, 578], [31, 579], [32, 577], [33, 579], [34, 578], [35, 579], [36, 580], [224, 592], [225, 593], [226, 594], [227, 595], [228, 596], [229, 597], [230, 598], [231, 599], [232, 600], [233, 601], [234, 602], [235, 603], [3, 571], [4, 572], [5, 573], [6, 574], [236, 604]]);
var n60 = t([[24, 585], [25, 585], [26, 585], [27, 586], [28, 578], [29, 577], [30, 579], [31, 581], [32, 578], [33, 580], [34, 579], [35, 580], [36, 581], [224, 592], [225, 593], [226, 594], [227, 595], [228, 596], [229, 597], [230, 598], [231, 599], [232, 600], [233, 601], [234, 602], [235, 603], [3, 571], [4, 572], [5, 573], [6, 574], [236, 604]]);
var n61 = t([[0, 1], [1, 0], [2, 622], [3, 606], [4, 607], [5, 608], [6, 609], [7, 621], [8, 620], [9, 619], [10, 618], [11, 617], [12, 616], [13, 615], [14, 614], [15, 613], [16, 612], [17, 611], [18, 610], [19, 605], [20, 1009], [21, 1010], [22, 1011], [23, 1012], [24, 610], [25, 610], [26, 610], [27, 1012], [28, 620], [29, 621], [30, 619], [31, 619], [32, 620], [33, 618], [34, 619], [35, 618], [36, 617], [37, 613], [38, 605], [224, 627], [225, 628], [226, 629], [227, 630], [228, 631], [229, 632], [230, 633], [231, 634], [232, 635], [233, 636], [234, 637], [235, 638], [236, 639]]);
var n62 = t([[24, 620], [25, 620], [26, 620], [27, 621], [28, 612], [29, 611], [30, 613], [31, 614], [32, 612], [33, 614], [34, 613], [35, 614], [36, 615], [224, 627], [225, 628], [226, 629], [227, 630], [228, 631], [229, 632], [230, 633], [231, 634], [232, 635], [233, 636], [234, 637], [235, 638], [3, 606], [4, 607], [5, 608], [6, 609], [236, 639]]);
var n63 = t([[24, 620], [25, 620], [26, 620], [27, 621], [28, 613], [29, 612], [30, 614], [31, 616], [32, 613], [33, 615], [34, 614], [35, 615], [36, 616], [224, 627], [225, 628], [226, 629], [227, 630], [228, 631], [229, 632], [230, 633], [231, 634], [232, 635], [233, 636], [234, 637], [235, 638], [3, 606], [4, 607], [5, 608], [6, 609], [236, 639]]);
var n64 = t([[0, 1], [1, 0], [2, 655], [3, 641], [4, 642], [5, 643], [6, 644], [7, 654], [8, 653], [9, 652], [10, 651], [11, 196], [12, 650], [13, 649], [14, 648], [15, 13], [16, 647], [17, 646], [18, 645], [19, 640], [20, 1013], [21, 1014], [22, 1015], [23, 1016], [24, 645], [25, 645], [26, 645], [27, 1016], [28, 653], [29, 654], [30, 652], [31, 652], [32, 653], [33, 651], [34, 652], [35, 651], [36, 196], [37, 13], [38, 640], [224, 660], [225, 661], [226, 662], [227, 663], [228, 664], [229, 665], [230, 666], [231, 667], [232, 668], [233, 669], [234, 670], [235, 671], [236, 672]]);
var n65 = t([[24, 653], [25, 653], [26, 653], [27, 654], [28, 647], [29, 646], [30, 13], [31, 648], [32, 647], [33, 648], [34, 13], [35, 648], [36, 649], [224, 660], [225, 661], [226, 662], [227, 663], [228, 664], [229, 665], [230, 666], [231, 667], [232, 668], [233, 669], [234, 670], [235, 671], [3, 641], [4, 642], [5, 643], [6, 644], [236, 672]]);
var n66 = t([[24, 653], [25, 653], [26, 653], [27, 654], [28, 13], [29, 647], [30, 648], [31, 650], [32, 13], [33, 649], [34, 648], [35, 649], [36, 650], [224, 660], [225, 661], [226, 662], [227, 663], [228, 664], [229, 665], [230, 666], [231, 667], [232, 668], [233, 669], [234, 670], [235, 671], [3, 641], [4, 642], [5, 643], [6, 644], [236, 672]]);
var n67 = t([[0, 9], [1, 16], [2, 2], [3, 212], [4, 213], [5, 214], [6, 215], [7, 7], [8, 11], [9, 1], [10, 197], [11, 196], [12, 195], [13, 194], [14, 16], [15, 17], [16, 0], [17, 193], [18, 192], [19, 211], [20, 977], [21, 978], [22, 979], [23, 980], [24, 192], [25, 980], [26, 192], [27, 193], [28, 11], [29, 1], [30, 7], [31, 1], [32, 11], [33, 197], [34, 196], [35, 197], [36, 1], [37, 17], [38, 211], [224, 326], [225, 327], [226, 328], [227, 329], [228, 330], [229, 331], [230, 332], [231, 333], [232, 334], [233, 335], [234, 336], [235, 337], [236, 338]]);
var n68 = t([[0, 9], [1, 16], [2, 19], [3, 3], [4, 4], [5, 5], [6, 6], [7, 18], [8, 17], [9, 16], [10, 15], [11, 14], [12, 13], [13, 12], [14, 11], [15, 10], [16, 9], [17, 8], [18, 7], [19, 2], [20, 216], [21, 217], [22, 218], [23, 219], [24, 7], [25, 219], [26, 7], [27, 8], [28, 17], [29, 16], [30, 18], [31, 16], [32, 17], [33, 15], [34, 14], [35, 15], [36, 16], [37, 10], [38, 2], [224, 198], [225, 199], [226, 200], [227, 201], [228, 202], [229, 203], [230, 204], [231, 205], [232, 206], [233, 207], [234, 208], [235, 209], [236, 210]]);
var n69 = t([[24, 17], [25, 18], [26, 17], [27, 16], [28, 9], [29, 10], [30, 8], [31, 11], [32, 9], [33, 11], [34, 12], [35, 11], [36, 10], [224, 198], [225, 199], [226, 200], [227, 201], [228, 202], [229, 203], [230, 204], [231, 205], [232, 206], [233, 207], [234, 208], [235, 209], [3, 3], [4, 4], [5, 5], [6, 6], [236, 210]]);
var n70 = t([[24, 17], [25, 18], [26, 17], [27, 16], [28, 10], [29, 11], [30, 9], [31, 13], [32, 10], [33, 12], [34, 13], [35, 12], [36, 11], [224, 198], [225, 199], [226, 200], [227, 201], [228, 202], [229, 203], [230, 204], [231, 205], [232, 206], [233, 207], [234, 208], [235, 209], [3, 3], [4, 4], [5, 5], [6, 6], [236, 210]]);
var n71 = t([[0, 9], [1, 16], [2, 686], [3, 674], [4, 675], [5, 676], [6, 677], [7, 9], [8, 685], [9, 684], [10, 683], [11, 653], [12, 682], [13, 681], [14, 680], [15, 679], [16, 354], [17, 0], [18, 678], [19, 673], [20, 1017], [21, 1018], [22, 1019], [23, 1020], [24, 678], [25, 1020], [26, 678], [27, 0], [28, 685], [29, 684], [30, 9], [31, 684], [32, 685], [33, 683], [34, 653], [35, 683], [36, 684], [37, 679], [38, 673], [224, 691], [225, 692], [226, 693], [227, 694], [228, 695], [229, 696], [230, 697], [231, 698], [232, 699], [233, 700], [234, 701], [235, 702], [236, 703]]);
var n72 = t([[24, 685], [25, 9], [26, 685], [27, 684], [28, 354], [29, 679], [30, 0], [31, 680], [32, 354], [33, 680], [34, 681], [35, 680], [36, 679], [224, 691], [225, 692], [226, 693], [227, 694], [228, 695], [229, 696], [230, 697], [231, 698], [232, 699], [233, 700], [234, 701], [235, 702], [3, 674], [4, 675], [5, 676], [6, 677], [236, 703]]);
var n73 = t([[24, 685], [25, 9], [26, 685], [27, 684], [28, 679], [29, 680], [30, 354], [31, 682], [32, 679], [33, 681], [34, 682], [35, 681], [36, 680], [224, 691], [225, 692], [226, 693], [227, 694], [228, 695], [229, 696], [230, 697], [231, 698], [232, 699], [233, 700], [234, 701], [235, 702], [3, 674], [4, 675], [5, 676], [6, 677], [236, 703]]);
var n74 = t([[0, 9], [1, 16], [2, 720], [3, 705], [4, 706], [5, 707], [6, 708], [7, 719], [8, 718], [9, 717], [10, 386], [11, 716], [12, 715], [13, 714], [14, 713], [15, 712], [16, 711], [17, 710], [18, 709], [19, 704], [20, 1021], [21, 1022], [22, 1023], [23, 1024], [24, 709], [25, 1024], [26, 709], [27, 710], [28, 718], [29, 717], [30, 719], [31, 717], [32, 718], [33, 386], [34, 716], [35, 386], [36, 717], [37, 712], [38, 704], [224, 725], [225, 726], [226, 727], [227, 728], [228, 729], [229, 730], [230, 731], [231, 732], [232, 733], [233, 734], [234, 735], [235, 736], [236, 737]]);
var n75 = t([[24, 718], [25, 719], [26, 718], [27, 717], [28, 711], [29, 712], [30, 710], [31, 713], [32, 711], [33, 713], [34, 714], [35, 713], [36, 712], [224, 725], [225, 726], [226, 727], [227, 728], [228, 729], [229, 730], [230, 731], [231, 732], [232, 733], [233, 734], [234, 735], [235, 736], [3, 705], [4, 706], [5, 707], [6, 708], [236, 737]]);
var n76 = t([[24, 718], [25, 719], [26, 718], [27, 717], [28, 712], [29, 713], [30, 711], [31, 715], [32, 712], [33, 714], [34, 715], [35, 714], [36, 713], [224, 725], [225, 726], [226, 727], [227, 728], [228, 729], [229, 730], [230, 731], [231, 732], [232, 733], [233, 734], [234, 735], [235, 736], [3, 705], [4, 706], [5, 707], [6, 708], [236, 737]]);
var n77 = t([[0, 9], [1, 16], [2, 754], [3, 739], [4, 740], [5, 741], [6, 742], [7, 753], [8, 752], [9, 751], [10, 421], [11, 750], [12, 749], [13, 748], [14, 747], [15, 746], [16, 745], [17, 744], [18, 743], [19, 738], [20, 1025], [21, 1026], [22, 1027], [23, 1028], [24, 743], [25, 1028], [26, 743], [27, 744], [28, 752], [29, 751], [30, 753], [31, 751], [32, 752], [33, 421], [34, 750], [35, 421], [36, 751], [37, 746], [38, 738], [224, 759], [225, 760], [226, 761], [227, 762], [228, 763], [229, 764], [230, 765], [231, 766], [232, 767], [233, 768], [234, 769], [235, 770], [236, 771]]);
var n78 = t([[24, 752], [25, 753], [26, 752], [27, 751], [28, 745], [29, 746], [30, 744], [31, 747], [32, 745], [33, 747], [34, 748], [35, 747], [36, 746], [224, 759], [225, 760], [226, 761], [227, 762], [228, 763], [229, 764], [230, 765], [231, 766], [232, 767], [233, 768], [234, 769], [235, 770], [3, 739], [4, 740], [5, 741], [6, 742], [236, 771]]);
var n79 = t([[24, 752], [25, 753], [26, 752], [27, 751], [28, 746], [29, 747], [30, 745], [31, 749], [32, 746], [33, 748], [34, 749], [35, 748], [36, 747], [224, 759], [225, 760], [226, 761], [227, 762], [228, 763], [229, 764], [230, 765], [231, 766], [232, 767], [233, 768], [234, 769], [235, 770], [3, 739], [4, 740], [5, 741], [6, 742], [236, 771]]);
var n80 = t([[0, 9], [1, 16], [2, 789], [3, 773], [4, 774], [5, 775], [6, 776], [7, 788], [8, 787], [9, 786], [10, 785], [11, 784], [12, 783], [13, 782], [14, 781], [15, 780], [16, 779], [17, 778], [18, 777], [19, 772], [20, 1029], [21, 1030], [22, 1031], [23, 1032], [24, 777], [25, 1032], [26, 777], [27, 778], [28, 787], [29, 786], [30, 788], [31, 786], [32, 787], [33, 785], [34, 784], [35, 785], [36, 786], [37, 780], [38, 772], [224, 794], [225, 795], [226, 796], [227, 797], [228, 798], [229, 799], [230, 800], [231, 801], [232, 802], [233, 803], [234, 804], [235, 805], [236, 806]]);
var n81 = t([[24, 787], [25, 788], [26, 787], [27, 786], [28, 779], [29, 780], [30, 778], [31, 781], [32, 779], [33, 781], [34, 782], [35, 781], [36, 780], [224, 794], [225, 795], [226, 796], [227, 797], [228, 798], [229, 799], [230, 800], [231, 801], [232, 802], [233, 803], [234, 804], [235, 805], [3, 773], [4, 774], [5, 775], [6, 776], [236, 806]]);
var n82 = t([[24, 787], [25, 788], [26, 787], [27, 786], [28, 780], [29, 781], [30, 779], [31, 783], [32, 780], [33, 782], [34, 783], [35, 782], [36, 781], [224, 794], [225, 795], [226, 796], [227, 797], [228, 798], [229, 799], [230, 800], [231, 801], [232, 802], [233, 803], [234, 804], [235, 805], [3, 773], [4, 774], [5, 775], [6, 776], [236, 806]]);
var n83 = t([[0, 9], [1, 16], [2, 823], [3, 808], [4, 809], [5, 810], [6, 811], [7, 822], [8, 821], [9, 820], [10, 478], [11, 819], [12, 818], [13, 817], [14, 816], [15, 815], [16, 814], [17, 813], [18, 812], [19, 807], [20, 1033], [21, 1034], [22, 1035], [23, 1036], [24, 812], [25, 1036], [26, 812], [27, 813], [28, 821], [29, 820], [30, 822], [31, 820], [32, 821], [33, 478], [34, 819], [35, 478], [36, 820], [37, 815], [38, 807], [224, 828], [225, 829], [226, 830], [227, 831], [228, 832], [229, 833], [230, 834], [231, 835], [232, 836], [233, 837], [234, 838], [235, 839], [236, 840]]);
var n84 = t([[24, 821], [25, 822], [26, 821], [27, 820], [28, 814], [29, 815], [30, 813], [31, 816], [32, 814], [33, 816], [34, 817], [35, 816], [36, 815], [224, 828], [225, 829], [226, 830], [227, 831], [228, 832], [229, 833], [230, 834], [231, 835], [232, 836], [233, 837], [234, 838], [235, 839], [3, 808], [4, 809], [5, 810], [6, 811], [236, 840]]);
var n85 = t([[24, 821], [25, 822], [26, 821], [27, 820], [28, 815], [29, 816], [30, 814], [31, 818], [32, 815], [33, 817], [34, 818], [35, 817], [36, 816], [224, 828], [225, 829], [226, 830], [227, 831], [228, 832], [229, 833], [230, 834], [231, 835], [232, 836], [233, 837], [234, 838], [235, 839], [3, 808], [4, 809], [5, 810], [6, 811], [236, 840]]);
var n86 = t([[0, 9], [1, 16], [2, 857], [3, 842], [4, 843], [5, 844], [6, 845], [7, 856], [8, 855], [9, 854], [10, 513], [11, 853], [12, 852], [13, 851], [14, 850], [15, 849], [16, 848], [17, 847], [18, 846], [19, 841], [20, 1037], [21, 1038], [22, 1039], [23, 1040], [24, 846], [25, 1040], [26, 846], [27, 847], [28, 855], [29, 854], [30, 856], [31, 854], [32, 855], [33, 513], [34, 853], [35, 513], [36, 854], [37, 849], [38, 841], [224, 862], [225, 863], [226, 864], [227, 865], [228, 866], [229, 867], [230, 868], [231, 869], [232, 870], [233, 871], [234, 872], [235, 873], [236, 874]]);
var n87 = t([[24, 855], [25, 856], [26, 855], [27, 854], [28, 848], [29, 849], [30, 847], [31, 850], [32, 848], [33, 850], [34, 851], [35, 850], [36, 849], [224, 862], [225, 863], [226, 864], [227, 865], [228, 866], [229, 867], [230, 868], [231, 869], [232, 870], [233, 871], [234, 872], [235, 873], [3, 842], [4, 843], [5, 844], [6, 845], [236, 874]]);
var n88 = t([[24, 855], [25, 856], [26, 855], [27, 854], [28, 849], [29, 850], [30, 848], [31, 852], [32, 849], [33, 851], [34, 852], [35, 851], [36, 850], [224, 862], [225, 863], [226, 864], [227, 865], [228, 866], [229, 867], [230, 868], [231, 869], [232, 870], [233, 871], [234, 872], [235, 873], [3, 842], [4, 843], [5, 844], [6, 845], [236, 874]]);
var n89 = t([[0, 9], [1, 16], [2, 891], [3, 876], [4, 877], [5, 878], [6, 879], [7, 890], [8, 889], [9, 888], [10, 548], [11, 887], [12, 886], [13, 885], [14, 884], [15, 883], [16, 882], [17, 881], [18, 880], [19, 875], [20, 1041], [21, 1042], [22, 1043], [23, 1044], [24, 880], [25, 1044], [26, 880], [27, 881], [28, 889], [29, 888], [30, 890], [31, 888], [32, 889], [33, 548], [34, 887], [35, 548], [36, 888], [37, 883], [38, 875], [224, 896], [225, 897], [226, 898], [227, 899], [228, 900], [229, 901], [230, 902], [231, 903], [232, 904], [233, 905], [234, 906], [235, 907], [236, 908]]);
var n90 = t([[24, 889], [25, 890], [26, 889], [27, 888], [28, 882], [29, 883], [30, 881], [31, 884], [32, 882], [33, 884], [34, 885], [35, 884], [36, 883], [224, 896], [225, 897], [226, 898], [227, 899], [228, 900], [229, 901], [230, 902], [231, 903], [232, 904], [233, 905], [234, 906], [235, 907], [3, 876], [4, 877], [5, 878], [6, 879], [236, 908]]);
var n91 = t([[24, 889], [25, 890], [26, 889], [27, 888], [28, 883], [29, 884], [30, 882], [31, 886], [32, 883], [33, 885], [34, 886], [35, 885], [36, 884], [224, 896], [225, 897], [226, 898], [227, 899], [228, 900], [229, 901], [230, 902], [231, 903], [232, 904], [233, 905], [234, 906], [235, 907], [3, 876], [4, 877], [5, 878], [6, 879], [236, 908]]);
var n92 = t([[0, 9], [1, 16], [2, 925], [3, 910], [4, 911], [5, 912], [6, 913], [7, 924], [8, 923], [9, 922], [10, 583], [11, 921], [12, 920], [13, 919], [14, 918], [15, 917], [16, 916], [17, 915], [18, 914], [19, 909], [20, 1045], [21, 1046], [22, 1047], [23, 1048], [24, 914], [25, 1048], [26, 914], [27, 915], [28, 923], [29, 922], [30, 924], [31, 922], [32, 923], [33, 583], [34, 921], [35, 583], [36, 922], [37, 917], [38, 909], [224, 930], [225, 931], [226, 932], [227, 933], [228, 934], [229, 935], [230, 936], [231, 937], [232, 938], [233, 939], [234, 940], [235, 941], [236, 942]]);
var n93 = t([[24, 923], [25, 924], [26, 923], [27, 922], [28, 916], [29, 917], [30, 915], [31, 918], [32, 916], [33, 918], [34, 919], [35, 918], [36, 917], [224, 930], [225, 931], [226, 932], [227, 933], [228, 934], [229, 935], [230, 936], [231, 937], [232, 938], [233, 939], [234, 940], [235, 941], [3, 910], [4, 911], [5, 912], [6, 913], [236, 942]]);
var n94 = t([[24, 923], [25, 924], [26, 923], [27, 922], [28, 917], [29, 918], [30, 916], [31, 920], [32, 917], [33, 919], [34, 920], [35, 919], [36, 918], [224, 930], [225, 931], [226, 932], [227, 933], [228, 934], [229, 935], [230, 936], [231, 937], [232, 938], [233, 939], [234, 940], [235, 941], [3, 910], [4, 911], [5, 912], [6, 913], [236, 942]]);
var n95 = t([[0, 9], [1, 16], [2, 959], [3, 944], [4, 945], [5, 946], [6, 947], [7, 958], [8, 957], [9, 956], [10, 618], [11, 955], [12, 954], [13, 953], [14, 952], [15, 951], [16, 950], [17, 949], [18, 948], [19, 943], [20, 1049], [21, 1050], [22, 1051], [23, 1052], [24, 948], [25, 1052], [26, 948], [27, 949], [28, 957], [29, 956], [30, 958], [31, 956], [32, 957], [33, 618], [34, 955], [35, 618], [36, 956], [37, 951], [38, 943], [224, 964], [225, 965], [226, 966], [227, 967], [228, 968], [229, 969], [230, 970], [231, 971], [232, 972], [233, 973], [234, 974], [235, 975], [236, 976]]);
var n96 = t([[24, 957], [25, 958], [26, 957], [27, 956], [28, 950], [29, 951], [30, 949], [31, 952], [32, 950], [33, 952], [34, 953], [35, 952], [36, 951], [224, 964], [225, 965], [226, 966], [227, 967], [228, 968], [229, 969], [230, 970], [231, 971], [232, 972], [233, 973], [234, 974], [235, 975], [3, 944], [4, 945], [5, 946], [6, 947], [236, 976]]);
var n97 = t([[24, 957], [25, 958], [26, 957], [27, 956], [28, 951], [29, 952], [30, 950], [31, 954], [32, 951], [33, 953], [34, 954], [35, 953], [36, 952], [224, 964], [225, 965], [226, 966], [227, 967], [228, 968], [229, 969], [230, 970], [231, 971], [232, 972], [233, 973], [234, 974], [235, 975], [3, 944], [4, 945], [5, 946], [6, 947], [236, 976]]);
var n98 = t([[0, 9], [1, 16], [2, 655], [3, 641], [4, 642], [5, 643], [6, 644], [7, 654], [8, 653], [9, 652], [10, 651], [11, 196], [12, 650], [13, 649], [14, 648], [15, 13], [16, 647], [17, 646], [18, 645], [19, 640], [20, 1013], [21, 1014], [22, 1015], [23, 1016], [24, 645], [25, 1016], [26, 645], [27, 646], [28, 653], [29, 652], [30, 654], [31, 652], [32, 653], [33, 651], [34, 196], [35, 651], [36, 652], [37, 13], [38, 640], [224, 660], [225, 661], [226, 662], [227, 663], [228, 664], [229, 665], [230, 666], [231, 667], [232, 668], [233, 669], [234, 670], [235, 671], [236, 672]]);
var n99 = t([[24, 653], [25, 654], [26, 653], [27, 652], [28, 647], [29, 13], [30, 646], [31, 648], [32, 647], [33, 648], [34, 649], [35, 648], [36, 13], [224, 660], [225, 661], [226, 662], [227, 663], [228, 664], [229, 665], [230, 666], [231, 667], [232, 668], [233, 669], [234, 670], [235, 671], [3, 641], [4, 642], [5, 643], [6, 644], [236, 672]]);
var n100 = t([[24, 653], [25, 654], [26, 653], [27, 652], [28, 13], [29, 648], [30, 647], [31, 650], [32, 13], [33, 649], [34, 650], [35, 649], [36, 648], [224, 660], [225, 661], [226, 662], [227, 663], [228, 664], [229, 665], [230, 666], [231, 667], [232, 668], [233, 669], [234, 670], [235, 671], [3, 641], [4, 642], [5, 643], [6, 644], [236, 672]]);
var n101 = t([[24, 17], [25, 17], [26, 17], [27, 18], [28, 12], [29, 11], [30, 13], [31, 17], [32, 12], [33, 14], [34, 13], [35, 14], [36, 15], [224, 198], [225, 199], [226, 200], [227, 201], [228, 202], [229, 203], [230, 204], [231, 205], [232, 206], [233, 207], [234, 208], [235, 209], [3, 3], [4, 4], [5, 5], [6, 6], [236, 210]]);
var n102 = t([[24, 11], [25, 7], [26, 11], [27, 1], [28, 194], [29, 195], [30, 16], [31, 11], [32, 194], [33, 196], [34, 197], [35, 196], [36, 195], [224, 326], [225, 327], [226, 328], [227, 329], [228, 330], [229, 331], [230, 332], [231, 333], [232, 334], [233, 335], [234, 336], [235, 337], [3, 212], [4, 213], [5, 214], [6, 215], [236, 338]]);
var n103 = t([[24, 11], [25, 11], [26, 11], [27, 7], [28, 194], [29, 16], [30, 195], [31, 11], [32, 194], [33, 196], [34, 195], [35, 196], [36, 197], [224, 326], [225, 327], [226, 328], [227, 329], [228, 330], [229, 331], [230, 332], [231, 333], [232, 334], [233, 335], [234, 336], [235, 337], [3, 212], [4, 213], [5, 214], [6, 215], [236, 338]]);
var n104 = t([[24, 353], [25, 353], [26, 353], [27, 354], [28, 10], [29, 348], [30, 349], [31, 353], [32, 10], [33, 350], [34, 349], [35, 350], [36, 351], [224, 360], [225, 361], [226, 362], [227, 363], [228, 364], [229, 365], [230, 366], [231, 367], [232, 368], [233, 369], [234, 370], [235, 371], [3, 340], [4, 341], [5, 342], [6, 343], [236, 372]]);
var n105 = t([[24, 388], [25, 388], [26, 388], [27, 389], [28, 383], [29, 382], [30, 384], [31, 388], [32, 383], [33, 385], [34, 384], [35, 385], [36, 386], [224, 395], [225, 396], [226, 397], [227, 398], [228, 399], [229, 400], [230, 401], [231, 402], [232, 403], [233, 404], [234, 405], [235, 406], [3, 374], [4, 375], [5, 376], [6, 377], [236, 407]]);
var n106 = t([[24, 423], [25, 423], [26, 423], [27, 424], [28, 418], [29, 417], [30, 419], [31, 423], [32, 418], [33, 420], [34, 419], [35, 420], [36, 421], [224, 430], [225, 431], [226, 432], [227, 433], [228, 434], [229, 435], [230, 436], [231, 437], [232, 438], [233, 439], [234, 440], [235, 441], [3, 409], [4, 410], [5, 411], [6, 412], [236, 442]]);
var n107 = t([[24, 451], [25, 451], [26, 451], [27, 452], [28, 446], [29, 445], [30, 447], [31, 451], [32, 446], [33, 448], [34, 447], [35, 448], [36, 449], [224, 458], [225, 459], [226, 460], [227, 461], [228, 462], [229, 463], [230, 326], [231, 327], [232, 328], [233, 329], [234, 330], [235, 331], [3, 216], [4, 217], [5, 218], [6, 219], [236, 464]]);
var n108 = t([[24, 480], [25, 480], [26, 480], [27, 481], [28, 475], [29, 474], [30, 476], [31, 480], [32, 475], [33, 477], [34, 476], [35, 477], [36, 478], [224, 487], [225, 488], [226, 489], [227, 490], [228, 491], [229, 492], [230, 493], [231, 494], [232, 495], [233, 496], [234, 497], [235, 498], [3, 466], [4, 467], [5, 468], [6, 469], [236, 499]]);
var n109 = t([[24, 515], [25, 515], [26, 515], [27, 516], [28, 510], [29, 509], [30, 511], [31, 515], [32, 510], [33, 512], [34, 511], [35, 512], [36, 513], [224, 522], [225, 523], [226, 524], [227, 525], [228, 526], [229, 527], [230, 528], [231, 529], [232, 530], [233, 531], [234, 532], [235, 533], [3, 501], [4, 502], [5, 503], [6, 504], [236, 534]]);
var n110 = t([[24, 550], [25, 550], [26, 550], [27, 551], [28, 545], [29, 544], [30, 546], [31, 550], [32, 545], [33, 547], [34, 546], [35, 547], [36, 548], [224, 557], [225, 558], [226, 559], [227, 560], [228, 561], [229, 562], [230, 563], [231, 564], [232, 565], [233, 566], [234, 567], [235, 568], [3, 536], [4, 537], [5, 538], [6, 539], [236, 569]]);
var n111 = t([[24, 585], [25, 585], [26, 585], [27, 586], [28, 580], [29, 579], [30, 581], [31, 585], [32, 580], [33, 582], [34, 581], [35, 582], [36, 583], [224, 592], [225, 593], [226, 594], [227, 595], [228, 596], [229, 597], [230, 598], [231, 599], [232, 600], [233, 601], [234, 602], [235, 603], [3, 571], [4, 572], [5, 573], [6, 574], [236, 604]]);
var n112 = t([[24, 620], [25, 620], [26, 620], [27, 621], [28, 615], [29, 614], [30, 616], [31, 620], [32, 615], [33, 617], [34, 616], [35, 617], [36, 618], [224, 627], [225, 628], [226, 629], [227, 630], [228, 631], [229, 632], [230, 633], [231, 634], [232, 635], [233, 636], [234, 637], [235, 638], [3, 606], [4, 607], [5, 608], [6, 609], [236, 639]]);
var n113 = t([[24, 653], [25, 653], [26, 653], [27, 654], [28, 649], [29, 648], [30, 650], [31, 653], [32, 649], [33, 196], [34, 650], [35, 196], [36, 651], [224, 660], [225, 661], [226, 662], [227, 663], [228, 664], [229, 665], [230, 666], [231, 667], [232, 668], [233, 669], [234, 670], [235, 671], [3, 641], [4, 642], [5, 643], [6, 644], [236, 672]]);
var n114 = t([[24, 17], [25, 18], [26, 17], [27, 16], [28, 12], [29, 13], [30, 11], [31, 17], [32, 12], [33, 14], [34, 15], [35, 14], [36, 13], [224, 198], [225, 199], [226, 200], [227, 201], [228, 202], [229, 203], [230, 204], [231, 205], [232, 206], [233, 207], [234, 208], [235, 209], [3, 3], [4, 4], [5, 5], [6, 6], [236, 210]]);
var n115 = t([[24, 685], [25, 9], [26, 685], [27, 684], [28, 681], [29, 682], [30, 680], [31, 685], [32, 681], [33, 653], [34, 683], [35, 653], [36, 682], [224, 691], [225, 692], [226, 693], [227, 694], [228, 695], [229, 696], [230, 697], [231, 698], [232, 699], [233, 700], [234, 701], [235, 702], [3, 674], [4, 675], [5, 676], [6, 677], [236, 703]]);
var n116 = t([[24, 718], [25, 719], [26, 718], [27, 717], [28, 714], [29, 715], [30, 713], [31, 718], [32, 714], [33, 716], [34, 386], [35, 716], [36, 715], [224, 725], [225, 726], [226, 727], [227, 728], [228, 729], [229, 730], [230, 731], [231, 732], [232, 733], [233, 734], [234, 735], [235, 736], [3, 705], [4, 706], [5, 707], [6, 708], [236, 737]]);
var n117 = t([[24, 752], [25, 753], [26, 752], [27, 751], [28, 748], [29, 749], [30, 747], [31, 752], [32, 748], [33, 750], [34, 421], [35, 750], [36, 749], [224, 759], [225, 760], [226, 761], [227, 762], [228, 763], [229, 764], [230, 765], [231, 766], [232, 767], [233, 768], [234, 769], [235, 770], [3, 739], [4, 740], [5, 741], [6, 742], [236, 771]]);
var n118 = t([[24, 787], [25, 788], [26, 787], [27, 786], [28, 782], [29, 783], [30, 781], [31, 787], [32, 782], [33, 784], [34, 785], [35, 784], [36, 783], [224, 794], [225, 795], [226, 796], [227, 797], [228, 798], [229, 799], [230, 800], [231, 801], [232, 802], [233, 803], [234, 804], [235, 805], [3, 773], [4, 774], [5, 775], [6, 776], [236, 806]]);
var n119 = t([[24, 821], [25, 822], [26, 821], [27, 820], [28, 817], [29, 818], [30, 816], [31, 821], [32, 817], [33, 819], [34, 478], [35, 819], [36, 818], [224, 828], [225, 829], [226, 830], [227, 831], [228, 832], [229, 833], [230, 834], [231, 835], [232, 836], [233, 837], [234, 838], [235, 839], [3, 808], [4, 809], [5, 810], [6, 811], [236, 840]]);
var n120 = t([[24, 855], [25, 856], [26, 855], [27, 854], [28, 851], [29, 852], [30, 850], [31, 855], [32, 851], [33, 853], [34, 513], [35, 853], [36, 852], [224, 862], [225, 863], [226, 864], [227, 865], [228, 866], [229, 867], [230, 868], [231, 869], [232, 870], [233, 871], [234, 872], [235, 873], [3, 842], [4, 843], [5, 844], [6, 845], [236, 874]]);
var n121 = t([[24, 889], [25, 890], [26, 889], [27, 888], [28, 885], [29, 886], [30, 884], [31, 889], [32, 885], [33, 887], [34, 548], [35, 887], [36, 886], [224, 896], [225, 897], [226, 898], [227, 899], [228, 900], [229, 901], [230, 902], [231, 903], [232, 904], [233, 905], [234, 906], [235, 907], [3, 876], [4, 877], [5, 878], [6, 879], [236, 908]]);
var n122 = t([[24, 923], [25, 924], [26, 923], [27, 922], [28, 919], [29, 920], [30, 918], [31, 923], [32, 919], [33, 921], [34, 583], [35, 921], [36, 920], [224, 930], [225, 931], [226, 932], [227, 933], [228, 934], [229, 935], [230, 936], [231, 937], [232, 938], [233, 939], [234, 940], [235, 941], [3, 910], [4, 911], [5, 912], [6, 913], [236, 942]]);
var n123 = t([[24, 957], [25, 958], [26, 957], [27, 956], [28, 953], [29, 954], [30, 952], [31, 957], [32, 953], [33, 955], [34, 618], [35, 955], [36, 954], [224, 964], [225, 965], [226, 966], [227, 967], [228, 968], [229, 969], [230, 970], [231, 971], [232, 972], [233, 973], [234, 974], [235, 975], [3, 944], [4, 945], [5, 946], [6, 947], [236, 976]]);
var n124 = t([[24, 653], [25, 654], [26, 653], [27, 652], [28, 649], [29, 650], [30, 648], [31, 653], [32, 649], [33, 196], [34, 651], [35, 196], [36, 650], [224, 660], [225, 661], [226, 662], [227, 663], [228, 664], [229, 665], [230, 666], [231, 667], [232, 668], [233, 669], [234, 670], [235, 671], [3, 641], [4, 642], [5, 643], [6, 644], [236, 672]]);
var themes = {
  light: n1,
  dark: n2,
  light_accent: n3,
  dark_accent: n4,
  light_black: n5,
  light_white: n6,
  light_gray: n7,
  light_blue: n8,
  light_red: n9,
  light_yellow: n10,
  light_green: n11,
  light_orange: n12,
  light_pink: n13,
  light_purple: n14,
  light_teal: n15,
  light_neutral: n16,
  dark_black: n17,
  dark_white: n18,
  dark_gray: n19,
  dark_blue: n20,
  dark_red: n21,
  dark_yellow: n22,
  dark_green: n23,
  dark_orange: n24,
  dark_pink: n25,
  dark_purple: n26,
  dark_teal: n27,
  dark_neutral: n28,
  light_surface1: n29,
  light_white_surface1: n29,
  light_Input: n29,
  light_Progress: n29,
  light_Slider: n29,
  light_TextArea: n29,
  light_white_Input: n29,
  light_white_Progress: n29,
  light_white_Slider: n29,
  light_white_TextArea: n29,
  light_surface2: n30,
  light_white_surface2: n30,
  light_Button: n30,
  light_SliderThumb: n30,
  light_Switch: n30,
  light_white_Button: n30,
  light_white_SliderThumb: n30,
  light_white_Switch: n30,
  dark_surface1: n31,
  dark_black_surface1: n31,
  dark_Input: n31,
  dark_Progress: n31,
  dark_Slider: n31,
  dark_TextArea: n31,
  dark_black_Input: n31,
  dark_black_Progress: n31,
  dark_black_Slider: n31,
  dark_black_TextArea: n31,
  dark_surface2: n32,
  dark_black_surface2: n32,
  dark_Button: n32,
  dark_SliderThumb: n32,
  dark_Switch: n32,
  dark_black_Button: n32,
  dark_black_SliderThumb: n32,
  dark_black_Switch: n32,
  light_black_accent: n33,
  light_black_Tooltip: n33,
  light_black_SwitchThumb: n33,
  light_black_surface1: n34,
  light_black_Input: n34,
  light_black_Progress: n34,
  light_black_Slider: n34,
  light_black_TextArea: n34,
  light_black_surface2: n35,
  light_black_Button: n35,
  light_black_SliderThumb: n35,
  light_black_Switch: n35,
  light_white_accent: n36,
  light_Tooltip: n36,
  light_SwitchThumb: n36,
  light_white_Tooltip: n36,
  light_white_SwitchThumb: n36,
  light_gray_accent: n37,
  light_gray_Tooltip: n37,
  light_gray_SwitchThumb: n37,
  light_gray_surface1: n38,
  light_gray_Input: n38,
  light_gray_Progress: n38,
  light_gray_Slider: n38,
  light_gray_TextArea: n38,
  light_gray_surface2: n39,
  light_gray_Button: n39,
  light_gray_SliderThumb: n39,
  light_gray_Switch: n39,
  light_blue_accent: n40,
  light_blue_Tooltip: n40,
  light_blue_SwitchThumb: n40,
  light_blue_surface1: n41,
  light_blue_Input: n41,
  light_blue_Progress: n41,
  light_blue_Slider: n41,
  light_blue_TextArea: n41,
  light_blue_surface2: n42,
  light_blue_Button: n42,
  light_blue_SliderThumb: n42,
  light_blue_Switch: n42,
  light_red_accent: n43,
  light_red_Tooltip: n43,
  light_red_SwitchThumb: n43,
  light_red_surface1: n44,
  light_red_Input: n44,
  light_red_Progress: n44,
  light_red_Slider: n44,
  light_red_TextArea: n44,
  light_red_surface2: n45,
  light_red_Button: n45,
  light_red_SliderThumb: n45,
  light_red_Switch: n45,
  light_yellow_accent: n46,
  light_yellow_Tooltip: n46,
  light_yellow_SwitchThumb: n46,
  light_yellow_surface1: n47,
  light_yellow_Input: n47,
  light_yellow_Progress: n47,
  light_yellow_Slider: n47,
  light_yellow_TextArea: n47,
  light_yellow_surface2: n48,
  light_yellow_Button: n48,
  light_yellow_SliderThumb: n48,
  light_yellow_Switch: n48,
  light_green_accent: n49,
  light_green_Tooltip: n49,
  light_green_SwitchThumb: n49,
  light_green_surface1: n50,
  light_green_Input: n50,
  light_green_Progress: n50,
  light_green_Slider: n50,
  light_green_TextArea: n50,
  light_green_surface2: n51,
  light_green_Button: n51,
  light_green_SliderThumb: n51,
  light_green_Switch: n51,
  light_orange_accent: n52,
  light_orange_Tooltip: n52,
  light_orange_SwitchThumb: n52,
  light_orange_surface1: n53,
  light_orange_Input: n53,
  light_orange_Progress: n53,
  light_orange_Slider: n53,
  light_orange_TextArea: n53,
  light_orange_surface2: n54,
  light_orange_Button: n54,
  light_orange_SliderThumb: n54,
  light_orange_Switch: n54,
  light_pink_accent: n55,
  light_pink_Tooltip: n55,
  light_pink_SwitchThumb: n55,
  light_pink_surface1: n56,
  light_pink_Input: n56,
  light_pink_Progress: n56,
  light_pink_Slider: n56,
  light_pink_TextArea: n56,
  light_pink_surface2: n57,
  light_pink_Button: n57,
  light_pink_SliderThumb: n57,
  light_pink_Switch: n57,
  light_purple_accent: n58,
  light_purple_Tooltip: n58,
  light_purple_SwitchThumb: n58,
  light_purple_surface1: n59,
  light_purple_Input: n59,
  light_purple_Progress: n59,
  light_purple_Slider: n59,
  light_purple_TextArea: n59,
  light_purple_surface2: n60,
  light_purple_Button: n60,
  light_purple_SliderThumb: n60,
  light_purple_Switch: n60,
  light_teal_accent: n61,
  light_teal_Tooltip: n61,
  light_teal_SwitchThumb: n61,
  light_teal_surface1: n62,
  light_teal_Input: n62,
  light_teal_Progress: n62,
  light_teal_Slider: n62,
  light_teal_TextArea: n62,
  light_teal_surface2: n63,
  light_teal_Button: n63,
  light_teal_SliderThumb: n63,
  light_teal_Switch: n63,
  light_neutral_accent: n64,
  light_neutral_Tooltip: n64,
  light_neutral_SwitchThumb: n64,
  light_neutral_surface1: n65,
  light_neutral_Input: n65,
  light_neutral_Progress: n65,
  light_neutral_Slider: n65,
  light_neutral_TextArea: n65,
  light_neutral_surface2: n66,
  light_neutral_Button: n66,
  light_neutral_SliderThumb: n66,
  light_neutral_Switch: n66,
  dark_black_accent: n67,
  dark_Tooltip: n67,
  dark_SwitchThumb: n67,
  dark_black_Tooltip: n67,
  dark_black_SwitchThumb: n67,
  dark_white_accent: n68,
  dark_white_Tooltip: n68,
  dark_white_SwitchThumb: n68,
  dark_white_surface1: n69,
  dark_white_Input: n69,
  dark_white_Progress: n69,
  dark_white_Slider: n69,
  dark_white_TextArea: n69,
  dark_white_surface2: n70,
  dark_white_Button: n70,
  dark_white_SliderThumb: n70,
  dark_white_Switch: n70,
  dark_gray_accent: n71,
  dark_gray_Tooltip: n71,
  dark_gray_SwitchThumb: n71,
  dark_gray_surface1: n72,
  dark_gray_Input: n72,
  dark_gray_Progress: n72,
  dark_gray_Slider: n72,
  dark_gray_TextArea: n72,
  dark_gray_surface2: n73,
  dark_gray_Button: n73,
  dark_gray_SliderThumb: n73,
  dark_gray_Switch: n73,
  dark_blue_accent: n74,
  dark_blue_Tooltip: n74,
  dark_blue_SwitchThumb: n74,
  dark_blue_surface1: n75,
  dark_blue_Input: n75,
  dark_blue_Progress: n75,
  dark_blue_Slider: n75,
  dark_blue_TextArea: n75,
  dark_blue_surface2: n76,
  dark_blue_Button: n76,
  dark_blue_SliderThumb: n76,
  dark_blue_Switch: n76,
  dark_red_accent: n77,
  dark_red_Tooltip: n77,
  dark_red_SwitchThumb: n77,
  dark_red_surface1: n78,
  dark_red_Input: n78,
  dark_red_Progress: n78,
  dark_red_Slider: n78,
  dark_red_TextArea: n78,
  dark_red_surface2: n79,
  dark_red_Button: n79,
  dark_red_SliderThumb: n79,
  dark_red_Switch: n79,
  dark_yellow_accent: n80,
  dark_yellow_Tooltip: n80,
  dark_yellow_SwitchThumb: n80,
  dark_yellow_surface1: n81,
  dark_yellow_Input: n81,
  dark_yellow_Progress: n81,
  dark_yellow_Slider: n81,
  dark_yellow_TextArea: n81,
  dark_yellow_surface2: n82,
  dark_yellow_Button: n82,
  dark_yellow_SliderThumb: n82,
  dark_yellow_Switch: n82,
  dark_green_accent: n83,
  dark_green_Tooltip: n83,
  dark_green_SwitchThumb: n83,
  dark_green_surface1: n84,
  dark_green_Input: n84,
  dark_green_Progress: n84,
  dark_green_Slider: n84,
  dark_green_TextArea: n84,
  dark_green_surface2: n85,
  dark_green_Button: n85,
  dark_green_SliderThumb: n85,
  dark_green_Switch: n85,
  dark_orange_accent: n86,
  dark_orange_Tooltip: n86,
  dark_orange_SwitchThumb: n86,
  dark_orange_surface1: n87,
  dark_orange_Input: n87,
  dark_orange_Progress: n87,
  dark_orange_Slider: n87,
  dark_orange_TextArea: n87,
  dark_orange_surface2: n88,
  dark_orange_Button: n88,
  dark_orange_SliderThumb: n88,
  dark_orange_Switch: n88,
  dark_pink_accent: n89,
  dark_pink_Tooltip: n89,
  dark_pink_SwitchThumb: n89,
  dark_pink_surface1: n90,
  dark_pink_Input: n90,
  dark_pink_Progress: n90,
  dark_pink_Slider: n90,
  dark_pink_TextArea: n90,
  dark_pink_surface2: n91,
  dark_pink_Button: n91,
  dark_pink_SliderThumb: n91,
  dark_pink_Switch: n91,
  dark_purple_accent: n92,
  dark_purple_Tooltip: n92,
  dark_purple_SwitchThumb: n92,
  dark_purple_surface1: n93,
  dark_purple_Input: n93,
  dark_purple_Progress: n93,
  dark_purple_Slider: n93,
  dark_purple_TextArea: n93,
  dark_purple_surface2: n94,
  dark_purple_Button: n94,
  dark_purple_SliderThumb: n94,
  dark_purple_Switch: n94,
  dark_teal_accent: n95,
  dark_teal_Tooltip: n95,
  dark_teal_SwitchThumb: n95,
  dark_teal_surface1: n96,
  dark_teal_Input: n96,
  dark_teal_Progress: n96,
  dark_teal_Slider: n96,
  dark_teal_TextArea: n96,
  dark_teal_surface2: n97,
  dark_teal_Button: n97,
  dark_teal_SliderThumb: n97,
  dark_teal_Switch: n97,
  dark_neutral_accent: n98,
  dark_neutral_Tooltip: n98,
  dark_neutral_SwitchThumb: n98,
  dark_neutral_surface1: n99,
  dark_neutral_Input: n99,
  dark_neutral_Progress: n99,
  dark_neutral_Slider: n99,
  dark_neutral_TextArea: n99,
  dark_neutral_surface2: n100,
  dark_neutral_Button: n100,
  dark_neutral_SliderThumb: n100,
  dark_neutral_Switch: n100,
  light_ProgressIndicator: n101,
  light_SliderActive: n101,
  light_white_ProgressIndicator: n101,
  light_white_SliderActive: n101,
  dark_ProgressIndicator: n102,
  dark_SliderActive: n102,
  dark_black_ProgressIndicator: n102,
  dark_black_SliderActive: n102,
  light_black_ProgressIndicator: n103,
  light_black_SliderActive: n103,
  light_gray_ProgressIndicator: n104,
  light_gray_SliderActive: n104,
  light_blue_ProgressIndicator: n105,
  light_blue_SliderActive: n105,
  light_red_ProgressIndicator: n106,
  light_red_SliderActive: n106,
  light_yellow_ProgressIndicator: n107,
  light_yellow_SliderActive: n107,
  light_green_ProgressIndicator: n108,
  light_green_SliderActive: n108,
  light_orange_ProgressIndicator: n109,
  light_orange_SliderActive: n109,
  light_pink_ProgressIndicator: n110,
  light_pink_SliderActive: n110,
  light_purple_ProgressIndicator: n111,
  light_purple_SliderActive: n111,
  light_teal_ProgressIndicator: n112,
  light_teal_SliderActive: n112,
  light_neutral_ProgressIndicator: n113,
  light_neutral_SliderActive: n113,
  dark_white_ProgressIndicator: n114,
  dark_white_SliderActive: n114,
  dark_gray_ProgressIndicator: n115,
  dark_gray_SliderActive: n115,
  dark_blue_ProgressIndicator: n116,
  dark_blue_SliderActive: n116,
  dark_red_ProgressIndicator: n117,
  dark_red_SliderActive: n117,
  dark_yellow_ProgressIndicator: n118,
  dark_yellow_SliderActive: n118,
  dark_green_ProgressIndicator: n119,
  dark_green_SliderActive: n119,
  dark_orange_ProgressIndicator: n120,
  dark_orange_SliderActive: n120,
  dark_pink_ProgressIndicator: n121,
  dark_pink_SliderActive: n121,
  dark_purple_ProgressIndicator: n122,
  dark_purple_SliderActive: n122,
  dark_teal_ProgressIndicator: n123,
  dark_teal_SliderActive: n123,
  dark_neutral_ProgressIndicator: n124,
  dark_neutral_SliderActive: n124
};

// ../core/themes/dist/esm/utils.mjs
function sizeToSpace(v) {
  if (v === 0) return 0;
  if (v === 2) return 0.5;
  if (v === 4) return 1;
  if (v === 8) return 1.5;
  if (v <= 16) return Math.round(v * 0.333);
  return Math.floor(v * 0.7 - 12);
}
__name(sizeToSpace, "sizeToSpace");

// ../core/themes/dist/esm/v5-tokens.mjs
var size = {
  $0: 0,
  "$0.25": 2,
  "$0.5": 4,
  "$0.75": 8,
  $1: 20,
  "$1.5": 24,
  $2: 28,
  "$2.5": 32,
  $3: 36,
  "$3.5": 40,
  $4: 44,
  $true: 44,
  "$4.5": 48,
  $5: 52,
  $6: 64,
  $7: 74,
  $8: 84,
  $9: 94,
  $10: 104,
  $11: 124,
  $12: 144,
  $13: 164,
  $14: 184,
  $15: 204,
  $16: 224,
  $17: 224,
  $18: 244,
  $19: 264,
  $20: 284
};
var spaces = Object.entries(size).map(([k, v]) => {
  return [k, sizeToSpace(v)];
});
var spacesNegative = spaces.slice(1).map(([k, v]) => [`-${k.slice(1)}`, -v]);
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
var tokens = {
  radius,
  zIndex,
  space,
  size
};

// ../core/shorthands/dist/esm/v4.mjs
var shorthands = createShorthands({
  // text
  text: "textAlign",
  // view
  b: "bottom",
  bg: "backgroundColor",
  content: "alignContent",
  grow: "flexGrow",
  items: "alignItems",
  justify: "justifyContent",
  l: "left",
  m: "margin",
  maxH: "maxHeight",
  maxW: "maxWidth",
  mb: "marginBottom",
  minH: "minHeight",
  minW: "minWidth",
  ml: "marginLeft",
  mr: "marginRight",
  mt: "marginTop",
  mx: "marginHorizontal",
  my: "marginVertical",
  p: "padding",
  pb: "paddingBottom",
  pl: "paddingLeft",
  pr: "paddingRight",
  pt: "paddingTop",
  px: "paddingHorizontal",
  py: "paddingVertical",
  r: "right",
  rounded: "borderRadius",
  select: "userSelect",
  self: "alignSelf",
  shrink: "flexShrink",
  t: "top",
  z: "zIndex"
});
function createShorthands(a) {
  return a;
}
__name(createShorthands, "createShorthands");

// ../core/themes/dist/esm/generated-v5.mjs
function t2(a) {
  let res = {};
  for (const [ki, vi] of a) {
    res[ks2[ki]] = colors2[vi];
  }
  return res;
}
__name(t2, "t");
var colors2 = ["hsla(0, 0%, 10%, 1)", "hsla(0, 0%, 67%, 1)", "hsla(0, 0%, 100%, 0)", "hsla(0, 0%, 97%, 0.2)", "hsla(0, 0%, 97%, 0.4)", "hsla(0, 0%, 97%, 0.6)", "hsla(0, 0%, 97%, 0.8)", "hsla(0, 0%, 100%, 1)", "hsla(0, 0%, 97%, 1)", "hsla(0, 0%, 93%, 1)", "hsla(0, 0%, 85%, 1)", "hsla(0, 0%, 80%, 1)", "hsla(0, 0%, 70%, 1)", "hsla(0, 0%, 59%, 1)", "hsla(0, 0%, 45%, 1)", "hsla(0, 0%, 30%, 1)", "hsla(0, 0%, 20%, 1)", "hsla(0, 0%, 14%, 1)", "hsla(0, 0%, 2%, 1)", "hsla(0, 0%, 2%, 0)", "hsla(0, 0%, 2%, 0.2)", "hsla(0, 0%, 2%, 0.4)", "hsla(0, 0%, 2%, 0.6)", "hsla(0, 0%, 2%, 0.8)", "#090909", "#151515", "#191919", "#232323", "#333", "#444", "#666", "#777", "#858585", "#aaa", "#ccc", "#ffffff", "#fff", "#f8f8f8", "hsl(0, 0%, 93%)", "hsl(0, 0%, 85%)", "hsl(0, 0%, 80%)", "hsl(0, 0%, 70%)", "hsl(0, 0%, 59%)", "hsl(0, 0%, 45%)", "hsl(0, 0%, 30%)", "hsl(0, 0%, 20%)", "hsl(0, 0%, 14%)", "hsl(0, 0%, 2%)", "rgba(255,255,255,1)", "rgba(255,255,255,0)", "rgba(255,255,255,0.2)", "rgba(255,255,255,0.4)", "rgba(255,255,255,0.6)", "rgba(255,255,255,0.8)", "rgba(0,0,0,1)", "rgba(0,0,0,0)", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.6)", "rgba(0,0,0,0.8)", "rgba(0,0,0,0.04)", "rgba(0,0,0,0.08)", "rgba(0,0,0,0.12)", "rgba(0,0,0,0.22)", "rgba(0,0,0,0.33)", "rgba(0,0,0,0.44)", "rgba(0,0,0,0.75)", "rgba(255,255,255,0.05)", "rgba(255,255,255,0.1)", "rgba(255,255,255,0.15)", "rgba(255,255,255,0.3)", "rgba(255,255,255,0.55)", "rgba(255,255,255,0.7)", "rgba(255,255,255,0.85)", "#fcfcfc", "#f9f9f9", "#f0f0f0", "#e8e8e8", "#e0e0e0", "#d9d9d9", "#cecece", "#bbbbbb", "#8d8d8d", "#838383", "#646464", "#202020", "#fbfdff", "#f4faff", "#e6f4fe", "#d5efff", "#c2e5ff", "#acd8fc", "#8ec8f6", "#5eb1ef", "#0090ff", "#0588f0", "#0d74ce", "#113264", "#fffcfc", "#fff7f7", "#feebec", "#ffdbdc", "#ffcdce", "#fdbdbe", "#f4a9aa", "#eb8e90", "#e5484d", "#dc3e42", "#ce2c31", "#641723", "#fdfdf9", "#fefce9", "#fffab8", "#fff394", "#ffe770", "#f3d768", "#e4c767", "#d5ae39", "#ffe629", "#ffdc00", "#9e6c00", "#473b1f", "#fbfefc", "#f4fbf6", "#e6f6eb", "#d6f1df", "#c4e8d1", "#adddc0", "#8eceaa", "#5bb98b", "#30a46c", "#2b9a66", "#218358", "#193b2d", "#fefcfb", "#fff7ed", "#ffefd6", "#ffdfb5", "#ffd19a", "#ffc182", "#f5ae73", "#ec9455", "#f76b15", "#ef5f00", "#cc4e00", "#582d1d", "#fffcfe", "#fef7fb", "#fee9f5", "#fbdcef", "#f6cee7", "#efbfdd", "#e7acd0", "#dd93c2", "#d6409f", "#cf3897", "#c2298a", "#651249", "#fefcfe", "#fbf7fe", "#f7edfe", "#f2e2fc", "#ead5f9", "#e0c4f4", "#d1afec", "#be93e4", "#8e4ec6", "#8347b9", "#8145b5", "#402060", "#fafefd", "#f3fbf9", "#e0f8f3", "#ccf3ea", "#b8eae0", "#a1ded2", "#83cdc1", "#53b9ab", "#12a594", "#0d9b8a", "#008573", "#0d3d38", "hsl(0, 0%, 68%)", "hsl(0, 0%, 65%)", "hsl(0, 0%, 62%)", "hsl(0, 0%, 56%)", "hsl(0, 0%, 53%)", "hsl(0, 0%, 50%)", "hsl(0, 0%, 47%)", "hsl(0, 0%, 44%)", "hsl(0, 0%, 41%)", "hsl(0, 0%, 38%)", "hsl(0, 0%, 32%)", "hsla(0, 0%, 4%, 1)", "hsla(0, 0%, 8%, 1)", "hsla(0, 0%, 27%, 1)", "hsla(0, 0%, 40%, 1)", "hsla(0, 0%, 47%, 1)", "hsla(0, 0%, 52%, 1)", "hsla(0, 0%, 2%, 0.1)", "hsla(0, 0%, 2%, 0.075)", "hsla(0, 0%, 2%, 0.05)", "hsla(0, 0%, 2%, 0.025)", "hsla(0, 0%, 2%, 0.02)", "hsla(0, 0%, 2%, 0.01)", "hsla(0, 0%, 97%, 0.1)", "hsla(0, 0%, 97%, 0.075)", "hsla(0, 0%, 97%, 0.05)", "hsla(0, 0%, 97%, 0.025)", "hsla(0, 0%, 97%, 0.02)", "hsla(0, 0%, 97%, 0.01)", "hsla(0, 0%, 70%, 0.6)", "hsla(0, 0%, 4%, 0)", "hsla(0, 0%, 8%, 0.2)", "hsla(0, 0%, 8%, 0.4)", "hsla(0, 0%, 8%, 0.6)", "hsla(0, 0%, 8%, 0.8)", "hsla(0, 0%, 100%, 0.2)", "hsla(0, 0%, 100%, 0.4)", "hsla(0, 0%, 100%, 0.6)", "hsla(0, 0%, 100%, 0.8)", "rgba(0,0,0,0.15)", "rgba(0,0,0,0.23)", "rgba(0,0,0,0.45)", "rgba(0,0,0,0.65)", "rgba(0,0,0,0.9)", "rgba(255,255,255,0.45)", "rgba(255,255,255,0.65)", "rgba(255,255,255,0.95)", "#111111", "#222222", "#2a2a2a", "#313131", "#3a3a3a", "#484848", "#606060", "#6e6e6e", "#7b7b7b", "#b4b4b4", "#eeeeee", "#0d1520", "#111927", "#0d2847", "#003362", "#004074", "#104d87", "#205d9e", "#2870bd", "#3b9eff", "#70b8ff", "#c2e6ff", "#191111", "#201314", "#3b1219", "#500f1c", "#611623", "#72232d", "#8c333a", "#b54548", "#ec5d5e", "#ff9592", "#ffd1d9", "#14120b", "#1b180f", "#2d2305", "#362b00", "#433500", "#524202", "#665417", "#836a21", "#ffff57", "#f5e147", "#f6eeb4", "#0e1512", "#121b17", "#132d21", "#113b29", "#174933", "#20573e", "#28684a", "#2f7c57", "#33b074", "#3dd68c", "#b1f1cb", "#17120e", "#1e160f", "#331e0b", "#462100", "#562800", "#66350c", "#7e451d", "#a35829", "#ff801f", "#ffa057", "#ffe0c2", "#191117", "#21121d", "#37172f", "#4b143d", "#591c47", "#692955", "#833869", "#a84885", "#de51a8", "#ff8dcc", "#fdd1ea", "#18111b", "#1e1523", "#301c3b", "#3d224e", "#48295c", "#54346b", "#664282", "#8457aa", "#9a5cd0", "#d19dff", "#ecd9fa", "#0d1514", "#111c1b", "#0d2d2a", "#023b37", "#084843", "#145750", "#1c6961", "#207e73", "#0eb39e", "#0bd8b6", "#adf0dd", "hsla(0, 0%, 100%, 0.1)", "hsla(0, 0%, 100%, 0.075)", "hsla(0, 0%, 100%, 0.05)", "hsla(0, 0%, 100%, 0.025)", "hsla(0, 0%, 100%, 0.02)", "hsla(0, 0%, 100%, 0.01)", "hsla(0, 0%, 8%, 0.1)", "hsla(0, 0%, 8%, 0.075)", "hsla(0, 0%, 8%, 0.05)", "hsla(0, 0%, 8%, 0.025)", "hsla(0, 0%, 8%, 0.02)", "hsla(0, 0%, 8%, 0.01)", "hsla(0, 0%, 27%, 0.6)", "hsla(0, 0%, 99%, 0)", "hsla(0, 0%, 98%, 0.2)", "hsla(0, 0%, 98%, 0.4)", "hsla(0, 0%, 98%, 0.6)", "hsla(0, 0%, 98%, 0.8)", "hsla(0, 0%, 99%, 1)", "hsla(0, 0%, 98%, 1)", "hsla(0, 0%, 94%, 1)", "hsla(0, 0%, 91%, 1)", "hsla(0, 0%, 88%, 1)", "hsla(0, 0%, 81%, 1)", "hsla(0, 0%, 73%, 1)", "hsla(0, 0%, 55%, 1)", "hsla(0, 0%, 51%, 1)", "hsla(0, 0%, 39%, 1)", "hsla(0, 0%, 13%, 1)", "hsla(0, 0%, 13%, 0)", "hsla(0, 0%, 13%, 0.2)", "hsla(0, 0%, 13%, 0.4)", "hsla(0, 0%, 13%, 0.6)", "hsla(0, 0%, 13%, 0.8)", "hsla(0, 0%, 13%, 0.1)", "hsla(0, 0%, 13%, 0.075)", "hsla(0, 0%, 13%, 0.05)", "hsla(0, 0%, 13%, 0.025)", "hsla(0, 0%, 13%, 0.02)", "hsla(0, 0%, 13%, 0.01)", "hsla(0, 0%, 98%, 0.1)", "hsla(0, 0%, 98%, 0.075)", "hsla(0, 0%, 98%, 0.05)", "hsla(0, 0%, 98%, 0.025)", "hsla(0, 0%, 98%, 0.02)", "hsla(0, 0%, 98%, 0.01)", "hsla(0, 0%, 85%, 0.6)", "hsla(216, 100%, 99%, 0)", "hsla(207, 100%, 98%, 0.2)", "hsla(207, 100%, 98%, 0.4)", "hsla(207, 100%, 98%, 0.6)", "hsla(207, 100%, 98%, 0.8)", "hsla(210, 100%, 99%, 1)", "hsla(207, 100%, 98%, 1)", "hsla(205, 92%, 95%, 1)", "hsla(203, 100%, 92%, 1)", "hsla(206, 100%, 88%, 1)", "hsla(207, 93%, 83%, 1)", "hsla(207, 85%, 76%, 1)", "hsla(206, 82%, 65%, 1)", "hsla(206, 100%, 50%, 1)", "hsla(207, 96%, 48%, 1)", "hsla(208, 88%, 43%, 1)", "hsla(216, 71%, 23%, 1)", "hsla(216, 71%, 23%, 0)", "hsla(216, 71%, 23%, 0.2)", "hsla(216, 71%, 23%, 0.4)", "hsla(216, 71%, 23%, 0.6)", "hsla(216, 71%, 23%, 0.8)", "hsla(216, 71%, 23%, 0.1)", "hsla(216, 71%, 23%, 0.075)", "hsla(216, 71%, 23%, 0.05)", "hsla(216, 71%, 23%, 0.025)", "hsla(216, 71%, 23%, 0.02)", "hsla(216, 71%, 23%, 0.01)", "hsla(207, 100%, 98%, 0.1)", "hsla(207, 100%, 98%, 0.075)", "hsla(207, 100%, 98%, 0.05)", "hsla(207, 100%, 98%, 0.025)", "hsla(207, 100%, 98%, 0.02)", "hsla(207, 100%, 98%, 0.01)", "hsla(207, 93%, 83%, 0.6)", "hsla(0, 100%, 99%, 0)", "hsla(0, 100%, 98%, 0.2)", "hsla(0, 100%, 98%, 0.4)", "hsla(0, 100%, 98%, 0.6)", "hsla(0, 100%, 98%, 0.8)", "hsla(0, 100%, 99%, 1)", "hsla(0, 100%, 98%, 1)", "hsla(357, 90%, 96%, 1)", "hsla(358, 100%, 93%, 1)", "hsla(359, 100%, 90%, 1)", "hsla(359, 94%, 87%, 1)", "hsla(359, 77%, 81%, 1)", "hsla(359, 70%, 74%, 1)", "hsla(358, 75%, 59%, 1)", "hsla(358, 69%, 55%, 1)", "hsla(358, 65%, 49%, 1)", "hsla(351, 63%, 24%, 1)", "hsla(351, 63%, 24%, 0)", "hsla(351, 63%, 24%, 0.2)", "hsla(351, 63%, 24%, 0.4)", "hsla(351, 63%, 24%, 0.6)", "hsla(351, 63%, 24%, 0.8)", "hsla(351, 63%, 24%, 0.1)", "hsla(351, 63%, 24%, 0.075)", "hsla(351, 63%, 24%, 0.05)", "hsla(351, 63%, 24%, 0.025)", "hsla(351, 63%, 24%, 0.02)", "hsla(351, 63%, 24%, 0.01)", "hsla(0, 100%, 98%, 0.1)", "hsla(0, 100%, 98%, 0.075)", "hsla(0, 100%, 98%, 0.05)", "hsla(0, 100%, 98%, 0.025)", "hsla(0, 100%, 98%, 0.02)", "hsla(0, 100%, 98%, 0.01)", "hsla(359, 94%, 87%, 0.6)", "hsla(60, 45%, 98%, 0)", "hsla(54, 91%, 95%, 0.2)", "hsla(54, 91%, 95%, 0.4)", "hsla(54, 91%, 95%, 0.6)", "hsla(54, 91%, 95%, 0.8)", "hsla(60, 50%, 98%, 1)", "hsla(54, 91%, 95%, 1)", "hsla(56, 100%, 86%, 1)", "hsla(53, 100%, 79%, 1)", "hsla(50, 100%, 72%, 1)", "hsla(48, 85%, 68%, 1)", "hsla(46, 70%, 65%, 1)", "hsla(45, 65%, 53%, 1)", "hsla(53, 100%, 58%, 1)", "hsla(52, 100%, 50%, 1)", "hsla(41, 100%, 31%, 1)", "hsla(42, 39%, 20%, 1)", "hsla(42, 39%, 20%, 0)", "hsla(42, 39%, 20%, 0.2)", "hsla(42, 39%, 20%, 0.4)", "hsla(42, 39%, 20%, 0.6)", "hsla(42, 39%, 20%, 0.8)", "hsla(42, 39%, 20%, 0.1)", "hsla(42, 39%, 20%, 0.075)", "hsla(42, 39%, 20%, 0.05)", "hsla(42, 39%, 20%, 0.025)", "hsla(42, 39%, 20%, 0.02)", "hsla(42, 39%, 20%, 0.01)", "hsla(54, 91%, 95%, 0.1)", "hsla(54, 91%, 95%, 0.075)", "hsla(54, 91%, 95%, 0.05)", "hsla(54, 91%, 95%, 0.025)", "hsla(54, 91%, 95%, 0.02)", "hsla(54, 91%, 95%, 0.01)", "hsla(48, 85%, 68%, 0.6)", "hsla(140, 60%, 99%, 0)", "hsla(137, 47%, 97%, 0.2)", "hsla(137, 47%, 97%, 0.4)", "hsla(137, 47%, 97%, 0.6)", "hsla(137, 47%, 97%, 0.8)", "hsla(140, 60%, 99%, 1)", "hsla(137, 47%, 97%, 1)", "hsla(139, 47%, 93%, 1)", "hsla(140, 49%, 89%, 1)", "hsla(142, 44%, 84%, 1)", "hsla(144, 41%, 77%, 1)", "hsla(146, 40%, 68%, 1)", "hsla(151, 40%, 54%, 1)", "hsla(151, 55%, 42%, 1)", "hsla(152, 56%, 39%, 1)", "hsla(154, 60%, 32%, 1)", "hsla(155, 40%, 16%, 1)", "hsla(156, 41%, 16%, 0)", "hsla(156, 41%, 16%, 0.2)", "hsla(156, 41%, 16%, 0.4)", "hsla(156, 41%, 16%, 0.6)", "hsla(156, 41%, 16%, 0.8)", "hsla(156, 41%, 16%, 0.1)", "hsla(156, 41%, 16%, 0.075)", "hsla(156, 41%, 16%, 0.05)", "hsla(156, 41%, 16%, 0.025)", "hsla(156, 41%, 16%, 0.02)", "hsla(156, 41%, 16%, 0.01)", "hsla(137, 47%, 97%, 0.1)", "hsla(137, 47%, 97%, 0.075)", "hsla(137, 47%, 97%, 0.05)", "hsla(137, 47%, 97%, 0.025)", "hsla(137, 47%, 97%, 0.02)", "hsla(137, 47%, 97%, 0.01)", "hsla(144, 41%, 77%, 0.6)", "hsla(20, 60%, 99%, 0)", "hsla(33, 100%, 96%, 0.2)", "hsla(33, 100%, 96%, 0.4)", "hsla(33, 100%, 96%, 0.6)", "hsla(33, 100%, 96%, 0.8)", "hsla(20, 60%, 99%, 1)", "hsla(33, 100%, 96%, 1)", "hsla(37, 100%, 92%, 1)", "hsla(34, 100%, 85%, 1)", "hsla(33, 100%, 80%, 1)", "hsla(30, 100%, 75%, 1)", "hsla(27, 87%, 71%, 1)", "hsla(25, 80%, 63%, 1)", "hsla(23, 93%, 53%, 1)", "hsla(24, 100%, 47%, 1)", "hsla(23, 100%, 40%, 1)", "hsla(16, 50%, 23%, 1)", "hsla(16, 50%, 23%, 0)", "hsla(16, 50%, 23%, 0.2)", "hsla(16, 50%, 23%, 0.4)", "hsla(16, 50%, 23%, 0.6)", "hsla(16, 50%, 23%, 0.8)", "hsla(16, 50%, 23%, 0.1)", "hsla(16, 50%, 23%, 0.075)", "hsla(16, 50%, 23%, 0.05)", "hsla(16, 50%, 23%, 0.025)", "hsla(16, 50%, 23%, 0.02)", "hsla(16, 50%, 23%, 0.01)", "hsla(33, 100%, 96%, 0.1)", "hsla(33, 100%, 96%, 0.075)", "hsla(33, 100%, 96%, 0.05)", "hsla(33, 100%, 96%, 0.025)", "hsla(33, 100%, 96%, 0.02)", "hsla(33, 100%, 96%, 0.01)", "hsla(30, 100%, 75%, 0.6)", "hsla(324, 100%, 99%, 0)", "hsla(326, 78%, 98%, 0.2)", "hsla(326, 78%, 98%, 0.4)", "hsla(326, 78%, 98%, 0.6)", "hsla(326, 78%, 98%, 0.8)", "hsla(320, 100%, 99%, 1)", "hsla(326, 78%, 98%, 1)", "hsla(326, 91%, 95%, 1)", "hsla(323, 79%, 92%, 1)", "hsla(323, 69%, 89%, 1)", "hsla(323, 60%, 84%, 1)", "hsla(323, 55%, 79%, 1)", "hsla(322, 52%, 72%, 1)", "hsla(322, 65%, 55%, 1)", "hsla(322, 61%, 52%, 1)", "hsla(322, 65%, 46%, 1)", "hsla(320, 70%, 23%, 1)", "hsla(320, 69%, 23%, 0)", "hsla(320, 69%, 23%, 0.2)", "hsla(320, 69%, 23%, 0.4)", "hsla(320, 69%, 23%, 0.6)", "hsla(320, 69%, 23%, 0.8)", "hsla(320, 69%, 23%, 0.1)", "hsla(320, 69%, 23%, 0.075)", "hsla(320, 69%, 23%, 0.05)", "hsla(320, 69%, 23%, 0.025)", "hsla(320, 69%, 23%, 0.02)", "hsla(320, 69%, 23%, 0.01)", "hsla(326, 78%, 98%, 0.1)", "hsla(326, 78%, 98%, 0.075)", "hsla(326, 78%, 98%, 0.05)", "hsla(326, 78%, 98%, 0.025)", "hsla(326, 78%, 98%, 0.02)", "hsla(326, 78%, 98%, 0.01)", "hsla(323, 60%, 84%, 0.6)", "hsla(300, 60%, 99%, 0)", "hsla(274, 78%, 98%, 0.2)", "hsla(274, 78%, 98%, 0.4)", "hsla(274, 78%, 98%, 0.6)", "hsla(274, 78%, 98%, 0.8)", "hsla(300, 50%, 99%, 1)", "hsla(274, 78%, 98%, 1)", "hsla(275, 89%, 96%, 1)", "hsla(277, 81%, 94%, 1)", "hsla(275, 75%, 91%, 1)", "hsla(275, 69%, 86%, 1)", "hsla(273, 62%, 81%, 1)", "hsla(272, 60%, 74%, 1)", "hsla(272, 51%, 54%, 1)", "hsla(272, 45%, 50%, 1)", "hsla(272, 45%, 49%, 1)", "hsla(270, 50%, 25%, 1)", "hsla(270, 50%, 25%, 0)", "hsla(270, 50%, 25%, 0.2)", "hsla(270, 50%, 25%, 0.4)", "hsla(270, 50%, 25%, 0.6)", "hsla(270, 50%, 25%, 0.8)", "hsla(270, 50%, 25%, 0.1)", "hsla(270, 50%, 25%, 0.075)", "hsla(270, 50%, 25%, 0.05)", "hsla(270, 50%, 25%, 0.025)", "hsla(270, 50%, 25%, 0.02)", "hsla(270, 50%, 25%, 0.01)", "hsla(274, 78%, 98%, 0.1)", "hsla(274, 78%, 98%, 0.075)", "hsla(274, 78%, 98%, 0.05)", "hsla(274, 78%, 98%, 0.025)", "hsla(274, 78%, 98%, 0.02)", "hsla(274, 78%, 98%, 0.01)", "hsla(275, 69%, 86%, 0.6)", "hsla(160, 60%, 99%, 0)", "hsla(165, 50%, 97%, 0.2)", "hsla(165, 50%, 97%, 0.4)", "hsla(165, 50%, 97%, 0.6)", "hsla(165, 50%, 97%, 0.8)", "hsla(165, 67%, 99%, 1)", "hsla(165, 50%, 97%, 1)", "hsla(167, 63%, 93%, 1)", "hsla(166, 62%, 88%, 1)", "hsla(168, 54%, 82%, 1)", "hsla(168, 48%, 75%, 1)", "hsla(170, 43%, 66%, 1)", "hsla(172, 42%, 53%, 1)", "hsla(173, 80%, 36%, 1)", "hsla(173, 85%, 33%, 1)", "hsla(172, 100%, 26%, 1)", "hsla(174, 65%, 15%, 1)", "hsla(174, 66%, 15%, 0)", "hsla(174, 66%, 15%, 0.2)", "hsla(174, 66%, 15%, 0.4)", "hsla(174, 66%, 15%, 0.6)", "hsla(174, 66%, 15%, 0.8)", "hsla(174, 66%, 15%, 0.1)", "hsla(174, 66%, 15%, 0.075)", "hsla(174, 66%, 15%, 0.05)", "hsla(174, 66%, 15%, 0.025)", "hsla(174, 66%, 15%, 0.02)", "hsla(174, 66%, 15%, 0.01)", "hsla(165, 50%, 97%, 0.1)", "hsla(165, 50%, 97%, 0.075)", "hsla(165, 50%, 97%, 0.05)", "hsla(165, 50%, 97%, 0.025)", "hsla(165, 50%, 97%, 0.02)", "hsla(165, 50%, 97%, 0.01)", "hsla(168, 48%, 75%, 0.6)", "hsla(0, 0%, 68%, 0)", "hsla(0, 0%, 65%, 0.2)", "hsla(0, 0%, 65%, 0.4)", "hsla(0, 0%, 65%, 0.6)", "hsla(0, 0%, 65%, 0.8)", "hsla(0, 0%, 68%, 1)", "hsla(0, 0%, 65%, 1)", "hsla(0, 0%, 62%, 1)", "hsla(0, 0%, 56%, 1)", "hsla(0, 0%, 53%, 1)", "hsla(0, 0%, 50%, 1)", "hsla(0, 0%, 44%, 1)", "hsla(0, 0%, 41%, 1)", "hsla(0, 0%, 38%, 1)", "hsla(0, 0%, 32%, 1)", "hsla(0, 0%, 32%, 0)", "hsla(0, 0%, 32%, 0.2)", "hsla(0, 0%, 32%, 0.4)", "hsla(0, 0%, 32%, 0.6)", "hsla(0, 0%, 32%, 0.8)", "hsla(0, 0%, 32%, 0.1)", "hsla(0, 0%, 32%, 0.075)", "hsla(0, 0%, 32%, 0.05)", "hsla(0, 0%, 32%, 0.025)", "hsla(0, 0%, 32%, 0.02)", "hsla(0, 0%, 32%, 0.01)", "hsla(0, 0%, 65%, 0.1)", "hsla(0, 0%, 65%, 0.075)", "hsla(0, 0%, 65%, 0.05)", "hsla(0, 0%, 65%, 0.025)", "hsla(0, 0%, 65%, 0.02)", "hsla(0, 0%, 65%, 0.01)", "hsla(0, 0%, 53%, 0.6)", "hsla(0, 0%, 7%, 0)", "hsla(0, 0%, 10%, 0.2)", "hsla(0, 0%, 10%, 0.4)", "hsla(0, 0%, 10%, 0.6)", "hsla(0, 0%, 10%, 0.8)", "hsla(0, 0%, 7%, 1)", "hsla(0, 0%, 16%, 1)", "hsla(0, 0%, 19%, 1)", "hsla(0, 0%, 23%, 1)", "hsla(0, 0%, 28%, 1)", "hsla(0, 0%, 43%, 1)", "hsla(0, 0%, 48%, 1)", "hsla(0, 0%, 71%, 1)", "hsla(0, 0%, 93%, 0)", "hsla(0, 0%, 93%, 0.2)", "hsla(0, 0%, 93%, 0.4)", "hsla(0, 0%, 93%, 0.6)", "hsla(0, 0%, 93%, 0.8)", "hsla(0, 0%, 93%, 0.1)", "hsla(0, 0%, 93%, 0.075)", "hsla(0, 0%, 93%, 0.05)", "hsla(0, 0%, 93%, 0.025)", "hsla(0, 0%, 93%, 0.02)", "hsla(0, 0%, 93%, 0.01)", "hsla(0, 0%, 10%, 0.1)", "hsla(0, 0%, 10%, 0.075)", "hsla(0, 0%, 10%, 0.05)", "hsla(0, 0%, 10%, 0.025)", "hsla(0, 0%, 10%, 0.02)", "hsla(0, 0%, 10%, 0.01)", "hsla(0, 0%, 23%, 0.6)", "hsla(216, 43%, 9%, 0)", "hsla(218, 39%, 11%, 0.2)", "hsla(218, 39%, 11%, 0.4)", "hsla(218, 39%, 11%, 0.6)", "hsla(218, 39%, 11%, 0.8)", "hsla(215, 42%, 9%, 1)", "hsla(218, 39%, 11%, 1)", "hsla(212, 69%, 16%, 1)", "hsla(209, 100%, 19%, 1)", "hsla(207, 100%, 23%, 1)", "hsla(209, 79%, 30%, 1)", "hsla(211, 66%, 37%, 1)", "hsla(211, 65%, 45%, 1)", "hsla(210, 100%, 62%, 1)", "hsla(210, 100%, 72%, 1)", "hsla(205, 100%, 88%, 1)", "hsla(205, 100%, 88%, 0)", "hsla(205, 100%, 88%, 0.2)", "hsla(205, 100%, 88%, 0.4)", "hsla(205, 100%, 88%, 0.6)", "hsla(205, 100%, 88%, 0.8)", "hsla(205, 100%, 88%, 0.1)", "hsla(205, 100%, 88%, 0.075)", "hsla(205, 100%, 88%, 0.05)", "hsla(205, 100%, 88%, 0.025)", "hsla(205, 100%, 88%, 0.02)", "hsla(205, 100%, 88%, 0.01)", "hsla(218, 39%, 11%, 0.1)", "hsla(218, 39%, 11%, 0.075)", "hsla(218, 39%, 11%, 0.05)", "hsla(218, 39%, 11%, 0.025)", "hsla(218, 39%, 11%, 0.02)", "hsla(218, 39%, 11%, 0.01)", "hsla(209, 79%, 30%, 0.6)", "hsla(0, 17%, 8%, 0)", "hsla(355, 25%, 10%, 0.2)", "hsla(355, 25%, 10%, 0.4)", "hsla(355, 25%, 10%, 0.6)", "hsla(355, 25%, 10%, 0.8)", "hsla(0, 19%, 8%, 1)", "hsla(355, 25%, 10%, 1)", "hsla(350, 53%, 15%, 1)", "hsla(348, 68%, 19%, 1)", "hsla(350, 63%, 23%, 1)", "hsla(352, 53%, 29%, 1)", "hsla(355, 47%, 37%, 1)", "hsla(358, 45%, 49%, 1)", "hsla(360, 79%, 65%, 1)", "hsla(2, 100%, 79%, 1)", "hsla(350, 100%, 91%, 1)", "hsla(350, 100%, 91%, 0)", "hsla(350, 100%, 91%, 0.2)", "hsla(350, 100%, 91%, 0.4)", "hsla(350, 100%, 91%, 0.6)", "hsla(350, 100%, 91%, 0.8)", "hsla(350, 100%, 91%, 0.1)", "hsla(350, 100%, 91%, 0.075)", "hsla(350, 100%, 91%, 0.05)", "hsla(350, 100%, 91%, 0.025)", "hsla(350, 100%, 91%, 0.02)", "hsla(350, 100%, 91%, 0.01)", "hsla(355, 25%, 10%, 0.1)", "hsla(355, 25%, 10%, 0.075)", "hsla(355, 25%, 10%, 0.05)", "hsla(355, 25%, 10%, 0.025)", "hsla(355, 25%, 10%, 0.02)", "hsla(355, 25%, 10%, 0.01)", "hsla(352, 53%, 29%, 0.6)", "hsla(47, 29%, 6%, 0)", "hsla(45, 29%, 8%, 0.2)", "hsla(45, 29%, 8%, 0.4)", "hsla(45, 29%, 8%, 0.6)", "hsla(45, 29%, 8%, 0.8)", "hsla(47, 29%, 6%, 1)", "hsla(45, 29%, 8%, 1)", "hsla(45, 80%, 10%, 1)", "hsla(48, 100%, 11%, 1)", "hsla(47, 100%, 13%, 1)", "hsla(48, 95%, 16%, 1)", "hsla(46, 63%, 25%, 1)", "hsla(45, 60%, 32%, 1)", "hsla(60, 100%, 67%, 1)", "hsla(53, 90%, 62%, 1)", "hsla(53, 79%, 84%, 1)", "hsla(53, 78%, 84%, 0)", "hsla(53, 78%, 84%, 0.2)", "hsla(53, 78%, 84%, 0.4)", "hsla(53, 78%, 84%, 0.6)", "hsla(53, 78%, 84%, 0.8)", "hsla(53, 78%, 84%, 0.1)", "hsla(53, 78%, 84%, 0.075)", "hsla(53, 78%, 84%, 0.05)", "hsla(53, 78%, 84%, 0.025)", "hsla(53, 78%, 84%, 0.02)", "hsla(53, 78%, 84%, 0.01)", "hsla(45, 29%, 8%, 0.1)", "hsla(45, 29%, 8%, 0.075)", "hsla(45, 29%, 8%, 0.05)", "hsla(45, 29%, 8%, 0.025)", "hsla(45, 29%, 8%, 0.02)", "hsla(45, 29%, 8%, 0.01)", "hsla(48, 95%, 16%, 0.6)", "hsla(154, 20%, 7%, 0)", "hsla(153, 20%, 9%, 0.2)", "hsla(153, 20%, 9%, 0.4)", "hsla(153, 20%, 9%, 0.6)", "hsla(153, 20%, 9%, 0.8)", "hsla(154, 20%, 7%, 1)", "hsla(153, 20%, 9%, 1)", "hsla(152, 41%, 13%, 1)", "hsla(154, 55%, 15%, 1)", "hsla(154, 52%, 19%, 1)", "hsla(153, 46%, 23%, 1)", "hsla(152, 44%, 28%, 1)", "hsla(151, 45%, 34%, 1)", "hsla(151, 55%, 45%, 1)", "hsla(151, 65%, 54%, 1)", "hsla(144, 70%, 82%, 1)", "hsla(144, 70%, 82%, 0)", "hsla(144, 70%, 82%, 0.2)", "hsla(144, 70%, 82%, 0.4)", "hsla(144, 70%, 82%, 0.6)", "hsla(144, 70%, 82%, 0.8)", "hsla(144, 70%, 82%, 0.1)", "hsla(144, 70%, 82%, 0.075)", "hsla(144, 70%, 82%, 0.05)", "hsla(144, 70%, 82%, 0.025)", "hsla(144, 70%, 82%, 0.02)", "hsla(144, 70%, 82%, 0.01)", "hsla(153, 20%, 9%, 0.1)", "hsla(153, 20%, 9%, 0.075)", "hsla(153, 20%, 9%, 0.05)", "hsla(153, 20%, 9%, 0.025)", "hsla(153, 20%, 9%, 0.02)", "hsla(153, 20%, 9%, 0.01)", "hsla(153, 46%, 23%, 0.6)", "hsla(23, 22%, 7%, 0)", "hsla(28, 33%, 9%, 0.2)", "hsla(28, 33%, 9%, 0.4)", "hsla(28, 33%, 9%, 0.6)", "hsla(28, 33%, 9%, 0.8)", "hsla(27, 24%, 7%, 1)", "hsla(28, 33%, 9%, 1)", "hsla(29, 65%, 12%, 1)", "hsla(28, 100%, 14%, 1)", "hsla(28, 100%, 17%, 1)", "hsla(27, 79%, 22%, 1)", "hsla(25, 63%, 30%, 1)", "hsla(23, 60%, 40%, 1)", "hsla(26, 100%, 56%, 1)", "hsla(26, 100%, 67%, 1)", "hsla(30, 100%, 88%, 1)", "hsla(30, 100%, 88%, 0)", "hsla(30, 100%, 88%, 0.2)", "hsla(30, 100%, 88%, 0.4)", "hsla(30, 100%, 88%, 0.6)", "hsla(30, 100%, 88%, 0.8)", "hsla(30, 100%, 88%, 0.1)", "hsla(30, 100%, 88%, 0.075)", "hsla(30, 100%, 88%, 0.05)", "hsla(30, 100%, 88%, 0.025)", "hsla(30, 100%, 88%, 0.02)", "hsla(30, 100%, 88%, 0.01)", "hsla(28, 33%, 9%, 0.1)", "hsla(28, 33%, 9%, 0.075)", "hsla(28, 33%, 9%, 0.05)", "hsla(28, 33%, 9%, 0.025)", "hsla(28, 33%, 9%, 0.02)", "hsla(28, 33%, 9%, 0.01)", "hsla(27, 79%, 22%, 0.6)", "hsla(317, 17%, 8%, 0)", "hsla(316, 29%, 10%, 0.2)", "hsla(316, 29%, 10%, 0.4)", "hsla(316, 29%, 10%, 0.6)", "hsla(316, 29%, 10%, 0.8)", "hsla(315, 19%, 8%, 1)", "hsla(316, 29%, 10%, 1)", "hsla(315, 41%, 15%, 1)", "hsla(315, 58%, 19%, 1)", "hsla(318, 52%, 23%, 1)", "hsla(319, 44%, 29%, 1)", "hsla(321, 40%, 37%, 1)", "hsla(322, 40%, 47%, 1)", "hsla(323, 68%, 59%, 1)", "hsla(327, 100%, 78%, 1)", "hsla(326, 92%, 91%, 1)", "hsla(326, 91%, 91%, 0)", "hsla(326, 91%, 91%, 0.2)", "hsla(326, 91%, 91%, 0.4)", "hsla(326, 91%, 91%, 0.6)", "hsla(326, 91%, 91%, 0.8)", "hsla(326, 91%, 91%, 0.1)", "hsla(326, 91%, 91%, 0.075)", "hsla(326, 91%, 91%, 0.05)", "hsla(326, 91%, 91%, 0.025)", "hsla(326, 91%, 91%, 0.02)", "hsla(326, 91%, 91%, 0.01)", "hsla(316, 29%, 10%, 0.1)", "hsla(316, 29%, 10%, 0.075)", "hsla(316, 29%, 10%, 0.05)", "hsla(316, 29%, 10%, 0.025)", "hsla(316, 29%, 10%, 0.02)", "hsla(316, 29%, 10%, 0.01)", "hsla(319, 44%, 29%, 0.6)", "hsla(282, 22%, 9%, 0)", "hsla(279, 25%, 11%, 0.2)", "hsla(279, 25%, 11%, 0.4)", "hsla(279, 25%, 11%, 0.6)", "hsla(279, 25%, 11%, 0.8)", "hsla(282, 23%, 9%, 1)", "hsla(279, 25%, 11%, 1)", "hsla(279, 36%, 17%, 1)", "hsla(277, 39%, 22%, 1)", "hsla(276, 38%, 26%, 1)", "hsla(275, 35%, 31%, 1)", "hsla(274, 33%, 38%, 1)", "hsla(273, 33%, 50%, 1)", "hsla(272, 55%, 59%, 1)", "hsla(272, 100%, 81%, 1)", "hsla(275, 77%, 92%, 1)", "hsla(275, 76%, 92%, 0)", "hsla(275, 76%, 92%, 0.2)", "hsla(275, 76%, 92%, 0.4)", "hsla(275, 76%, 92%, 0.6)", "hsla(275, 76%, 92%, 0.8)", "hsla(275, 76%, 92%, 0.1)", "hsla(275, 76%, 92%, 0.075)", "hsla(275, 76%, 92%, 0.05)", "hsla(275, 76%, 92%, 0.025)", "hsla(275, 76%, 92%, 0.02)", "hsla(275, 76%, 92%, 0.01)", "hsla(279, 25%, 11%, 0.1)", "hsla(279, 25%, 11%, 0.075)", "hsla(279, 25%, 11%, 0.05)", "hsla(279, 25%, 11%, 0.025)", "hsla(279, 25%, 11%, 0.02)", "hsla(279, 25%, 11%, 0.01)", "hsla(275, 35%, 31%, 0.6)", "hsla(173, 22%, 7%, 0)", "hsla(175, 24%, 9%, 0.2)", "hsla(175, 24%, 9%, 0.4)", "hsla(175, 24%, 9%, 0.6)", "hsla(175, 24%, 9%, 0.8)", "hsla(173, 24%, 7%, 1)", "hsla(175, 24%, 9%, 1)", "hsla(174, 55%, 11%, 1)", "hsla(176, 93%, 12%, 1)", "hsla(175, 80%, 16%, 1)", "hsla(174, 63%, 21%, 1)", "hsla(174, 58%, 26%, 1)", "hsla(173, 59%, 31%, 1)", "hsla(172, 85%, 38%, 1)", "hsla(170, 90%, 45%, 1)", "hsla(163, 69%, 81%, 1)", "hsla(163, 69%, 81%, 0)", "hsla(163, 69%, 81%, 0.2)", "hsla(163, 69%, 81%, 0.4)", "hsla(163, 69%, 81%, 0.6)", "hsla(163, 69%, 81%, 0.8)", "hsla(163, 69%, 81%, 0.1)", "hsla(163, 69%, 81%, 0.075)", "hsla(163, 69%, 81%, 0.05)", "hsla(163, 69%, 81%, 0.025)", "hsla(163, 69%, 81%, 0.02)", "hsla(163, 69%, 81%, 0.01)", "hsla(175, 24%, 9%, 0.1)", "hsla(175, 24%, 9%, 0.075)", "hsla(175, 24%, 9%, 0.05)", "hsla(175, 24%, 9%, 0.025)", "hsla(175, 24%, 9%, 0.02)", "hsla(175, 24%, 9%, 0.01)", "hsla(174, 63%, 21%, 0.6)", "hsla(0, 0%, 4%, 0.2)", "hsla(0, 0%, 4%, 0.4)", "hsla(0, 0%, 4%, 0.6)", "hsla(0, 0%, 4%, 0.8)", "hsla(0, 0%, 99%, 0.2)", "hsla(0, 0%, 99%, 0.4)", "hsla(0, 0%, 99%, 0.6)", "hsla(0, 0%, 99%, 0.8)", "hsla(216, 100%, 99%, 0.2)", "hsla(216, 100%, 99%, 0.4)", "hsla(216, 100%, 99%, 0.6)", "hsla(216, 100%, 99%, 0.8)", "hsla(0, 100%, 99%, 0.2)", "hsla(0, 100%, 99%, 0.4)", "hsla(0, 100%, 99%, 0.6)", "hsla(0, 100%, 99%, 0.8)", "hsla(60, 45%, 98%, 0.2)", "hsla(60, 45%, 98%, 0.4)", "hsla(60, 45%, 98%, 0.6)", "hsla(60, 45%, 98%, 0.8)", "hsla(140, 60%, 99%, 0.2)", "hsla(140, 60%, 99%, 0.4)", "hsla(140, 60%, 99%, 0.6)", "hsla(140, 60%, 99%, 0.8)", "hsla(20, 60%, 99%, 0.2)", "hsla(20, 60%, 99%, 0.4)", "hsla(20, 60%, 99%, 0.6)", "hsla(20, 60%, 99%, 0.8)", "hsla(324, 100%, 99%, 0.2)", "hsla(324, 100%, 99%, 0.4)", "hsla(324, 100%, 99%, 0.6)", "hsla(324, 100%, 99%, 0.8)", "hsla(300, 60%, 99%, 0.2)", "hsla(300, 60%, 99%, 0.4)", "hsla(300, 60%, 99%, 0.6)", "hsla(300, 60%, 99%, 0.8)", "hsla(160, 60%, 99%, 0.2)", "hsla(160, 60%, 99%, 0.4)", "hsla(160, 60%, 99%, 0.6)", "hsla(160, 60%, 99%, 0.8)", "hsla(0, 0%, 68%, 0.2)", "hsla(0, 0%, 68%, 0.4)", "hsla(0, 0%, 68%, 0.6)", "hsla(0, 0%, 68%, 0.8)", "hsla(0, 0%, 7%, 0.2)", "hsla(0, 0%, 7%, 0.4)", "hsla(0, 0%, 7%, 0.6)", "hsla(0, 0%, 7%, 0.8)", "hsla(216, 43%, 9%, 0.2)", "hsla(216, 43%, 9%, 0.4)", "hsla(216, 43%, 9%, 0.6)", "hsla(216, 43%, 9%, 0.8)", "hsla(0, 17%, 8%, 0.2)", "hsla(0, 17%, 8%, 0.4)", "hsla(0, 17%, 8%, 0.6)", "hsla(0, 17%, 8%, 0.8)", "hsla(47, 29%, 6%, 0.2)", "hsla(47, 29%, 6%, 0.4)", "hsla(47, 29%, 6%, 0.6)", "hsla(47, 29%, 6%, 0.8)", "hsla(154, 20%, 7%, 0.2)", "hsla(154, 20%, 7%, 0.4)", "hsla(154, 20%, 7%, 0.6)", "hsla(154, 20%, 7%, 0.8)", "hsla(23, 22%, 7%, 0.2)", "hsla(23, 22%, 7%, 0.4)", "hsla(23, 22%, 7%, 0.6)", "hsla(23, 22%, 7%, 0.8)", "hsla(317, 17%, 8%, 0.2)", "hsla(317, 17%, 8%, 0.4)", "hsla(317, 17%, 8%, 0.6)", "hsla(317, 17%, 8%, 0.8)", "hsla(282, 22%, 9%, 0.2)", "hsla(282, 22%, 9%, 0.4)", "hsla(282, 22%, 9%, 0.6)", "hsla(282, 22%, 9%, 0.8)", "hsla(173, 22%, 7%, 0.2)", "hsla(173, 22%, 7%, 0.4)", "hsla(173, 22%, 7%, 0.6)", "hsla(173, 22%, 7%, 0.8)"];
var ks2 = ["accentBackground", "accentColor", "background0", "background02", "background04", "background06", "background08", "color1", "color2", "color3", "color4", "color5", "color6", "color7", "color8", "color9", "color10", "color11", "color12", "color0", "color02", "color04", "color06", "color08", "color", "colorHover", "colorPress", "colorFocus", "background", "backgroundHover", "backgroundPress", "backgroundFocus", "backgroundActive", "borderColor", "borderColorHover", "borderColorFocus", "borderColorPress", "placeholderColor", "colorTransparent", "black1", "black2", "black3", "black4", "black5", "black6", "black7", "black8", "black9", "black10", "black11", "black12", "white1", "white2", "white3", "white4", "white5", "white6", "white7", "white8", "white9", "white10", "white11", "white12", "white", "white0", "white02", "white04", "white06", "white08", "black", "black0", "black02", "black04", "black06", "black08", "shadow1", "shadow2", "shadow3", "shadow4", "shadow5", "shadow6", "shadow7", "shadow8", "highlight1", "highlight2", "highlight3", "highlight4", "highlight5", "highlight6", "highlight7", "highlight8", "shadowColor", "gray1", "gray2", "gray3", "gray4", "gray5", "gray6", "gray7", "gray8", "gray9", "gray10", "gray11", "gray12", "blue1", "blue2", "blue3", "blue4", "blue5", "blue6", "blue7", "blue8", "blue9", "blue10", "blue11", "blue12", "red1", "red2", "red3", "red4", "red5", "red6", "red7", "red8", "red9", "red10", "red11", "red12", "yellow1", "yellow2", "yellow3", "yellow4", "yellow5", "yellow6", "yellow7", "yellow8", "yellow9", "yellow10", "yellow11", "yellow12", "green1", "green2", "green3", "green4", "green5", "green6", "green7", "green8", "green9", "green10", "green11", "green12", "orange1", "orange2", "orange3", "orange4", "orange5", "orange6", "orange7", "orange8", "orange9", "orange10", "orange11", "orange12", "pink1", "pink2", "pink3", "pink4", "pink5", "pink6", "pink7", "pink8", "pink9", "pink10", "pink11", "pink12", "purple1", "purple2", "purple3", "purple4", "purple5", "purple6", "purple7", "purple8", "purple9", "purple10", "purple11", "purple12", "teal1", "teal2", "teal3", "teal4", "teal5", "teal6", "teal7", "teal8", "teal9", "teal10", "teal11", "teal12", "neutral1", "neutral2", "neutral3", "neutral4", "neutral5", "neutral6", "neutral7", "neutral8", "neutral9", "neutral10", "neutral11", "neutral12", "accent1", "accent2", "accent3", "accent4", "accent5", "accent6", "accent7", "accent8", "accent9", "accent10", "accent11", "accent12", "color01", "color0075", "color005", "color0025", "color002", "color001", "background01", "background0075", "background005", "background0025", "background002", "background001", "outlineColor"];
var n125 = t2([[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9], [10, 10], [11, 11], [12, 12], [13, 13], [14, 14], [15, 15], [16, 16], [17, 17], [18, 18], [19, 19], [20, 20], [21, 21], [22, 22], [23, 23], [24, 18], [25, 18], [26, 18], [27, 23], [28, 8], [29, 7], [30, 9], [31, 9], [32, 8], [33, 10], [34, 9], [35, 10], [36, 11], [37, 15], [38, 19], [39, 24], [40, 25], [41, 26], [42, 27], [43, 28], [44, 29], [45, 30], [46, 31], [47, 32], [48, 33], [49, 34], [50, 35], [51, 36], [52, 37], [53, 38], [54, 39], [55, 40], [56, 41], [57, 42], [58, 43], [59, 44], [60, 45], [61, 46], [62, 47], [63, 48], [64, 49], [65, 50], [66, 51], [67, 52], [68, 53], [69, 54], [70, 55], [71, 56], [72, 57], [73, 58], [74, 59], [75, 60], [76, 61], [77, 62], [78, 63], [79, 64], [80, 65], [81, 58], [82, 66], [83, 67], [84, 68], [85, 69], [86, 70], [87, 51], [88, 71], [89, 72], [90, 73], [91, 62], [92, 74], [93, 75], [94, 76], [95, 77], [96, 78], [97, 79], [98, 80], [99, 81], [100, 82], [101, 83], [102, 84], [103, 85], [104, 86], [105, 87], [106, 88], [107, 89], [108, 90], [109, 91], [110, 92], [111, 93], [112, 94], [113, 95], [114, 96], [115, 97], [116, 98], [117, 99], [118, 100], [119, 101], [120, 102], [121, 103], [122, 104], [123, 105], [124, 106], [125, 107], [126, 108], [127, 109], [128, 110], [129, 111], [130, 112], [131, 113], [132, 114], [133, 115], [134, 116], [135, 117], [136, 118], [137, 119], [138, 120], [139, 121], [140, 122], [141, 123], [142, 124], [143, 125], [144, 126], [145, 127], [146, 128], [147, 129], [148, 130], [149, 131], [150, 132], [151, 133], [152, 134], [153, 135], [154, 136], [155, 137], [156, 138], [157, 139], [158, 140], [159, 141], [160, 142], [161, 143], [162, 144], [163, 145], [164, 146], [165, 147], [166, 148], [167, 149], [168, 150], [169, 151], [170, 152], [171, 153], [172, 154], [173, 155], [174, 156], [175, 157], [176, 158], [177, 159], [178, 160], [179, 161], [180, 162], [181, 163], [182, 164], [183, 165], [184, 166], [185, 167], [186, 168], [187, 169], [188, 170], [189, 171], [190, 172], [191, 173], [192, 174], [193, 175], [194, 176], [195, 177], [196, 178], [197, 179], [198, 180], [199, 181], [200, 182], [201, 183], [202, 184], [203, 42], [204, 185], [205, 186], [206, 187], [207, 188], [208, 189], [209, 190], [210, 191], [211, 192], [212, 193], [213, 194], [214, 0], [215, 17], [216, 16], [217, 195], [218, 196], [219, 197], [220, 198], [221, 1], [222, 11], [223, 7], [224, 199], [225, 200], [226, 201], [227, 202], [228, 203], [229, 204], [230, 205], [231, 206], [232, 207], [233, 208], [234, 209], [235, 210], [236, 211]]);
var n210 = t2([[0, 16], [1, 9], [2, 212], [3, 213], [4, 214], [5, 215], [6, 216], [7, 193], [8, 194], [9, 0], [10, 17], [11, 16], [12, 195], [13, 196], [14, 197], [15, 198], [16, 1], [17, 11], [18, 7], [19, 2], [20, 217], [21, 218], [22, 219], [23, 220], [24, 7], [25, 220], [26, 7], [27, 11], [28, 194], [29, 0], [30, 193], [31, 0], [32, 194], [33, 17], [34, 16], [35, 17], [36, 0], [37, 198], [38, 2], [39, 24], [40, 25], [41, 26], [42, 27], [43, 28], [44, 29], [45, 30], [46, 31], [47, 32], [48, 33], [49, 34], [50, 35], [51, 36], [52, 37], [53, 38], [54, 39], [55, 40], [56, 41], [57, 42], [58, 43], [59, 44], [60, 45], [61, 46], [62, 47], [63, 48], [64, 49], [65, 50], [66, 51], [67, 52], [68, 53], [69, 54], [70, 55], [71, 56], [72, 57], [73, 58], [74, 59], [75, 221], [76, 222], [77, 64], [78, 223], [79, 224], [80, 59], [81, 225], [82, 54], [83, 68], [84, 50], [85, 70], [86, 226], [87, 227], [88, 73], [89, 228], [90, 48], [91, 64], [92, 229], [93, 26], [94, 230], [95, 231], [96, 232], [97, 233], [98, 234], [99, 235], [100, 236], [101, 237], [102, 238], [103, 239], [104, 240], [105, 241], [106, 242], [107, 243], [108, 244], [109, 245], [110, 246], [111, 247], [112, 94], [113, 248], [114, 249], [115, 250], [116, 251], [117, 252], [118, 253], [119, 254], [120, 255], [121, 256], [122, 257], [123, 258], [124, 106], [125, 259], [126, 260], [127, 261], [128, 262], [129, 263], [130, 264], [131, 265], [132, 266], [133, 267], [134, 268], [135, 269], [136, 118], [137, 270], [138, 271], [139, 272], [140, 273], [141, 274], [142, 275], [143, 276], [144, 277], [145, 278], [146, 279], [147, 280], [148, 130], [149, 281], [150, 282], [151, 283], [152, 284], [153, 285], [154, 286], [155, 287], [156, 288], [157, 289], [158, 290], [159, 291], [160, 142], [161, 292], [162, 293], [163, 294], [164, 295], [165, 296], [166, 297], [167, 298], [168, 299], [169, 300], [170, 301], [171, 302], [172, 154], [173, 303], [174, 304], [175, 305], [176, 306], [177, 307], [178, 308], [179, 309], [180, 310], [181, 311], [182, 312], [183, 313], [184, 166], [185, 314], [186, 315], [187, 316], [188, 317], [189, 318], [190, 319], [191, 320], [192, 321], [193, 322], [194, 323], [195, 324], [196, 178], [197, 325], [198, 326], [199, 327], [200, 182], [201, 183], [202, 184], [203, 42], [204, 185], [205, 186], [206, 187], [207, 188], [208, 189], [209, 190], [210, 191], [211, 192], [212, 7], [213, 8], [214, 9], [215, 10], [216, 11], [217, 12], [218, 13], [219, 14], [220, 15], [221, 16], [222, 17], [223, 18], [224, 328], [225, 329], [226, 330], [227, 331], [228, 332], [229, 333], [230, 334], [231, 335], [232, 336], [233, 337], [234, 338], [235, 339], [236, 340]]);
var n310 = t2([[0, 9], [1, 16], [2, 212], [3, 213], [4, 214], [5, 215], [6, 216], [7, 193], [8, 194], [9, 0], [10, 17], [11, 16], [12, 195], [13, 196], [14, 197], [15, 198], [16, 1], [17, 11], [18, 7], [19, 2], [20, 217], [21, 218], [22, 219], [23, 220], [24, 7], [25, 7], [26, 7], [27, 220], [28, 194], [29, 193], [30, 0], [31, 0], [32, 194], [33, 17], [34, 0], [35, 17], [36, 16], [37, 198], [38, 2], [224, 328], [225, 329], [226, 330], [227, 331], [228, 332], [229, 333], [230, 334], [231, 335], [232, 336], [233, 337], [234, 338], [235, 339], [236, 340]]);
var n410 = t2([[0, 1], [1, 0], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9], [10, 10], [11, 11], [12, 12], [13, 13], [14, 14], [15, 15], [16, 16], [17, 17], [18, 18], [19, 19], [20, 20], [21, 21], [22, 22], [23, 23], [24, 18], [25, 23], [26, 18], [27, 17], [28, 8], [29, 9], [30, 7], [31, 9], [32, 8], [33, 10], [34, 11], [35, 10], [36, 9], [37, 15], [38, 19], [224, 199], [225, 200], [226, 201], [227, 202], [228, 203], [229, 204], [230, 205], [231, 206], [232, 207], [233, 208], [234, 209], [235, 210], [236, 211]]);
var n510 = t2([[0, 0], [1, 1], [2, 212], [3, 213], [4, 214], [5, 215], [6, 216], [7, 193], [8, 194], [9, 0], [10, 17], [11, 16], [12, 195], [13, 196], [14, 197], [15, 198], [16, 1], [17, 11], [18, 7], [19, 2], [20, 217], [21, 218], [22, 219], [23, 220], [24, 7], [25, 7], [26, 7], [27, 220], [28, 194], [29, 193], [30, 0], [31, 0], [32, 194], [33, 17], [34, 0], [35, 17], [36, 16], [37, 198], [38, 2], [224, 328], [225, 329], [226, 330], [227, 331], [228, 332], [229, 333], [230, 334], [231, 335], [232, 336], [233, 337], [234, 338], [235, 339], [236, 340]]);
var n610 = t2([[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9], [10, 10], [11, 11], [12, 12], [13, 13], [14, 14], [15, 15], [16, 16], [17, 17], [18, 18], [19, 19], [20, 20], [21, 21], [22, 22], [23, 23], [24, 18], [25, 18], [26, 18], [27, 23], [28, 8], [29, 7], [30, 9], [31, 9], [32, 8], [33, 10], [34, 9], [35, 10], [36, 11], [37, 15], [38, 19], [224, 199], [225, 200], [226, 201], [227, 202], [228, 203], [229, 204], [230, 205], [231, 206], [232, 207], [233, 208], [234, 209], [235, 210], [236, 211]]);
var n710 = t2([[0, 0], [1, 1], [2, 341], [3, 342], [4, 343], [5, 344], [6, 345], [7, 346], [8, 347], [9, 348], [10, 349], [11, 350], [12, 10], [13, 351], [14, 352], [15, 353], [16, 354], [17, 355], [18, 356], [19, 357], [20, 358], [21, 359], [22, 360], [23, 361], [24, 356], [25, 356], [26, 356], [27, 361], [28, 347], [29, 346], [30, 348], [31, 348], [32, 347], [33, 349], [34, 348], [35, 349], [36, 350], [37, 353], [38, 357], [224, 362], [225, 363], [226, 364], [227, 365], [228, 366], [229, 367], [230, 368], [231, 369], [232, 370], [233, 371], [234, 372], [235, 373], [236, 374]]);
var n810 = t2([[0, 0], [1, 1], [2, 375], [3, 376], [4, 377], [5, 378], [6, 379], [7, 380], [8, 381], [9, 382], [10, 383], [11, 384], [12, 385], [13, 386], [14, 387], [15, 388], [16, 389], [17, 390], [18, 391], [19, 392], [20, 393], [21, 394], [22, 395], [23, 396], [24, 391], [25, 391], [26, 391], [27, 396], [28, 381], [29, 380], [30, 382], [31, 382], [32, 381], [33, 383], [34, 382], [35, 383], [36, 384], [37, 388], [38, 392], [224, 397], [225, 398], [226, 399], [227, 400], [228, 401], [229, 402], [230, 403], [231, 404], [232, 405], [233, 406], [234, 407], [235, 408], [236, 409]]);
var n910 = t2([[0, 0], [1, 1], [2, 410], [3, 411], [4, 412], [5, 413], [6, 414], [7, 415], [8, 416], [9, 417], [10, 418], [11, 419], [12, 420], [13, 421], [14, 422], [15, 423], [16, 424], [17, 425], [18, 426], [19, 427], [20, 428], [21, 429], [22, 430], [23, 431], [24, 426], [25, 426], [26, 426], [27, 431], [28, 416], [29, 415], [30, 417], [31, 417], [32, 416], [33, 418], [34, 417], [35, 418], [36, 419], [37, 423], [38, 427], [224, 432], [225, 433], [226, 434], [227, 435], [228, 436], [229, 437], [230, 438], [231, 439], [232, 440], [233, 441], [234, 442], [235, 443], [236, 444]]);
var n1010 = t2([[0, 0], [1, 1], [2, 445], [3, 446], [4, 447], [5, 448], [6, 449], [7, 450], [8, 451], [9, 452], [10, 453], [11, 454], [12, 455], [13, 456], [14, 457], [15, 458], [16, 459], [17, 460], [18, 461], [19, 462], [20, 463], [21, 464], [22, 465], [23, 466], [24, 461], [25, 461], [26, 461], [27, 466], [28, 451], [29, 450], [30, 452], [31, 452], [32, 451], [33, 453], [34, 452], [35, 453], [36, 454], [37, 458], [38, 462], [224, 467], [225, 468], [226, 469], [227, 470], [228, 471], [229, 472], [230, 473], [231, 474], [232, 475], [233, 476], [234, 477], [235, 478], [236, 479]]);
var n1110 = t2([[0, 0], [1, 1], [2, 480], [3, 481], [4, 482], [5, 483], [6, 484], [7, 485], [8, 486], [9, 487], [10, 488], [11, 489], [12, 490], [13, 491], [14, 492], [15, 493], [16, 494], [17, 495], [18, 496], [19, 497], [20, 498], [21, 499], [22, 500], [23, 501], [24, 496], [25, 496], [26, 496], [27, 501], [28, 486], [29, 485], [30, 487], [31, 487], [32, 486], [33, 488], [34, 487], [35, 488], [36, 489], [37, 493], [38, 497], [224, 502], [225, 503], [226, 504], [227, 505], [228, 506], [229, 507], [230, 508], [231, 509], [232, 510], [233, 511], [234, 512], [235, 513], [236, 514]]);
var n126 = t2([[0, 0], [1, 1], [2, 515], [3, 516], [4, 517], [5, 518], [6, 519], [7, 520], [8, 521], [9, 522], [10, 523], [11, 524], [12, 525], [13, 526], [14, 527], [15, 528], [16, 529], [17, 530], [18, 531], [19, 532], [20, 533], [21, 534], [22, 535], [23, 536], [24, 531], [25, 531], [26, 531], [27, 536], [28, 521], [29, 520], [30, 522], [31, 522], [32, 521], [33, 523], [34, 522], [35, 523], [36, 524], [37, 528], [38, 532], [224, 537], [225, 538], [226, 539], [227, 540], [228, 541], [229, 542], [230, 543], [231, 544], [232, 545], [233, 546], [234, 547], [235, 548], [236, 549]]);
var n132 = t2([[0, 0], [1, 1], [2, 550], [3, 551], [4, 552], [5, 553], [6, 554], [7, 555], [8, 556], [9, 557], [10, 558], [11, 559], [12, 560], [13, 561], [14, 562], [15, 563], [16, 564], [17, 565], [18, 566], [19, 567], [20, 568], [21, 569], [22, 570], [23, 571], [24, 566], [25, 566], [26, 566], [27, 571], [28, 556], [29, 555], [30, 557], [31, 557], [32, 556], [33, 558], [34, 557], [35, 558], [36, 559], [37, 563], [38, 567], [224, 572], [225, 573], [226, 574], [227, 575], [228, 576], [229, 577], [230, 578], [231, 579], [232, 580], [233, 581], [234, 582], [235, 583], [236, 584]]);
var n142 = t2([[0, 0], [1, 1], [2, 585], [3, 586], [4, 587], [5, 588], [6, 589], [7, 590], [8, 591], [9, 592], [10, 593], [11, 594], [12, 595], [13, 596], [14, 597], [15, 598], [16, 599], [17, 600], [18, 601], [19, 602], [20, 603], [21, 604], [22, 605], [23, 606], [24, 601], [25, 601], [26, 601], [27, 606], [28, 591], [29, 590], [30, 592], [31, 592], [32, 591], [33, 593], [34, 592], [35, 593], [36, 594], [37, 598], [38, 602], [224, 607], [225, 608], [226, 609], [227, 610], [228, 611], [229, 612], [230, 613], [231, 614], [232, 615], [233, 616], [234, 617], [235, 618], [236, 619]]);
var n152 = t2([[0, 0], [1, 1], [2, 620], [3, 621], [4, 622], [5, 623], [6, 624], [7, 625], [8, 626], [9, 627], [10, 628], [11, 629], [12, 630], [13, 631], [14, 632], [15, 633], [16, 634], [17, 635], [18, 636], [19, 637], [20, 638], [21, 639], [22, 640], [23, 641], [24, 636], [25, 636], [26, 636], [27, 641], [28, 626], [29, 625], [30, 627], [31, 627], [32, 626], [33, 628], [34, 627], [35, 628], [36, 629], [37, 633], [38, 637], [224, 642], [225, 643], [226, 644], [227, 645], [228, 646], [229, 647], [230, 648], [231, 649], [232, 650], [233, 651], [234, 652], [235, 653], [236, 654]]);
var n162 = t2([[0, 0], [1, 1], [2, 655], [3, 656], [4, 657], [5, 658], [6, 659], [7, 660], [8, 661], [9, 662], [10, 13], [11, 663], [12, 664], [13, 665], [14, 197], [15, 666], [16, 667], [17, 668], [18, 669], [19, 670], [20, 671], [21, 672], [22, 673], [23, 674], [24, 669], [25, 669], [26, 669], [27, 674], [28, 661], [29, 660], [30, 662], [31, 662], [32, 661], [33, 13], [34, 662], [35, 13], [36, 663], [37, 666], [38, 670], [224, 675], [225, 676], [226, 677], [227, 678], [228, 679], [229, 680], [230, 681], [231, 682], [232, 683], [233, 684], [234, 685], [235, 686], [236, 687]]);
var n172 = t2([[0, 16], [1, 9], [2, 212], [3, 213], [4, 214], [5, 215], [6, 216], [7, 193], [8, 194], [9, 0], [10, 17], [11, 16], [12, 195], [13, 196], [14, 197], [15, 198], [16, 1], [17, 11], [18, 7], [19, 2], [20, 217], [21, 218], [22, 219], [23, 220], [24, 7], [25, 220], [26, 7], [27, 11], [28, 194], [29, 0], [30, 193], [31, 0], [32, 194], [33, 17], [34, 16], [35, 17], [36, 0], [37, 198], [38, 2], [224, 328], [225, 329], [226, 330], [227, 331], [228, 332], [229, 333], [230, 334], [231, 335], [232, 336], [233, 337], [234, 338], [235, 339], [236, 340]]);
var n182 = t2([[0, 16], [1, 9], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9], [10, 10], [11, 11], [12, 12], [13, 13], [14, 14], [15, 15], [16, 16], [17, 17], [18, 18], [19, 19], [20, 20], [21, 21], [22, 22], [23, 23], [24, 18], [25, 23], [26, 18], [27, 17], [28, 8], [29, 9], [30, 7], [31, 9], [32, 8], [33, 10], [34, 11], [35, 10], [36, 9], [37, 15], [38, 19], [224, 199], [225, 200], [226, 201], [227, 202], [228, 203], [229, 204], [230, 205], [231, 206], [232, 207], [233, 208], [234, 209], [235, 210], [236, 211]]);
var n192 = t2([[0, 16], [1, 9], [2, 688], [3, 689], [4, 690], [5, 691], [6, 692], [7, 693], [8, 0], [9, 356], [10, 694], [11, 695], [12, 696], [13, 697], [14, 668], [15, 698], [16, 699], [17, 700], [18, 9], [19, 701], [20, 702], [21, 703], [22, 704], [23, 705], [24, 9], [25, 705], [26, 9], [27, 700], [28, 0], [29, 356], [30, 693], [31, 356], [32, 0], [33, 694], [34, 695], [35, 694], [36, 356], [37, 698], [38, 701], [224, 706], [225, 707], [226, 708], [227, 709], [228, 710], [229, 711], [230, 712], [231, 713], [232, 714], [233, 715], [234, 716], [235, 717], [236, 718]]);
var n202 = t2([[0, 16], [1, 9], [2, 719], [3, 720], [4, 721], [5, 722], [6, 723], [7, 724], [8, 725], [9, 726], [10, 727], [11, 728], [12, 729], [13, 730], [14, 731], [15, 388], [16, 732], [17, 733], [18, 734], [19, 735], [20, 736], [21, 737], [22, 738], [23, 739], [24, 734], [25, 739], [26, 734], [27, 733], [28, 725], [29, 726], [30, 724], [31, 726], [32, 725], [33, 727], [34, 728], [35, 727], [36, 726], [37, 388], [38, 735], [224, 740], [225, 741], [226, 742], [227, 743], [228, 744], [229, 745], [230, 746], [231, 747], [232, 748], [233, 749], [234, 750], [235, 751], [236, 752]]);
var n212 = t2([[0, 16], [1, 9], [2, 753], [3, 754], [4, 755], [5, 756], [6, 757], [7, 758], [8, 759], [9, 760], [10, 761], [11, 762], [12, 763], [13, 764], [14, 765], [15, 423], [16, 766], [17, 767], [18, 768], [19, 769], [20, 770], [21, 771], [22, 772], [23, 773], [24, 768], [25, 773], [26, 768], [27, 767], [28, 759], [29, 760], [30, 758], [31, 760], [32, 759], [33, 761], [34, 762], [35, 761], [36, 760], [37, 423], [38, 769], [224, 774], [225, 775], [226, 776], [227, 777], [228, 778], [229, 779], [230, 780], [231, 781], [232, 782], [233, 783], [234, 784], [235, 785], [236, 786]]);
var n222 = t2([[0, 16], [1, 9], [2, 787], [3, 788], [4, 789], [5, 790], [6, 791], [7, 792], [8, 793], [9, 794], [10, 795], [11, 796], [12, 797], [13, 798], [14, 799], [15, 458], [16, 800], [17, 801], [18, 802], [19, 803], [20, 804], [21, 805], [22, 806], [23, 807], [24, 802], [25, 807], [26, 802], [27, 801], [28, 793], [29, 794], [30, 792], [31, 794], [32, 793], [33, 795], [34, 796], [35, 795], [36, 794], [37, 458], [38, 803], [224, 808], [225, 809], [226, 810], [227, 811], [228, 812], [229, 813], [230, 814], [231, 815], [232, 816], [233, 817], [234, 818], [235, 819], [236, 820]]);
var n232 = t2([[0, 16], [1, 9], [2, 821], [3, 822], [4, 823], [5, 824], [6, 825], [7, 826], [8, 827], [9, 828], [10, 829], [11, 830], [12, 831], [13, 832], [14, 833], [15, 493], [16, 834], [17, 835], [18, 836], [19, 837], [20, 838], [21, 839], [22, 840], [23, 841], [24, 836], [25, 841], [26, 836], [27, 835], [28, 827], [29, 828], [30, 826], [31, 828], [32, 827], [33, 829], [34, 830], [35, 829], [36, 828], [37, 493], [38, 837], [224, 842], [225, 843], [226, 844], [227, 845], [228, 846], [229, 847], [230, 848], [231, 849], [232, 850], [233, 851], [234, 852], [235, 853], [236, 854]]);
var n242 = t2([[0, 16], [1, 9], [2, 855], [3, 856], [4, 857], [5, 858], [6, 859], [7, 860], [8, 861], [9, 862], [10, 863], [11, 864], [12, 865], [13, 866], [14, 867], [15, 528], [16, 868], [17, 869], [18, 870], [19, 871], [20, 872], [21, 873], [22, 874], [23, 875], [24, 870], [25, 875], [26, 870], [27, 869], [28, 861], [29, 862], [30, 860], [31, 862], [32, 861], [33, 863], [34, 864], [35, 863], [36, 862], [37, 528], [38, 871], [224, 876], [225, 877], [226, 878], [227, 879], [228, 880], [229, 881], [230, 882], [231, 883], [232, 884], [233, 885], [234, 886], [235, 887], [236, 888]]);
var n252 = t2([[0, 16], [1, 9], [2, 889], [3, 890], [4, 891], [5, 892], [6, 893], [7, 894], [8, 895], [9, 896], [10, 897], [11, 898], [12, 899], [13, 900], [14, 901], [15, 563], [16, 902], [17, 903], [18, 904], [19, 905], [20, 906], [21, 907], [22, 908], [23, 909], [24, 904], [25, 909], [26, 904], [27, 903], [28, 895], [29, 896], [30, 894], [31, 896], [32, 895], [33, 897], [34, 898], [35, 897], [36, 896], [37, 563], [38, 905], [224, 910], [225, 911], [226, 912], [227, 913], [228, 914], [229, 915], [230, 916], [231, 917], [232, 918], [233, 919], [234, 920], [235, 921], [236, 922]]);
var n262 = t2([[0, 16], [1, 9], [2, 923], [3, 924], [4, 925], [5, 926], [6, 927], [7, 928], [8, 929], [9, 930], [10, 931], [11, 932], [12, 933], [13, 934], [14, 935], [15, 598], [16, 936], [17, 937], [18, 938], [19, 939], [20, 940], [21, 941], [22, 942], [23, 943], [24, 938], [25, 943], [26, 938], [27, 937], [28, 929], [29, 930], [30, 928], [31, 930], [32, 929], [33, 931], [34, 932], [35, 931], [36, 930], [37, 598], [38, 939], [224, 944], [225, 945], [226, 946], [227, 947], [228, 948], [229, 949], [230, 950], [231, 951], [232, 952], [233, 953], [234, 954], [235, 955], [236, 956]]);
var n272 = t2([[0, 16], [1, 9], [2, 957], [3, 958], [4, 959], [5, 960], [6, 961], [7, 962], [8, 963], [9, 964], [10, 965], [11, 966], [12, 967], [13, 968], [14, 969], [15, 633], [16, 970], [17, 971], [18, 972], [19, 973], [20, 974], [21, 975], [22, 976], [23, 977], [24, 972], [25, 977], [26, 972], [27, 971], [28, 963], [29, 964], [30, 962], [31, 964], [32, 963], [33, 965], [34, 966], [35, 965], [36, 964], [37, 633], [38, 973], [224, 978], [225, 979], [226, 980], [227, 981], [228, 982], [229, 983], [230, 984], [231, 985], [232, 986], [233, 987], [234, 988], [235, 989], [236, 990]]);
var n282 = t2([[0, 16], [1, 9], [2, 655], [3, 656], [4, 657], [5, 658], [6, 659], [7, 660], [8, 661], [9, 662], [10, 13], [11, 663], [12, 664], [13, 665], [14, 197], [15, 666], [16, 667], [17, 668], [18, 669], [19, 670], [20, 671], [21, 672], [22, 673], [23, 674], [24, 669], [25, 674], [26, 669], [27, 668], [28, 661], [29, 662], [30, 660], [31, 662], [32, 661], [33, 13], [34, 663], [35, 13], [36, 662], [37, 666], [38, 670], [224, 675], [225, 676], [226, 677], [227, 678], [228, 679], [229, 680], [230, 681], [231, 682], [232, 683], [233, 684], [234, 685], [235, 686], [236, 687]]);
var n292 = t2([[24, 17], [25, 17], [26, 17], [27, 18], [28, 9], [29, 8], [30, 10], [31, 11], [32, 9], [33, 11], [34, 10], [35, 11], [36, 12], [224, 199], [225, 200], [226, 201], [227, 202], [228, 203], [229, 204], [230, 205], [231, 206], [232, 207], [233, 208], [234, 209], [235, 210], [3, 3], [4, 4], [5, 5], [6, 6], [236, 211]]);
var n302 = t2([[24, 17], [25, 17], [26, 17], [27, 18], [28, 10], [29, 9], [30, 11], [31, 13], [32, 10], [33, 12], [34, 11], [35, 12], [36, 13], [224, 199], [225, 200], [226, 201], [227, 202], [228, 203], [229, 204], [230, 205], [231, 206], [232, 207], [233, 208], [234, 209], [235, 210], [3, 3], [4, 4], [5, 5], [6, 6], [236, 211]]);
var n312 = t2([[24, 11], [25, 7], [26, 11], [27, 1], [28, 0], [29, 17], [30, 194], [31, 16], [32, 0], [33, 16], [34, 195], [35, 16], [36, 17], [224, 328], [225, 329], [226, 330], [227, 331], [228, 332], [229, 333], [230, 334], [231, 335], [232, 336], [233, 337], [234, 338], [235, 339], [3, 213], [4, 214], [5, 215], [6, 216], [236, 340]]);
var n322 = t2([[24, 11], [25, 7], [26, 11], [27, 1], [28, 17], [29, 16], [30, 0], [31, 196], [32, 17], [33, 195], [34, 196], [35, 195], [36, 16], [224, 328], [225, 329], [226, 330], [227, 331], [228, 332], [229, 333], [230, 334], [231, 335], [232, 336], [233, 337], [234, 338], [235, 339], [3, 213], [4, 214], [5, 215], [6, 216], [236, 340]]);
var n332 = t2([[0, 1], [1, 0], [2, 2], [3, 213], [4, 214], [5, 215], [6, 216], [7, 7], [8, 11], [9, 1], [10, 198], [11, 197], [12, 196], [13, 195], [14, 16], [15, 17], [16, 0], [17, 194], [18, 193], [19, 212], [20, 991], [21, 992], [22, 993], [23, 994], [24, 193], [25, 193], [26, 193], [27, 994], [28, 11], [29, 7], [30, 1], [31, 1], [32, 11], [33, 198], [34, 1], [35, 198], [36, 197], [37, 17], [38, 212], [224, 328], [225, 329], [226, 330], [227, 331], [228, 332], [229, 333], [230, 334], [231, 335], [232, 336], [233, 337], [234, 338], [235, 339], [236, 340]]);
var n342 = t2([[24, 11], [25, 11], [26, 11], [27, 7], [28, 0], [29, 194], [30, 17], [31, 16], [32, 0], [33, 16], [34, 17], [35, 16], [36, 195], [224, 328], [225, 329], [226, 330], [227, 331], [228, 332], [229, 333], [230, 334], [231, 335], [232, 336], [233, 337], [234, 338], [235, 339], [3, 213], [4, 214], [5, 215], [6, 216], [236, 340]]);
var n352 = t2([[24, 11], [25, 11], [26, 11], [27, 7], [28, 17], [29, 0], [30, 16], [31, 196], [32, 17], [33, 195], [34, 16], [35, 195], [36, 196], [224, 328], [225, 329], [226, 330], [227, 331], [228, 332], [229, 333], [230, 334], [231, 335], [232, 336], [233, 337], [234, 338], [235, 339], [3, 213], [4, 214], [5, 215], [6, 216], [236, 340]]);
var n362 = t2([[0, 1], [1, 0], [2, 19], [3, 3], [4, 4], [5, 5], [6, 6], [7, 18], [8, 17], [9, 16], [10, 15], [11, 14], [12, 13], [13, 12], [14, 11], [15, 10], [16, 9], [17, 8], [18, 7], [19, 2], [20, 217], [21, 218], [22, 219], [23, 220], [24, 7], [25, 7], [26, 7], [27, 220], [28, 17], [29, 18], [30, 16], [31, 16], [32, 17], [33, 15], [34, 16], [35, 15], [36, 14], [37, 10], [38, 2], [224, 199], [225, 200], [226, 201], [227, 202], [228, 203], [229, 204], [230, 205], [231, 206], [232, 207], [233, 208], [234, 209], [235, 210], [236, 211]]);
var n372 = t2([[0, 1], [1, 0], [2, 357], [3, 342], [4, 343], [5, 344], [6, 345], [7, 356], [8, 355], [9, 354], [10, 353], [11, 352], [12, 351], [13, 10], [14, 350], [15, 349], [16, 348], [17, 347], [18, 346], [19, 341], [20, 995], [21, 996], [22, 997], [23, 998], [24, 346], [25, 346], [26, 346], [27, 998], [28, 355], [29, 356], [30, 354], [31, 354], [32, 355], [33, 353], [34, 354], [35, 353], [36, 352], [37, 349], [38, 341], [224, 362], [225, 363], [226, 364], [227, 365], [228, 366], [229, 367], [230, 368], [231, 369], [232, 370], [233, 371], [234, 372], [235, 373], [236, 374]]);
var n382 = t2([[24, 355], [25, 355], [26, 355], [27, 356], [28, 348], [29, 347], [30, 349], [31, 350], [32, 348], [33, 350], [34, 349], [35, 350], [36, 10], [224, 362], [225, 363], [226, 364], [227, 365], [228, 366], [229, 367], [230, 368], [231, 369], [232, 370], [233, 371], [234, 372], [235, 373], [3, 342], [4, 343], [5, 344], [6, 345], [236, 374]]);
var n392 = t2([[24, 355], [25, 355], [26, 355], [27, 356], [28, 349], [29, 348], [30, 350], [31, 351], [32, 349], [33, 10], [34, 350], [35, 10], [36, 351], [224, 362], [225, 363], [226, 364], [227, 365], [228, 366], [229, 367], [230, 368], [231, 369], [232, 370], [233, 371], [234, 372], [235, 373], [3, 342], [4, 343], [5, 344], [6, 345], [236, 374]]);
var n402 = t2([[0, 1], [1, 0], [2, 392], [3, 376], [4, 377], [5, 378], [6, 379], [7, 391], [8, 390], [9, 389], [10, 388], [11, 387], [12, 386], [13, 385], [14, 384], [15, 383], [16, 382], [17, 381], [18, 380], [19, 375], [20, 999], [21, 1e3], [22, 1001], [23, 1002], [24, 380], [25, 380], [26, 380], [27, 1002], [28, 390], [29, 391], [30, 389], [31, 389], [32, 390], [33, 388], [34, 389], [35, 388], [36, 387], [37, 383], [38, 375], [224, 397], [225, 398], [226, 399], [227, 400], [228, 401], [229, 402], [230, 403], [231, 404], [232, 405], [233, 406], [234, 407], [235, 408], [236, 409]]);
var n412 = t2([[24, 390], [25, 390], [26, 390], [27, 391], [28, 382], [29, 381], [30, 383], [31, 384], [32, 382], [33, 384], [34, 383], [35, 384], [36, 385], [224, 397], [225, 398], [226, 399], [227, 400], [228, 401], [229, 402], [230, 403], [231, 404], [232, 405], [233, 406], [234, 407], [235, 408], [3, 376], [4, 377], [5, 378], [6, 379], [236, 409]]);
var n422 = t2([[24, 390], [25, 390], [26, 390], [27, 391], [28, 383], [29, 382], [30, 384], [31, 386], [32, 383], [33, 385], [34, 384], [35, 385], [36, 386], [224, 397], [225, 398], [226, 399], [227, 400], [228, 401], [229, 402], [230, 403], [231, 404], [232, 405], [233, 406], [234, 407], [235, 408], [3, 376], [4, 377], [5, 378], [6, 379], [236, 409]]);
var n432 = t2([[0, 1], [1, 0], [2, 427], [3, 411], [4, 412], [5, 413], [6, 414], [7, 426], [8, 425], [9, 424], [10, 423], [11, 422], [12, 421], [13, 420], [14, 419], [15, 418], [16, 417], [17, 416], [18, 415], [19, 410], [20, 1003], [21, 1004], [22, 1005], [23, 1006], [24, 415], [25, 415], [26, 415], [27, 1006], [28, 425], [29, 426], [30, 424], [31, 424], [32, 425], [33, 423], [34, 424], [35, 423], [36, 422], [37, 418], [38, 410], [224, 432], [225, 433], [226, 434], [227, 435], [228, 436], [229, 437], [230, 438], [231, 439], [232, 440], [233, 441], [234, 442], [235, 443], [236, 444]]);
var n442 = t2([[24, 425], [25, 425], [26, 425], [27, 426], [28, 417], [29, 416], [30, 418], [31, 419], [32, 417], [33, 419], [34, 418], [35, 419], [36, 420], [224, 432], [225, 433], [226, 434], [227, 435], [228, 436], [229, 437], [230, 438], [231, 439], [232, 440], [233, 441], [234, 442], [235, 443], [3, 411], [4, 412], [5, 413], [6, 414], [236, 444]]);
var n452 = t2([[24, 425], [25, 425], [26, 425], [27, 426], [28, 418], [29, 417], [30, 419], [31, 421], [32, 418], [33, 420], [34, 419], [35, 420], [36, 421], [224, 432], [225, 433], [226, 434], [227, 435], [228, 436], [229, 437], [230, 438], [231, 439], [232, 440], [233, 441], [234, 442], [235, 443], [3, 411], [4, 412], [5, 413], [6, 414], [236, 444]]);
var n462 = t2([[0, 1], [1, 0], [2, 462], [3, 446], [4, 447], [5, 448], [6, 449], [7, 461], [8, 460], [9, 459], [10, 458], [11, 457], [12, 456], [13, 455], [14, 454], [15, 453], [16, 452], [17, 451], [18, 450], [19, 445], [20, 1007], [21, 1008], [22, 1009], [23, 1010], [24, 450], [25, 450], [26, 450], [27, 1010], [28, 460], [29, 461], [30, 459], [31, 459], [32, 460], [33, 458], [34, 459], [35, 458], [36, 457], [37, 453], [38, 445], [224, 467], [225, 468], [226, 469], [227, 470], [228, 471], [229, 472], [230, 473], [231, 474], [232, 475], [233, 476], [234, 477], [235, 478], [236, 479]]);
var n472 = t2([[24, 460], [25, 460], [26, 460], [27, 461], [28, 452], [29, 451], [30, 453], [31, 454], [32, 452], [33, 454], [34, 453], [35, 454], [36, 455], [224, 467], [225, 468], [226, 469], [227, 470], [228, 471], [229, 472], [230, 473], [231, 474], [232, 475], [233, 476], [234, 477], [235, 478], [3, 446], [4, 447], [5, 448], [6, 449], [236, 479]]);
var n482 = t2([[24, 460], [25, 460], [26, 460], [27, 461], [28, 453], [29, 452], [30, 454], [31, 456], [32, 453], [33, 455], [34, 454], [35, 455], [36, 456], [224, 467], [225, 468], [226, 469], [227, 470], [228, 471], [229, 472], [230, 473], [231, 474], [232, 475], [233, 476], [234, 477], [235, 478], [3, 446], [4, 447], [5, 448], [6, 449], [236, 479]]);
var n492 = t2([[0, 1], [1, 0], [2, 497], [3, 481], [4, 482], [5, 483], [6, 484], [7, 496], [8, 495], [9, 494], [10, 493], [11, 492], [12, 491], [13, 490], [14, 489], [15, 488], [16, 487], [17, 486], [18, 485], [19, 480], [20, 1011], [21, 1012], [22, 1013], [23, 1014], [24, 485], [25, 485], [26, 485], [27, 1014], [28, 495], [29, 496], [30, 494], [31, 494], [32, 495], [33, 493], [34, 494], [35, 493], [36, 492], [37, 488], [38, 480], [224, 502], [225, 503], [226, 504], [227, 505], [228, 506], [229, 507], [230, 508], [231, 509], [232, 510], [233, 511], [234, 512], [235, 513], [236, 514]]);
var n502 = t2([[24, 495], [25, 495], [26, 495], [27, 496], [28, 487], [29, 486], [30, 488], [31, 489], [32, 487], [33, 489], [34, 488], [35, 489], [36, 490], [224, 502], [225, 503], [226, 504], [227, 505], [228, 506], [229, 507], [230, 508], [231, 509], [232, 510], [233, 511], [234, 512], [235, 513], [3, 481], [4, 482], [5, 483], [6, 484], [236, 514]]);
var n512 = t2([[24, 495], [25, 495], [26, 495], [27, 496], [28, 488], [29, 487], [30, 489], [31, 491], [32, 488], [33, 490], [34, 489], [35, 490], [36, 491], [224, 502], [225, 503], [226, 504], [227, 505], [228, 506], [229, 507], [230, 508], [231, 509], [232, 510], [233, 511], [234, 512], [235, 513], [3, 481], [4, 482], [5, 483], [6, 484], [236, 514]]);
var n522 = t2([[0, 1], [1, 0], [2, 532], [3, 516], [4, 517], [5, 518], [6, 519], [7, 531], [8, 530], [9, 529], [10, 528], [11, 527], [12, 526], [13, 525], [14, 524], [15, 523], [16, 522], [17, 521], [18, 520], [19, 515], [20, 1015], [21, 1016], [22, 1017], [23, 1018], [24, 520], [25, 520], [26, 520], [27, 1018], [28, 530], [29, 531], [30, 529], [31, 529], [32, 530], [33, 528], [34, 529], [35, 528], [36, 527], [37, 523], [38, 515], [224, 537], [225, 538], [226, 539], [227, 540], [228, 541], [229, 542], [230, 543], [231, 544], [232, 545], [233, 546], [234, 547], [235, 548], [236, 549]]);
var n532 = t2([[24, 530], [25, 530], [26, 530], [27, 531], [28, 522], [29, 521], [30, 523], [31, 524], [32, 522], [33, 524], [34, 523], [35, 524], [36, 525], [224, 537], [225, 538], [226, 539], [227, 540], [228, 541], [229, 542], [230, 543], [231, 544], [232, 545], [233, 546], [234, 547], [235, 548], [3, 516], [4, 517], [5, 518], [6, 519], [236, 549]]);
var n542 = t2([[24, 530], [25, 530], [26, 530], [27, 531], [28, 523], [29, 522], [30, 524], [31, 526], [32, 523], [33, 525], [34, 524], [35, 525], [36, 526], [224, 537], [225, 538], [226, 539], [227, 540], [228, 541], [229, 542], [230, 543], [231, 544], [232, 545], [233, 546], [234, 547], [235, 548], [3, 516], [4, 517], [5, 518], [6, 519], [236, 549]]);
var n552 = t2([[0, 1], [1, 0], [2, 567], [3, 551], [4, 552], [5, 553], [6, 554], [7, 566], [8, 565], [9, 564], [10, 563], [11, 562], [12, 561], [13, 560], [14, 559], [15, 558], [16, 557], [17, 556], [18, 555], [19, 550], [20, 1019], [21, 1020], [22, 1021], [23, 1022], [24, 555], [25, 555], [26, 555], [27, 1022], [28, 565], [29, 566], [30, 564], [31, 564], [32, 565], [33, 563], [34, 564], [35, 563], [36, 562], [37, 558], [38, 550], [224, 572], [225, 573], [226, 574], [227, 575], [228, 576], [229, 577], [230, 578], [231, 579], [232, 580], [233, 581], [234, 582], [235, 583], [236, 584]]);
var n562 = t2([[24, 565], [25, 565], [26, 565], [27, 566], [28, 557], [29, 556], [30, 558], [31, 559], [32, 557], [33, 559], [34, 558], [35, 559], [36, 560], [224, 572], [225, 573], [226, 574], [227, 575], [228, 576], [229, 577], [230, 578], [231, 579], [232, 580], [233, 581], [234, 582], [235, 583], [3, 551], [4, 552], [5, 553], [6, 554], [236, 584]]);
var n572 = t2([[24, 565], [25, 565], [26, 565], [27, 566], [28, 558], [29, 557], [30, 559], [31, 561], [32, 558], [33, 560], [34, 559], [35, 560], [36, 561], [224, 572], [225, 573], [226, 574], [227, 575], [228, 576], [229, 577], [230, 578], [231, 579], [232, 580], [233, 581], [234, 582], [235, 583], [3, 551], [4, 552], [5, 553], [6, 554], [236, 584]]);
var n582 = t2([[0, 1], [1, 0], [2, 602], [3, 586], [4, 587], [5, 588], [6, 589], [7, 601], [8, 600], [9, 599], [10, 598], [11, 597], [12, 596], [13, 595], [14, 594], [15, 593], [16, 592], [17, 591], [18, 590], [19, 585], [20, 1023], [21, 1024], [22, 1025], [23, 1026], [24, 590], [25, 590], [26, 590], [27, 1026], [28, 600], [29, 601], [30, 599], [31, 599], [32, 600], [33, 598], [34, 599], [35, 598], [36, 597], [37, 593], [38, 585], [224, 607], [225, 608], [226, 609], [227, 610], [228, 611], [229, 612], [230, 613], [231, 614], [232, 615], [233, 616], [234, 617], [235, 618], [236, 619]]);
var n592 = t2([[24, 600], [25, 600], [26, 600], [27, 601], [28, 592], [29, 591], [30, 593], [31, 594], [32, 592], [33, 594], [34, 593], [35, 594], [36, 595], [224, 607], [225, 608], [226, 609], [227, 610], [228, 611], [229, 612], [230, 613], [231, 614], [232, 615], [233, 616], [234, 617], [235, 618], [3, 586], [4, 587], [5, 588], [6, 589], [236, 619]]);
var n602 = t2([[24, 600], [25, 600], [26, 600], [27, 601], [28, 593], [29, 592], [30, 594], [31, 596], [32, 593], [33, 595], [34, 594], [35, 595], [36, 596], [224, 607], [225, 608], [226, 609], [227, 610], [228, 611], [229, 612], [230, 613], [231, 614], [232, 615], [233, 616], [234, 617], [235, 618], [3, 586], [4, 587], [5, 588], [6, 589], [236, 619]]);
var n612 = t2([[0, 1], [1, 0], [2, 637], [3, 621], [4, 622], [5, 623], [6, 624], [7, 636], [8, 635], [9, 634], [10, 633], [11, 632], [12, 631], [13, 630], [14, 629], [15, 628], [16, 627], [17, 626], [18, 625], [19, 620], [20, 1027], [21, 1028], [22, 1029], [23, 1030], [24, 625], [25, 625], [26, 625], [27, 1030], [28, 635], [29, 636], [30, 634], [31, 634], [32, 635], [33, 633], [34, 634], [35, 633], [36, 632], [37, 628], [38, 620], [224, 642], [225, 643], [226, 644], [227, 645], [228, 646], [229, 647], [230, 648], [231, 649], [232, 650], [233, 651], [234, 652], [235, 653], [236, 654]]);
var n622 = t2([[24, 635], [25, 635], [26, 635], [27, 636], [28, 627], [29, 626], [30, 628], [31, 629], [32, 627], [33, 629], [34, 628], [35, 629], [36, 630], [224, 642], [225, 643], [226, 644], [227, 645], [228, 646], [229, 647], [230, 648], [231, 649], [232, 650], [233, 651], [234, 652], [235, 653], [3, 621], [4, 622], [5, 623], [6, 624], [236, 654]]);
var n632 = t2([[24, 635], [25, 635], [26, 635], [27, 636], [28, 628], [29, 627], [30, 629], [31, 631], [32, 628], [33, 630], [34, 629], [35, 630], [36, 631], [224, 642], [225, 643], [226, 644], [227, 645], [228, 646], [229, 647], [230, 648], [231, 649], [232, 650], [233, 651], [234, 652], [235, 653], [3, 621], [4, 622], [5, 623], [6, 624], [236, 654]]);
var n642 = t2([[0, 1], [1, 0], [2, 670], [3, 656], [4, 657], [5, 658], [6, 659], [7, 669], [8, 668], [9, 667], [10, 666], [11, 197], [12, 665], [13, 664], [14, 663], [15, 13], [16, 662], [17, 661], [18, 660], [19, 655], [20, 1031], [21, 1032], [22, 1033], [23, 1034], [24, 660], [25, 660], [26, 660], [27, 1034], [28, 668], [29, 669], [30, 667], [31, 667], [32, 668], [33, 666], [34, 667], [35, 666], [36, 197], [37, 13], [38, 655], [224, 675], [225, 676], [226, 677], [227, 678], [228, 679], [229, 680], [230, 681], [231, 682], [232, 683], [233, 684], [234, 685], [235, 686], [236, 687]]);
var n652 = t2([[24, 668], [25, 668], [26, 668], [27, 669], [28, 662], [29, 661], [30, 13], [31, 663], [32, 662], [33, 663], [34, 13], [35, 663], [36, 664], [224, 675], [225, 676], [226, 677], [227, 678], [228, 679], [229, 680], [230, 681], [231, 682], [232, 683], [233, 684], [234, 685], [235, 686], [3, 656], [4, 657], [5, 658], [6, 659], [236, 687]]);
var n662 = t2([[24, 668], [25, 668], [26, 668], [27, 669], [28, 13], [29, 662], [30, 663], [31, 665], [32, 13], [33, 664], [34, 663], [35, 664], [36, 665], [224, 675], [225, 676], [226, 677], [227, 678], [228, 679], [229, 680], [230, 681], [231, 682], [232, 683], [233, 684], [234, 685], [235, 686], [3, 656], [4, 657], [5, 658], [6, 659], [236, 687]]);
var n672 = t2([[0, 9], [1, 16], [2, 2], [3, 213], [4, 214], [5, 215], [6, 216], [7, 7], [8, 11], [9, 1], [10, 198], [11, 197], [12, 196], [13, 195], [14, 16], [15, 17], [16, 0], [17, 194], [18, 193], [19, 212], [20, 991], [21, 992], [22, 993], [23, 994], [24, 193], [25, 994], [26, 193], [27, 194], [28, 11], [29, 1], [30, 7], [31, 1], [32, 11], [33, 198], [34, 197], [35, 198], [36, 1], [37, 17], [38, 212], [224, 328], [225, 329], [226, 330], [227, 331], [228, 332], [229, 333], [230, 334], [231, 335], [232, 336], [233, 337], [234, 338], [235, 339], [236, 340]]);
var n682 = t2([[0, 9], [1, 16], [2, 19], [3, 3], [4, 4], [5, 5], [6, 6], [7, 18], [8, 17], [9, 16], [10, 15], [11, 14], [12, 13], [13, 12], [14, 11], [15, 10], [16, 9], [17, 8], [18, 7], [19, 2], [20, 217], [21, 218], [22, 219], [23, 220], [24, 7], [25, 220], [26, 7], [27, 8], [28, 17], [29, 16], [30, 18], [31, 16], [32, 17], [33, 15], [34, 14], [35, 15], [36, 16], [37, 10], [38, 2], [224, 199], [225, 200], [226, 201], [227, 202], [228, 203], [229, 204], [230, 205], [231, 206], [232, 207], [233, 208], [234, 209], [235, 210], [236, 211]]);
var n692 = t2([[24, 17], [25, 18], [26, 17], [27, 16], [28, 9], [29, 10], [30, 8], [31, 11], [32, 9], [33, 11], [34, 12], [35, 11], [36, 10], [224, 199], [225, 200], [226, 201], [227, 202], [228, 203], [229, 204], [230, 205], [231, 206], [232, 207], [233, 208], [234, 209], [235, 210], [3, 3], [4, 4], [5, 5], [6, 6], [236, 211]]);
var n702 = t2([[24, 17], [25, 18], [26, 17], [27, 16], [28, 10], [29, 11], [30, 9], [31, 13], [32, 10], [33, 12], [34, 13], [35, 12], [36, 11], [224, 199], [225, 200], [226, 201], [227, 202], [228, 203], [229, 204], [230, 205], [231, 206], [232, 207], [233, 208], [234, 209], [235, 210], [3, 3], [4, 4], [5, 5], [6, 6], [236, 211]]);
var n712 = t2([[0, 9], [1, 16], [2, 701], [3, 689], [4, 690], [5, 691], [6, 692], [7, 9], [8, 700], [9, 699], [10, 698], [11, 668], [12, 697], [13, 696], [14, 695], [15, 694], [16, 356], [17, 0], [18, 693], [19, 688], [20, 1035], [21, 1036], [22, 1037], [23, 1038], [24, 693], [25, 1038], [26, 693], [27, 0], [28, 700], [29, 699], [30, 9], [31, 699], [32, 700], [33, 698], [34, 668], [35, 698], [36, 699], [37, 694], [38, 688], [224, 706], [225, 707], [226, 708], [227, 709], [228, 710], [229, 711], [230, 712], [231, 713], [232, 714], [233, 715], [234, 716], [235, 717], [236, 718]]);
var n722 = t2([[24, 700], [25, 9], [26, 700], [27, 699], [28, 356], [29, 694], [30, 0], [31, 695], [32, 356], [33, 695], [34, 696], [35, 695], [36, 694], [224, 706], [225, 707], [226, 708], [227, 709], [228, 710], [229, 711], [230, 712], [231, 713], [232, 714], [233, 715], [234, 716], [235, 717], [3, 689], [4, 690], [5, 691], [6, 692], [236, 718]]);
var n732 = t2([[24, 700], [25, 9], [26, 700], [27, 699], [28, 694], [29, 695], [30, 356], [31, 697], [32, 694], [33, 696], [34, 697], [35, 696], [36, 695], [224, 706], [225, 707], [226, 708], [227, 709], [228, 710], [229, 711], [230, 712], [231, 713], [232, 714], [233, 715], [234, 716], [235, 717], [3, 689], [4, 690], [5, 691], [6, 692], [236, 718]]);
var n742 = t2([[0, 9], [1, 16], [2, 735], [3, 720], [4, 721], [5, 722], [6, 723], [7, 734], [8, 733], [9, 732], [10, 388], [11, 731], [12, 730], [13, 729], [14, 728], [15, 727], [16, 726], [17, 725], [18, 724], [19, 719], [20, 1039], [21, 1040], [22, 1041], [23, 1042], [24, 724], [25, 1042], [26, 724], [27, 725], [28, 733], [29, 732], [30, 734], [31, 732], [32, 733], [33, 388], [34, 731], [35, 388], [36, 732], [37, 727], [38, 719], [224, 740], [225, 741], [226, 742], [227, 743], [228, 744], [229, 745], [230, 746], [231, 747], [232, 748], [233, 749], [234, 750], [235, 751], [236, 752]]);
var n752 = t2([[24, 733], [25, 734], [26, 733], [27, 732], [28, 726], [29, 727], [30, 725], [31, 728], [32, 726], [33, 728], [34, 729], [35, 728], [36, 727], [224, 740], [225, 741], [226, 742], [227, 743], [228, 744], [229, 745], [230, 746], [231, 747], [232, 748], [233, 749], [234, 750], [235, 751], [3, 720], [4, 721], [5, 722], [6, 723], [236, 752]]);
var n762 = t2([[24, 733], [25, 734], [26, 733], [27, 732], [28, 727], [29, 728], [30, 726], [31, 730], [32, 727], [33, 729], [34, 730], [35, 729], [36, 728], [224, 740], [225, 741], [226, 742], [227, 743], [228, 744], [229, 745], [230, 746], [231, 747], [232, 748], [233, 749], [234, 750], [235, 751], [3, 720], [4, 721], [5, 722], [6, 723], [236, 752]]);
var n772 = t2([[0, 9], [1, 16], [2, 769], [3, 754], [4, 755], [5, 756], [6, 757], [7, 768], [8, 767], [9, 766], [10, 423], [11, 765], [12, 764], [13, 763], [14, 762], [15, 761], [16, 760], [17, 759], [18, 758], [19, 753], [20, 1043], [21, 1044], [22, 1045], [23, 1046], [24, 758], [25, 1046], [26, 758], [27, 759], [28, 767], [29, 766], [30, 768], [31, 766], [32, 767], [33, 423], [34, 765], [35, 423], [36, 766], [37, 761], [38, 753], [224, 774], [225, 775], [226, 776], [227, 777], [228, 778], [229, 779], [230, 780], [231, 781], [232, 782], [233, 783], [234, 784], [235, 785], [236, 786]]);
var n782 = t2([[24, 767], [25, 768], [26, 767], [27, 766], [28, 760], [29, 761], [30, 759], [31, 762], [32, 760], [33, 762], [34, 763], [35, 762], [36, 761], [224, 774], [225, 775], [226, 776], [227, 777], [228, 778], [229, 779], [230, 780], [231, 781], [232, 782], [233, 783], [234, 784], [235, 785], [3, 754], [4, 755], [5, 756], [6, 757], [236, 786]]);
var n792 = t2([[24, 767], [25, 768], [26, 767], [27, 766], [28, 761], [29, 762], [30, 760], [31, 764], [32, 761], [33, 763], [34, 764], [35, 763], [36, 762], [224, 774], [225, 775], [226, 776], [227, 777], [228, 778], [229, 779], [230, 780], [231, 781], [232, 782], [233, 783], [234, 784], [235, 785], [3, 754], [4, 755], [5, 756], [6, 757], [236, 786]]);
var n802 = t2([[0, 9], [1, 16], [2, 803], [3, 788], [4, 789], [5, 790], [6, 791], [7, 802], [8, 801], [9, 800], [10, 458], [11, 799], [12, 798], [13, 797], [14, 796], [15, 795], [16, 794], [17, 793], [18, 792], [19, 787], [20, 1047], [21, 1048], [22, 1049], [23, 1050], [24, 792], [25, 1050], [26, 792], [27, 793], [28, 801], [29, 800], [30, 802], [31, 800], [32, 801], [33, 458], [34, 799], [35, 458], [36, 800], [37, 795], [38, 787], [224, 808], [225, 809], [226, 810], [227, 811], [228, 812], [229, 813], [230, 814], [231, 815], [232, 816], [233, 817], [234, 818], [235, 819], [236, 820]]);
var n812 = t2([[24, 801], [25, 802], [26, 801], [27, 800], [28, 794], [29, 795], [30, 793], [31, 796], [32, 794], [33, 796], [34, 797], [35, 796], [36, 795], [224, 808], [225, 809], [226, 810], [227, 811], [228, 812], [229, 813], [230, 814], [231, 815], [232, 816], [233, 817], [234, 818], [235, 819], [3, 788], [4, 789], [5, 790], [6, 791], [236, 820]]);
var n822 = t2([[24, 801], [25, 802], [26, 801], [27, 800], [28, 795], [29, 796], [30, 794], [31, 798], [32, 795], [33, 797], [34, 798], [35, 797], [36, 796], [224, 808], [225, 809], [226, 810], [227, 811], [228, 812], [229, 813], [230, 814], [231, 815], [232, 816], [233, 817], [234, 818], [235, 819], [3, 788], [4, 789], [5, 790], [6, 791], [236, 820]]);
var n832 = t2([[0, 9], [1, 16], [2, 837], [3, 822], [4, 823], [5, 824], [6, 825], [7, 836], [8, 835], [9, 834], [10, 493], [11, 833], [12, 832], [13, 831], [14, 830], [15, 829], [16, 828], [17, 827], [18, 826], [19, 821], [20, 1051], [21, 1052], [22, 1053], [23, 1054], [24, 826], [25, 1054], [26, 826], [27, 827], [28, 835], [29, 834], [30, 836], [31, 834], [32, 835], [33, 493], [34, 833], [35, 493], [36, 834], [37, 829], [38, 821], [224, 842], [225, 843], [226, 844], [227, 845], [228, 846], [229, 847], [230, 848], [231, 849], [232, 850], [233, 851], [234, 852], [235, 853], [236, 854]]);
var n842 = t2([[24, 835], [25, 836], [26, 835], [27, 834], [28, 828], [29, 829], [30, 827], [31, 830], [32, 828], [33, 830], [34, 831], [35, 830], [36, 829], [224, 842], [225, 843], [226, 844], [227, 845], [228, 846], [229, 847], [230, 848], [231, 849], [232, 850], [233, 851], [234, 852], [235, 853], [3, 822], [4, 823], [5, 824], [6, 825], [236, 854]]);
var n852 = t2([[24, 835], [25, 836], [26, 835], [27, 834], [28, 829], [29, 830], [30, 828], [31, 832], [32, 829], [33, 831], [34, 832], [35, 831], [36, 830], [224, 842], [225, 843], [226, 844], [227, 845], [228, 846], [229, 847], [230, 848], [231, 849], [232, 850], [233, 851], [234, 852], [235, 853], [3, 822], [4, 823], [5, 824], [6, 825], [236, 854]]);
var n862 = t2([[0, 9], [1, 16], [2, 871], [3, 856], [4, 857], [5, 858], [6, 859], [7, 870], [8, 869], [9, 868], [10, 528], [11, 867], [12, 866], [13, 865], [14, 864], [15, 863], [16, 862], [17, 861], [18, 860], [19, 855], [20, 1055], [21, 1056], [22, 1057], [23, 1058], [24, 860], [25, 1058], [26, 860], [27, 861], [28, 869], [29, 868], [30, 870], [31, 868], [32, 869], [33, 528], [34, 867], [35, 528], [36, 868], [37, 863], [38, 855], [224, 876], [225, 877], [226, 878], [227, 879], [228, 880], [229, 881], [230, 882], [231, 883], [232, 884], [233, 885], [234, 886], [235, 887], [236, 888]]);
var n872 = t2([[24, 869], [25, 870], [26, 869], [27, 868], [28, 862], [29, 863], [30, 861], [31, 864], [32, 862], [33, 864], [34, 865], [35, 864], [36, 863], [224, 876], [225, 877], [226, 878], [227, 879], [228, 880], [229, 881], [230, 882], [231, 883], [232, 884], [233, 885], [234, 886], [235, 887], [3, 856], [4, 857], [5, 858], [6, 859], [236, 888]]);
var n882 = t2([[24, 869], [25, 870], [26, 869], [27, 868], [28, 863], [29, 864], [30, 862], [31, 866], [32, 863], [33, 865], [34, 866], [35, 865], [36, 864], [224, 876], [225, 877], [226, 878], [227, 879], [228, 880], [229, 881], [230, 882], [231, 883], [232, 884], [233, 885], [234, 886], [235, 887], [3, 856], [4, 857], [5, 858], [6, 859], [236, 888]]);
var n892 = t2([[0, 9], [1, 16], [2, 905], [3, 890], [4, 891], [5, 892], [6, 893], [7, 904], [8, 903], [9, 902], [10, 563], [11, 901], [12, 900], [13, 899], [14, 898], [15, 897], [16, 896], [17, 895], [18, 894], [19, 889], [20, 1059], [21, 1060], [22, 1061], [23, 1062], [24, 894], [25, 1062], [26, 894], [27, 895], [28, 903], [29, 902], [30, 904], [31, 902], [32, 903], [33, 563], [34, 901], [35, 563], [36, 902], [37, 897], [38, 889], [224, 910], [225, 911], [226, 912], [227, 913], [228, 914], [229, 915], [230, 916], [231, 917], [232, 918], [233, 919], [234, 920], [235, 921], [236, 922]]);
var n902 = t2([[24, 903], [25, 904], [26, 903], [27, 902], [28, 896], [29, 897], [30, 895], [31, 898], [32, 896], [33, 898], [34, 899], [35, 898], [36, 897], [224, 910], [225, 911], [226, 912], [227, 913], [228, 914], [229, 915], [230, 916], [231, 917], [232, 918], [233, 919], [234, 920], [235, 921], [3, 890], [4, 891], [5, 892], [6, 893], [236, 922]]);
var n912 = t2([[24, 903], [25, 904], [26, 903], [27, 902], [28, 897], [29, 898], [30, 896], [31, 900], [32, 897], [33, 899], [34, 900], [35, 899], [36, 898], [224, 910], [225, 911], [226, 912], [227, 913], [228, 914], [229, 915], [230, 916], [231, 917], [232, 918], [233, 919], [234, 920], [235, 921], [3, 890], [4, 891], [5, 892], [6, 893], [236, 922]]);
var n922 = t2([[0, 9], [1, 16], [2, 939], [3, 924], [4, 925], [5, 926], [6, 927], [7, 938], [8, 937], [9, 936], [10, 598], [11, 935], [12, 934], [13, 933], [14, 932], [15, 931], [16, 930], [17, 929], [18, 928], [19, 923], [20, 1063], [21, 1064], [22, 1065], [23, 1066], [24, 928], [25, 1066], [26, 928], [27, 929], [28, 937], [29, 936], [30, 938], [31, 936], [32, 937], [33, 598], [34, 935], [35, 598], [36, 936], [37, 931], [38, 923], [224, 944], [225, 945], [226, 946], [227, 947], [228, 948], [229, 949], [230, 950], [231, 951], [232, 952], [233, 953], [234, 954], [235, 955], [236, 956]]);
var n932 = t2([[24, 937], [25, 938], [26, 937], [27, 936], [28, 930], [29, 931], [30, 929], [31, 932], [32, 930], [33, 932], [34, 933], [35, 932], [36, 931], [224, 944], [225, 945], [226, 946], [227, 947], [228, 948], [229, 949], [230, 950], [231, 951], [232, 952], [233, 953], [234, 954], [235, 955], [3, 924], [4, 925], [5, 926], [6, 927], [236, 956]]);
var n942 = t2([[24, 937], [25, 938], [26, 937], [27, 936], [28, 931], [29, 932], [30, 930], [31, 934], [32, 931], [33, 933], [34, 934], [35, 933], [36, 932], [224, 944], [225, 945], [226, 946], [227, 947], [228, 948], [229, 949], [230, 950], [231, 951], [232, 952], [233, 953], [234, 954], [235, 955], [3, 924], [4, 925], [5, 926], [6, 927], [236, 956]]);
var n952 = t2([[0, 9], [1, 16], [2, 973], [3, 958], [4, 959], [5, 960], [6, 961], [7, 972], [8, 971], [9, 970], [10, 633], [11, 969], [12, 968], [13, 967], [14, 966], [15, 965], [16, 964], [17, 963], [18, 962], [19, 957], [20, 1067], [21, 1068], [22, 1069], [23, 1070], [24, 962], [25, 1070], [26, 962], [27, 963], [28, 971], [29, 970], [30, 972], [31, 970], [32, 971], [33, 633], [34, 969], [35, 633], [36, 970], [37, 965], [38, 957], [224, 978], [225, 979], [226, 980], [227, 981], [228, 982], [229, 983], [230, 984], [231, 985], [232, 986], [233, 987], [234, 988], [235, 989], [236, 990]]);
var n962 = t2([[24, 971], [25, 972], [26, 971], [27, 970], [28, 964], [29, 965], [30, 963], [31, 966], [32, 964], [33, 966], [34, 967], [35, 966], [36, 965], [224, 978], [225, 979], [226, 980], [227, 981], [228, 982], [229, 983], [230, 984], [231, 985], [232, 986], [233, 987], [234, 988], [235, 989], [3, 958], [4, 959], [5, 960], [6, 961], [236, 990]]);
var n972 = t2([[24, 971], [25, 972], [26, 971], [27, 970], [28, 965], [29, 966], [30, 964], [31, 968], [32, 965], [33, 967], [34, 968], [35, 967], [36, 966], [224, 978], [225, 979], [226, 980], [227, 981], [228, 982], [229, 983], [230, 984], [231, 985], [232, 986], [233, 987], [234, 988], [235, 989], [3, 958], [4, 959], [5, 960], [6, 961], [236, 990]]);
var n982 = t2([[0, 9], [1, 16], [2, 670], [3, 656], [4, 657], [5, 658], [6, 659], [7, 669], [8, 668], [9, 667], [10, 666], [11, 197], [12, 665], [13, 664], [14, 663], [15, 13], [16, 662], [17, 661], [18, 660], [19, 655], [20, 1031], [21, 1032], [22, 1033], [23, 1034], [24, 660], [25, 1034], [26, 660], [27, 661], [28, 668], [29, 667], [30, 669], [31, 667], [32, 668], [33, 666], [34, 197], [35, 666], [36, 667], [37, 13], [38, 655], [224, 675], [225, 676], [226, 677], [227, 678], [228, 679], [229, 680], [230, 681], [231, 682], [232, 683], [233, 684], [234, 685], [235, 686], [236, 687]]);
var n992 = t2([[24, 668], [25, 669], [26, 668], [27, 667], [28, 662], [29, 13], [30, 661], [31, 663], [32, 662], [33, 663], [34, 664], [35, 663], [36, 13], [224, 675], [225, 676], [226, 677], [227, 678], [228, 679], [229, 680], [230, 681], [231, 682], [232, 683], [233, 684], [234, 685], [235, 686], [3, 656], [4, 657], [5, 658], [6, 659], [236, 687]]);
var n1002 = t2([[24, 668], [25, 669], [26, 668], [27, 667], [28, 13], [29, 663], [30, 662], [31, 665], [32, 13], [33, 664], [34, 665], [35, 664], [36, 663], [224, 675], [225, 676], [226, 677], [227, 678], [228, 679], [229, 680], [230, 681], [231, 682], [232, 683], [233, 684], [234, 685], [235, 686], [3, 656], [4, 657], [5, 658], [6, 659], [236, 687]]);
var n1012 = t2([[24, 17], [25, 17], [26, 17], [27, 18], [28, 12], [29, 11], [30, 13], [31, 17], [32, 12], [33, 14], [34, 13], [35, 14], [36, 15], [224, 199], [225, 200], [226, 201], [227, 202], [228, 203], [229, 204], [230, 205], [231, 206], [232, 207], [233, 208], [234, 209], [235, 210], [3, 3], [4, 4], [5, 5], [6, 6], [236, 211]]);
var n1022 = t2([[24, 11], [25, 7], [26, 11], [27, 1], [28, 195], [29, 196], [30, 16], [31, 11], [32, 195], [33, 197], [34, 198], [35, 197], [36, 196], [224, 328], [225, 329], [226, 330], [227, 331], [228, 332], [229, 333], [230, 334], [231, 335], [232, 336], [233, 337], [234, 338], [235, 339], [3, 213], [4, 214], [5, 215], [6, 216], [236, 340]]);
var n1032 = t2([[24, 11], [25, 11], [26, 11], [27, 7], [28, 195], [29, 16], [30, 196], [31, 11], [32, 195], [33, 197], [34, 196], [35, 197], [36, 198], [224, 328], [225, 329], [226, 330], [227, 331], [228, 332], [229, 333], [230, 334], [231, 335], [232, 336], [233, 337], [234, 338], [235, 339], [3, 213], [4, 214], [5, 215], [6, 216], [236, 340]]);
var n1042 = t2([[24, 355], [25, 355], [26, 355], [27, 356], [28, 10], [29, 350], [30, 351], [31, 355], [32, 10], [33, 352], [34, 351], [35, 352], [36, 353], [224, 362], [225, 363], [226, 364], [227, 365], [228, 366], [229, 367], [230, 368], [231, 369], [232, 370], [233, 371], [234, 372], [235, 373], [3, 342], [4, 343], [5, 344], [6, 345], [236, 374]]);
var n1052 = t2([[24, 390], [25, 390], [26, 390], [27, 391], [28, 385], [29, 384], [30, 386], [31, 390], [32, 385], [33, 387], [34, 386], [35, 387], [36, 388], [224, 397], [225, 398], [226, 399], [227, 400], [228, 401], [229, 402], [230, 403], [231, 404], [232, 405], [233, 406], [234, 407], [235, 408], [3, 376], [4, 377], [5, 378], [6, 379], [236, 409]]);
var n1062 = t2([[24, 425], [25, 425], [26, 425], [27, 426], [28, 420], [29, 419], [30, 421], [31, 425], [32, 420], [33, 422], [34, 421], [35, 422], [36, 423], [224, 432], [225, 433], [226, 434], [227, 435], [228, 436], [229, 437], [230, 438], [231, 439], [232, 440], [233, 441], [234, 442], [235, 443], [3, 411], [4, 412], [5, 413], [6, 414], [236, 444]]);
var n1072 = t2([[24, 460], [25, 460], [26, 460], [27, 461], [28, 455], [29, 454], [30, 456], [31, 460], [32, 455], [33, 457], [34, 456], [35, 457], [36, 458], [224, 467], [225, 468], [226, 469], [227, 470], [228, 471], [229, 472], [230, 473], [231, 474], [232, 475], [233, 476], [234, 477], [235, 478], [3, 446], [4, 447], [5, 448], [6, 449], [236, 479]]);
var n1082 = t2([[24, 495], [25, 495], [26, 495], [27, 496], [28, 490], [29, 489], [30, 491], [31, 495], [32, 490], [33, 492], [34, 491], [35, 492], [36, 493], [224, 502], [225, 503], [226, 504], [227, 505], [228, 506], [229, 507], [230, 508], [231, 509], [232, 510], [233, 511], [234, 512], [235, 513], [3, 481], [4, 482], [5, 483], [6, 484], [236, 514]]);
var n1092 = t2([[24, 530], [25, 530], [26, 530], [27, 531], [28, 525], [29, 524], [30, 526], [31, 530], [32, 525], [33, 527], [34, 526], [35, 527], [36, 528], [224, 537], [225, 538], [226, 539], [227, 540], [228, 541], [229, 542], [230, 543], [231, 544], [232, 545], [233, 546], [234, 547], [235, 548], [3, 516], [4, 517], [5, 518], [6, 519], [236, 549]]);
var n1102 = t2([[24, 565], [25, 565], [26, 565], [27, 566], [28, 560], [29, 559], [30, 561], [31, 565], [32, 560], [33, 562], [34, 561], [35, 562], [36, 563], [224, 572], [225, 573], [226, 574], [227, 575], [228, 576], [229, 577], [230, 578], [231, 579], [232, 580], [233, 581], [234, 582], [235, 583], [3, 551], [4, 552], [5, 553], [6, 554], [236, 584]]);
var n1112 = t2([[24, 600], [25, 600], [26, 600], [27, 601], [28, 595], [29, 594], [30, 596], [31, 600], [32, 595], [33, 597], [34, 596], [35, 597], [36, 598], [224, 607], [225, 608], [226, 609], [227, 610], [228, 611], [229, 612], [230, 613], [231, 614], [232, 615], [233, 616], [234, 617], [235, 618], [3, 586], [4, 587], [5, 588], [6, 589], [236, 619]]);
var n1122 = t2([[24, 635], [25, 635], [26, 635], [27, 636], [28, 630], [29, 629], [30, 631], [31, 635], [32, 630], [33, 632], [34, 631], [35, 632], [36, 633], [224, 642], [225, 643], [226, 644], [227, 645], [228, 646], [229, 647], [230, 648], [231, 649], [232, 650], [233, 651], [234, 652], [235, 653], [3, 621], [4, 622], [5, 623], [6, 624], [236, 654]]);
var n1132 = t2([[24, 668], [25, 668], [26, 668], [27, 669], [28, 664], [29, 663], [30, 665], [31, 668], [32, 664], [33, 197], [34, 665], [35, 197], [36, 666], [224, 675], [225, 676], [226, 677], [227, 678], [228, 679], [229, 680], [230, 681], [231, 682], [232, 683], [233, 684], [234, 685], [235, 686], [3, 656], [4, 657], [5, 658], [6, 659], [236, 687]]);
var n1142 = t2([[24, 17], [25, 18], [26, 17], [27, 16], [28, 12], [29, 13], [30, 11], [31, 17], [32, 12], [33, 14], [34, 15], [35, 14], [36, 13], [224, 199], [225, 200], [226, 201], [227, 202], [228, 203], [229, 204], [230, 205], [231, 206], [232, 207], [233, 208], [234, 209], [235, 210], [3, 3], [4, 4], [5, 5], [6, 6], [236, 211]]);
var n1152 = t2([[24, 700], [25, 9], [26, 700], [27, 699], [28, 696], [29, 697], [30, 695], [31, 700], [32, 696], [33, 668], [34, 698], [35, 668], [36, 697], [224, 706], [225, 707], [226, 708], [227, 709], [228, 710], [229, 711], [230, 712], [231, 713], [232, 714], [233, 715], [234, 716], [235, 717], [3, 689], [4, 690], [5, 691], [6, 692], [236, 718]]);
var n1162 = t2([[24, 733], [25, 734], [26, 733], [27, 732], [28, 729], [29, 730], [30, 728], [31, 733], [32, 729], [33, 731], [34, 388], [35, 731], [36, 730], [224, 740], [225, 741], [226, 742], [227, 743], [228, 744], [229, 745], [230, 746], [231, 747], [232, 748], [233, 749], [234, 750], [235, 751], [3, 720], [4, 721], [5, 722], [6, 723], [236, 752]]);
var n1172 = t2([[24, 767], [25, 768], [26, 767], [27, 766], [28, 763], [29, 764], [30, 762], [31, 767], [32, 763], [33, 765], [34, 423], [35, 765], [36, 764], [224, 774], [225, 775], [226, 776], [227, 777], [228, 778], [229, 779], [230, 780], [231, 781], [232, 782], [233, 783], [234, 784], [235, 785], [3, 754], [4, 755], [5, 756], [6, 757], [236, 786]]);
var n1182 = t2([[24, 801], [25, 802], [26, 801], [27, 800], [28, 797], [29, 798], [30, 796], [31, 801], [32, 797], [33, 799], [34, 458], [35, 799], [36, 798], [224, 808], [225, 809], [226, 810], [227, 811], [228, 812], [229, 813], [230, 814], [231, 815], [232, 816], [233, 817], [234, 818], [235, 819], [3, 788], [4, 789], [5, 790], [6, 791], [236, 820]]);
var n1192 = t2([[24, 835], [25, 836], [26, 835], [27, 834], [28, 831], [29, 832], [30, 830], [31, 835], [32, 831], [33, 833], [34, 493], [35, 833], [36, 832], [224, 842], [225, 843], [226, 844], [227, 845], [228, 846], [229, 847], [230, 848], [231, 849], [232, 850], [233, 851], [234, 852], [235, 853], [3, 822], [4, 823], [5, 824], [6, 825], [236, 854]]);
var n1202 = t2([[24, 869], [25, 870], [26, 869], [27, 868], [28, 865], [29, 866], [30, 864], [31, 869], [32, 865], [33, 867], [34, 528], [35, 867], [36, 866], [224, 876], [225, 877], [226, 878], [227, 879], [228, 880], [229, 881], [230, 882], [231, 883], [232, 884], [233, 885], [234, 886], [235, 887], [3, 856], [4, 857], [5, 858], [6, 859], [236, 888]]);
var n1212 = t2([[24, 903], [25, 904], [26, 903], [27, 902], [28, 899], [29, 900], [30, 898], [31, 903], [32, 899], [33, 901], [34, 563], [35, 901], [36, 900], [224, 910], [225, 911], [226, 912], [227, 913], [228, 914], [229, 915], [230, 916], [231, 917], [232, 918], [233, 919], [234, 920], [235, 921], [3, 890], [4, 891], [5, 892], [6, 893], [236, 922]]);
var n1222 = t2([[24, 937], [25, 938], [26, 937], [27, 936], [28, 933], [29, 934], [30, 932], [31, 937], [32, 933], [33, 935], [34, 598], [35, 935], [36, 934], [224, 944], [225, 945], [226, 946], [227, 947], [228, 948], [229, 949], [230, 950], [231, 951], [232, 952], [233, 953], [234, 954], [235, 955], [3, 924], [4, 925], [5, 926], [6, 927], [236, 956]]);
var n1232 = t2([[24, 971], [25, 972], [26, 971], [27, 970], [28, 967], [29, 968], [30, 966], [31, 971], [32, 967], [33, 969], [34, 633], [35, 969], [36, 968], [224, 978], [225, 979], [226, 980], [227, 981], [228, 982], [229, 983], [230, 984], [231, 985], [232, 986], [233, 987], [234, 988], [235, 989], [3, 958], [4, 959], [5, 960], [6, 961], [236, 990]]);
var n1242 = t2([[24, 668], [25, 669], [26, 668], [27, 667], [28, 664], [29, 665], [30, 663], [31, 668], [32, 664], [33, 197], [34, 666], [35, 197], [36, 665], [224, 675], [225, 676], [226, 677], [227, 678], [228, 679], [229, 680], [230, 681], [231, 682], [232, 683], [233, 684], [234, 685], [235, 686], [3, 656], [4, 657], [5, 658], [6, 659], [236, 687]]);
var themes2 = {
  light: n125,
  dark: n210,
  light_accent: n310,
  dark_accent: n410,
  light_black: n510,
  light_white: n610,
  light_gray: n710,
  light_blue: n810,
  light_red: n910,
  light_yellow: n1010,
  light_green: n1110,
  light_orange: n126,
  light_pink: n132,
  light_purple: n142,
  light_teal: n152,
  light_neutral: n162,
  dark_black: n172,
  dark_white: n182,
  dark_gray: n192,
  dark_blue: n202,
  dark_red: n212,
  dark_yellow: n222,
  dark_green: n232,
  dark_orange: n242,
  dark_pink: n252,
  dark_purple: n262,
  dark_teal: n272,
  dark_neutral: n282,
  light_surface1: n292,
  light_white_surface1: n292,
  light_Input: n292,
  light_Progress: n292,
  light_Slider: n292,
  light_TextArea: n292,
  light_white_Input: n292,
  light_white_Progress: n292,
  light_white_Slider: n292,
  light_white_TextArea: n292,
  light_surface2: n302,
  light_white_surface2: n302,
  light_Button: n302,
  light_SliderThumb: n302,
  light_Switch: n302,
  light_white_Button: n302,
  light_white_SliderThumb: n302,
  light_white_Switch: n302,
  dark_surface1: n312,
  dark_black_surface1: n312,
  dark_Input: n312,
  dark_Progress: n312,
  dark_Slider: n312,
  dark_TextArea: n312,
  dark_black_Input: n312,
  dark_black_Progress: n312,
  dark_black_Slider: n312,
  dark_black_TextArea: n312,
  dark_surface2: n322,
  dark_black_surface2: n322,
  dark_Button: n322,
  dark_SliderThumb: n322,
  dark_Switch: n322,
  dark_black_Button: n322,
  dark_black_SliderThumb: n322,
  dark_black_Switch: n322,
  light_black_accent: n332,
  light_black_Tooltip: n332,
  light_black_SwitchThumb: n332,
  light_black_surface1: n342,
  light_black_Input: n342,
  light_black_Progress: n342,
  light_black_Slider: n342,
  light_black_TextArea: n342,
  light_black_surface2: n352,
  light_black_Button: n352,
  light_black_SliderThumb: n352,
  light_black_Switch: n352,
  light_white_accent: n362,
  light_Tooltip: n362,
  light_SwitchThumb: n362,
  light_white_Tooltip: n362,
  light_white_SwitchThumb: n362,
  light_gray_accent: n372,
  light_gray_Tooltip: n372,
  light_gray_SwitchThumb: n372,
  light_gray_surface1: n382,
  light_gray_Input: n382,
  light_gray_Progress: n382,
  light_gray_Slider: n382,
  light_gray_TextArea: n382,
  light_gray_surface2: n392,
  light_gray_Button: n392,
  light_gray_SliderThumb: n392,
  light_gray_Switch: n392,
  light_blue_accent: n402,
  light_blue_Tooltip: n402,
  light_blue_SwitchThumb: n402,
  light_blue_surface1: n412,
  light_blue_Input: n412,
  light_blue_Progress: n412,
  light_blue_Slider: n412,
  light_blue_TextArea: n412,
  light_blue_surface2: n422,
  light_blue_Button: n422,
  light_blue_SliderThumb: n422,
  light_blue_Switch: n422,
  light_red_accent: n432,
  light_red_Tooltip: n432,
  light_red_SwitchThumb: n432,
  light_red_surface1: n442,
  light_red_Input: n442,
  light_red_Progress: n442,
  light_red_Slider: n442,
  light_red_TextArea: n442,
  light_red_surface2: n452,
  light_red_Button: n452,
  light_red_SliderThumb: n452,
  light_red_Switch: n452,
  light_yellow_accent: n462,
  light_yellow_Tooltip: n462,
  light_yellow_SwitchThumb: n462,
  light_yellow_surface1: n472,
  light_yellow_Input: n472,
  light_yellow_Progress: n472,
  light_yellow_Slider: n472,
  light_yellow_TextArea: n472,
  light_yellow_surface2: n482,
  light_yellow_Button: n482,
  light_yellow_SliderThumb: n482,
  light_yellow_Switch: n482,
  light_green_accent: n492,
  light_green_Tooltip: n492,
  light_green_SwitchThumb: n492,
  light_green_surface1: n502,
  light_green_Input: n502,
  light_green_Progress: n502,
  light_green_Slider: n502,
  light_green_TextArea: n502,
  light_green_surface2: n512,
  light_green_Button: n512,
  light_green_SliderThumb: n512,
  light_green_Switch: n512,
  light_orange_accent: n522,
  light_orange_Tooltip: n522,
  light_orange_SwitchThumb: n522,
  light_orange_surface1: n532,
  light_orange_Input: n532,
  light_orange_Progress: n532,
  light_orange_Slider: n532,
  light_orange_TextArea: n532,
  light_orange_surface2: n542,
  light_orange_Button: n542,
  light_orange_SliderThumb: n542,
  light_orange_Switch: n542,
  light_pink_accent: n552,
  light_pink_Tooltip: n552,
  light_pink_SwitchThumb: n552,
  light_pink_surface1: n562,
  light_pink_Input: n562,
  light_pink_Progress: n562,
  light_pink_Slider: n562,
  light_pink_TextArea: n562,
  light_pink_surface2: n572,
  light_pink_Button: n572,
  light_pink_SliderThumb: n572,
  light_pink_Switch: n572,
  light_purple_accent: n582,
  light_purple_Tooltip: n582,
  light_purple_SwitchThumb: n582,
  light_purple_surface1: n592,
  light_purple_Input: n592,
  light_purple_Progress: n592,
  light_purple_Slider: n592,
  light_purple_TextArea: n592,
  light_purple_surface2: n602,
  light_purple_Button: n602,
  light_purple_SliderThumb: n602,
  light_purple_Switch: n602,
  light_teal_accent: n612,
  light_teal_Tooltip: n612,
  light_teal_SwitchThumb: n612,
  light_teal_surface1: n622,
  light_teal_Input: n622,
  light_teal_Progress: n622,
  light_teal_Slider: n622,
  light_teal_TextArea: n622,
  light_teal_surface2: n632,
  light_teal_Button: n632,
  light_teal_SliderThumb: n632,
  light_teal_Switch: n632,
  light_neutral_accent: n642,
  light_neutral_Tooltip: n642,
  light_neutral_SwitchThumb: n642,
  light_neutral_surface1: n652,
  light_neutral_Input: n652,
  light_neutral_Progress: n652,
  light_neutral_Slider: n652,
  light_neutral_TextArea: n652,
  light_neutral_surface2: n662,
  light_neutral_Button: n662,
  light_neutral_SliderThumb: n662,
  light_neutral_Switch: n662,
  dark_black_accent: n672,
  dark_Tooltip: n672,
  dark_SwitchThumb: n672,
  dark_black_Tooltip: n672,
  dark_black_SwitchThumb: n672,
  dark_white_accent: n682,
  dark_white_Tooltip: n682,
  dark_white_SwitchThumb: n682,
  dark_white_surface1: n692,
  dark_white_Input: n692,
  dark_white_Progress: n692,
  dark_white_Slider: n692,
  dark_white_TextArea: n692,
  dark_white_surface2: n702,
  dark_white_Button: n702,
  dark_white_SliderThumb: n702,
  dark_white_Switch: n702,
  dark_gray_accent: n712,
  dark_gray_Tooltip: n712,
  dark_gray_SwitchThumb: n712,
  dark_gray_surface1: n722,
  dark_gray_Input: n722,
  dark_gray_Progress: n722,
  dark_gray_Slider: n722,
  dark_gray_TextArea: n722,
  dark_gray_surface2: n732,
  dark_gray_Button: n732,
  dark_gray_SliderThumb: n732,
  dark_gray_Switch: n732,
  dark_blue_accent: n742,
  dark_blue_Tooltip: n742,
  dark_blue_SwitchThumb: n742,
  dark_blue_surface1: n752,
  dark_blue_Input: n752,
  dark_blue_Progress: n752,
  dark_blue_Slider: n752,
  dark_blue_TextArea: n752,
  dark_blue_surface2: n762,
  dark_blue_Button: n762,
  dark_blue_SliderThumb: n762,
  dark_blue_Switch: n762,
  dark_red_accent: n772,
  dark_red_Tooltip: n772,
  dark_red_SwitchThumb: n772,
  dark_red_surface1: n782,
  dark_red_Input: n782,
  dark_red_Progress: n782,
  dark_red_Slider: n782,
  dark_red_TextArea: n782,
  dark_red_surface2: n792,
  dark_red_Button: n792,
  dark_red_SliderThumb: n792,
  dark_red_Switch: n792,
  dark_yellow_accent: n802,
  dark_yellow_Tooltip: n802,
  dark_yellow_SwitchThumb: n802,
  dark_yellow_surface1: n812,
  dark_yellow_Input: n812,
  dark_yellow_Progress: n812,
  dark_yellow_Slider: n812,
  dark_yellow_TextArea: n812,
  dark_yellow_surface2: n822,
  dark_yellow_Button: n822,
  dark_yellow_SliderThumb: n822,
  dark_yellow_Switch: n822,
  dark_green_accent: n832,
  dark_green_Tooltip: n832,
  dark_green_SwitchThumb: n832,
  dark_green_surface1: n842,
  dark_green_Input: n842,
  dark_green_Progress: n842,
  dark_green_Slider: n842,
  dark_green_TextArea: n842,
  dark_green_surface2: n852,
  dark_green_Button: n852,
  dark_green_SliderThumb: n852,
  dark_green_Switch: n852,
  dark_orange_accent: n862,
  dark_orange_Tooltip: n862,
  dark_orange_SwitchThumb: n862,
  dark_orange_surface1: n872,
  dark_orange_Input: n872,
  dark_orange_Progress: n872,
  dark_orange_Slider: n872,
  dark_orange_TextArea: n872,
  dark_orange_surface2: n882,
  dark_orange_Button: n882,
  dark_orange_SliderThumb: n882,
  dark_orange_Switch: n882,
  dark_pink_accent: n892,
  dark_pink_Tooltip: n892,
  dark_pink_SwitchThumb: n892,
  dark_pink_surface1: n902,
  dark_pink_Input: n902,
  dark_pink_Progress: n902,
  dark_pink_Slider: n902,
  dark_pink_TextArea: n902,
  dark_pink_surface2: n912,
  dark_pink_Button: n912,
  dark_pink_SliderThumb: n912,
  dark_pink_Switch: n912,
  dark_purple_accent: n922,
  dark_purple_Tooltip: n922,
  dark_purple_SwitchThumb: n922,
  dark_purple_surface1: n932,
  dark_purple_Input: n932,
  dark_purple_Progress: n932,
  dark_purple_Slider: n932,
  dark_purple_TextArea: n932,
  dark_purple_surface2: n942,
  dark_purple_Button: n942,
  dark_purple_SliderThumb: n942,
  dark_purple_Switch: n942,
  dark_teal_accent: n952,
  dark_teal_Tooltip: n952,
  dark_teal_SwitchThumb: n952,
  dark_teal_surface1: n962,
  dark_teal_Input: n962,
  dark_teal_Progress: n962,
  dark_teal_Slider: n962,
  dark_teal_TextArea: n962,
  dark_teal_surface2: n972,
  dark_teal_Button: n972,
  dark_teal_SliderThumb: n972,
  dark_teal_Switch: n972,
  dark_neutral_accent: n982,
  dark_neutral_Tooltip: n982,
  dark_neutral_SwitchThumb: n982,
  dark_neutral_surface1: n992,
  dark_neutral_Input: n992,
  dark_neutral_Progress: n992,
  dark_neutral_Slider: n992,
  dark_neutral_TextArea: n992,
  dark_neutral_surface2: n1002,
  dark_neutral_Button: n1002,
  dark_neutral_SliderThumb: n1002,
  dark_neutral_Switch: n1002,
  light_ProgressIndicator: n1012,
  light_SliderActive: n1012,
  light_white_ProgressIndicator: n1012,
  light_white_SliderActive: n1012,
  dark_ProgressIndicator: n1022,
  dark_SliderActive: n1022,
  dark_black_ProgressIndicator: n1022,
  dark_black_SliderActive: n1022,
  light_black_ProgressIndicator: n1032,
  light_black_SliderActive: n1032,
  light_gray_ProgressIndicator: n1042,
  light_gray_SliderActive: n1042,
  light_blue_ProgressIndicator: n1052,
  light_blue_SliderActive: n1052,
  light_red_ProgressIndicator: n1062,
  light_red_SliderActive: n1062,
  light_yellow_ProgressIndicator: n1072,
  light_yellow_SliderActive: n1072,
  light_green_ProgressIndicator: n1082,
  light_green_SliderActive: n1082,
  light_orange_ProgressIndicator: n1092,
  light_orange_SliderActive: n1092,
  light_pink_ProgressIndicator: n1102,
  light_pink_SliderActive: n1102,
  light_purple_ProgressIndicator: n1112,
  light_purple_SliderActive: n1112,
  light_teal_ProgressIndicator: n1122,
  light_teal_SliderActive: n1122,
  light_neutral_ProgressIndicator: n1132,
  light_neutral_SliderActive: n1132,
  dark_white_ProgressIndicator: n1142,
  dark_white_SliderActive: n1142,
  dark_gray_ProgressIndicator: n1152,
  dark_gray_SliderActive: n1152,
  dark_blue_ProgressIndicator: n1162,
  dark_blue_SliderActive: n1162,
  dark_red_ProgressIndicator: n1172,
  dark_red_SliderActive: n1172,
  dark_yellow_ProgressIndicator: n1182,
  dark_yellow_SliderActive: n1182,
  dark_green_ProgressIndicator: n1192,
  dark_green_SliderActive: n1192,
  dark_orange_ProgressIndicator: n1202,
  dark_orange_SliderActive: n1202,
  dark_pink_ProgressIndicator: n1212,
  dark_pink_SliderActive: n1212,
  dark_purple_ProgressIndicator: n1222,
  dark_purple_SliderActive: n1222,
  dark_teal_ProgressIndicator: n1232,
  dark_teal_SliderActive: n1232,
  dark_neutral_ProgressIndicator: n1242,
  dark_neutral_SliderActive: n1242
};

// ../core/config/dist/esm/v5-fonts.mjs
import { createFont, getVariableValue } from "@hanzogui/core";
var defaultSizes = {
  1: 12,
  2: 13,
  3: 14,
  4: 15,
  true: 15,
  5: 16,
  6: 18,
  7: 22,
  8: 26,
  9: 30,
  10: 40,
  11: 46,
  12: 52,
  13: 60,
  14: 70,
  15: 85,
  16: 100
};
var defaultLineHeight = /* @__PURE__ */ __name((size3) => {
  const ratio = 1.5 - Math.max(0, (size3 - 20) * 4e-3);
  return Math.round(size3 * ratio);
}, "defaultLineHeight");
var createSystemFont = /* @__PURE__ */ __name(({
  font = {},
  sizeLineHeight = defaultLineHeight,
  sizeSize = /* @__PURE__ */ __name((size3) => Math.round(size3), "sizeSize")
} = {}) => {
  const size3 = Object.fromEntries(Object.entries({
    ...defaultSizes,
    ...font.size
  }).map(([k, v]) => [k, sizeSize(+v)]));
  return createFont({
    family: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    lineHeight: Object.fromEntries(Object.entries(size3).map(([k, v]) => [k, sizeLineHeight(getVariableValue(v))])),
    weight: {
      1: "400"
    },
    letterSpacing: {
      4: 0
    },
    ...font,
    size: size3
  });
}, "createSystemFont");
var headingLineHeight = /* @__PURE__ */ __name((size3) => Math.round(size3 * 1.12 + 5), "headingLineHeight");
var fonts = {
  body: createSystemFont(),
  heading: createSystemFont({
    font: {
      weight: {
        0: "600",
        6: "700",
        9: "800"
      }
    },
    sizeLineHeight: headingLineHeight
  })
};

// ../core/config/dist/esm/v5-media.mjs
var breakpoints = {
  100: 100,
  200: 200,
  xxxs: 260,
  xxs: 340,
  xs: 460,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536
};
var mediaQueryForceNonOverlap = 0.02;
var media = {
  touchable: {
    pointer: "coarse"
  },
  hoverable: {
    hover: "hover"
  },
  "max-xxl": {
    maxWidth: breakpoints.xxl - mediaQueryForceNonOverlap
  },
  "max-xl": {
    maxWidth: breakpoints.xl - mediaQueryForceNonOverlap
  },
  "max-lg": {
    maxWidth: breakpoints.lg - mediaQueryForceNonOverlap
  },
  "max-md": {
    maxWidth: breakpoints.md - mediaQueryForceNonOverlap
  },
  "max-sm": {
    maxWidth: breakpoints.sm - mediaQueryForceNonOverlap
  },
  "max-xs": {
    maxWidth: breakpoints.xs - mediaQueryForceNonOverlap
  },
  "max-xxs": {
    maxWidth: breakpoints.xxs - mediaQueryForceNonOverlap
  },
  "max-xxxs": {
    maxWidth: breakpoints.xxxs - mediaQueryForceNonOverlap
  },
  "max-200": {
    maxWidth: breakpoints["200"] - mediaQueryForceNonOverlap
  },
  "max-100": {
    maxWidth: breakpoints["100"] - mediaQueryForceNonOverlap
  },
  xxxs: {
    minWidth: breakpoints.xxxs
  },
  xxs: {
    minWidth: breakpoints.xxs
  },
  xs: {
    minWidth: breakpoints.xs
  },
  sm: {
    minWidth: breakpoints.sm
  },
  md: {
    minWidth: breakpoints.md
  },
  lg: {
    minWidth: breakpoints.lg
  },
  xl: {
    minWidth: breakpoints.xl
  },
  xxl: {
    minWidth: breakpoints.xxl
  },
  "max-height-lg": {
    maxHeight: breakpoints.lg - mediaQueryForceNonOverlap
  },
  "max-height-md": {
    maxHeight: breakpoints.md - mediaQueryForceNonOverlap
  },
  "max-height-sm": {
    maxHeight: breakpoints.sm - mediaQueryForceNonOverlap
  },
  "max-height-xs": {
    maxHeight: breakpoints.xs - mediaQueryForceNonOverlap
  },
  "max-height-xxs": {
    maxHeight: breakpoints.xxs - mediaQueryForceNonOverlap
  },
  "max-height-xxxs": {
    maxHeight: breakpoints.xxxs - mediaQueryForceNonOverlap
  },
  "max-height-200": {
    maxHeight: breakpoints["200"] - mediaQueryForceNonOverlap
  },
  "max-height-100": {
    maxHeight: breakpoints["100"] - mediaQueryForceNonOverlap
  },
  "height-sm": {
    minHeight: breakpoints.sm
  },
  "height-md": {
    minHeight: breakpoints.md
  },
  "height-lg": {
    minHeight: breakpoints.lg
  }
};
var mediaQueryDefaultActive = {
  touchable: false,
  hoverable: true,
  "max-xxl": true,
  "max-xl": true,
  "max-lg": true,
  "max-md": true,
  "max-sm": true,
  "max-xs": true,
  "max-xxs": false,
  "max-xxxs": false,
  xxxs: true,
  xxs: true,
  xs: true,
  sm: false,
  md: false,
  lg: false,
  xl: false,
  xxl: false,
  "max-height-sm": false,
  "max-height-md": false,
  "max-height-lg": true,
  "height-sm": true,
  "height-md": true,
  "height-lg": false
};

// ../core/config/dist/esm/v5-base.mjs
var selectionStyles = /* @__PURE__ */ __name((theme) => theme.color5 ? {
  backgroundColor: theme.color5,
  color: theme.color11
} : null, "selectionStyles");
var settings = {
  mediaQueryDefaultActive,
  defaultFont: "body",
  fastSchemeChange: true,
  shouldAddPrefersColorThemes: true,
  allowedStyleValues: "somewhat-strict-web",
  addThemeClassName: "html",
  onlyAllowShorthands: true,
  styleCompat: "react-native"
};
var defaultConfig = {
  media,
  shorthands,
  themes: themes2,
  tokens,
  fonts,
  selectionStyles,
  settings
};

// ../packages/gui-dev-config/dist/esm/gui.dev.config.mjs
import { setupDev } from "@hanzogui/core";

// ../core/font-cherry-bomb/dist/esm/index.mjs
import { createFont as createFont2, getVariableValue as getVariableValue2 } from "@hanzogui/core";
var createCherryBombFont = /* @__PURE__ */ __name((font = {}, {
  sizeLineHeight = /* @__PURE__ */ __name((size3) => size3 + 10, "sizeLineHeight"),
  sizeSize = /* @__PURE__ */ __name((size3) => size3 * 1, "sizeSize")
} = {}) => {
  const size3 = Object.fromEntries(Object.entries({
    ...defaultSizes2,
    ...font.size
  }).map(([k, v]) => [k, Math.round(sizeSize(+v))]));
  return createFont2({
    family: isWeb ? '"Cherry Bomb", -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' : '"Cherry Bomb"',
    lineHeight: Object.fromEntries(Object.entries(size3).map(([k, v]) => [k, Math.round(sizeLineHeight(getVariableValue2(v)))])),
    weight: {
      4: "300"
    },
    letterSpacing: {
      4: 0
    },
    ...font,
    size: size3
  });
}, "createCherryBombFont");
var scale = 1.6;
var defaultSizes2 = {
  1: scale * 11,
  2: scale * 12,
  3: scale * 13,
  4: scale * 14,
  true: scale * 14,
  5: scale * 16,
  6: scale * 18,
  7: scale * 20,
  8: scale * 23,
  9: scale * 30,
  10: scale * 46,
  11: scale * 55,
  12: scale * 62,
  13: scale * 72,
  14: scale * 92,
  15: scale * 114,
  16: scale * 134
};

// ../core/font-inter/dist/esm/index.mjs
import { createFont as createFont3, getVariableValue as getVariableValue3, isWeb as isWeb2 } from "@hanzogui/core";
var createInterFont = /* @__PURE__ */ __name((font = {}, {
  sizeLineHeight = /* @__PURE__ */ __name((size3) => size3 + 10, "sizeLineHeight"),
  sizeSize = /* @__PURE__ */ __name((size3) => size3 * 1, "sizeSize")
} = {}) => {
  const size3 = Object.fromEntries(Object.entries({
    ...defaultSizes3,
    ...font.size
  }).map(([k, v]) => [k, sizeSize(+v)]));
  return createFont3({
    family: isWeb2 ? 'Inter, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' : "Inter",
    lineHeight: Object.fromEntries(Object.entries(size3).map(([k, v]) => [k, sizeLineHeight(getVariableValue3(v))])),
    weight: {
      4: "300"
    },
    letterSpacing: {
      4: 0
    },
    ...font,
    size: size3
  });
}, "createInterFont");
var defaultSizes3 = {
  1: 11,
  2: 12,
  3: 13,
  4: 14,
  true: 14,
  5: 16,
  6: 18,
  7: 20,
  8: 23,
  9: 30,
  10: 46,
  11: 55,
  12: 62,
  13: 72,
  14: 92,
  15: 114,
  16: 134
};

// ../core/font-silkscreen/dist/esm/index.mjs
import { createFont as createFont4, isWeb as isWeb3 } from "@hanzogui/core";
var createSilkscreenFont = /* @__PURE__ */ __name((font = {}) => {
  return createFont4({
    family: isWeb3 ? "Silkscreen, Fira Code, Monaco, Consolas, Ubuntu Mono, monospace" : "Silkscreen",
    size: size2,
    lineHeight: Object.fromEntries(Object.entries(font.size || size2).map(([k, v]) => [k, typeof v === "number" ? Math.round(v * 1.2 + 6) : v])),
    weight: {
      4: "300"
    },
    letterSpacing: {
      4: 1,
      5: 3,
      6: 3,
      9: -2,
      10: -3,
      12: -4
    },
    ...font
  });
}, "createSilkscreenFont");
var size2 = {
  1: 11,
  2: 12,
  3: 13,
  4: 14,
  5: 15,
  6: 16,
  7: 18,
  8: 21,
  9: 28,
  10: 42,
  11: 52,
  12: 62,
  13: 72,
  14: 92,
  15: 114,
  16: 124
};

// ../packages/gui-dev-config/dist/esm/createGenericFont.mjs
import { createFont as createFont5 } from "@hanzogui/core";
var genericFontSizes = {
  1: 10,
  2: 11,
  3: 12,
  4: 14,
  5: 15,
  6: 16,
  7: 20,
  8: 22,
  9: 30,
  10: 42,
  11: 52,
  12: 62,
  13: 72,
  14: 92,
  15: 114,
  16: 124
};
function createGenericFont(family, font = {}, {
  sizeLineHeight = /* @__PURE__ */ __name((val) => val * 1.35, "sizeLineHeight")
} = {}) {
  const size3 = font.size || genericFontSizes;
  return createFont5({
    family,
    size: size3,
    lineHeight: Object.fromEntries(Object.entries(size3).map(([k, v]) => [k, sizeLineHeight(+v)])),
    weight: {
      0: "300"
    },
    letterSpacing: {
      4: 0
    },
    ...font
  });
}
__name(createGenericFont, "createGenericFont");

// ../packages/gui-dev-config/dist/esm/fonts.mjs
var cherryBombFont = createCherryBombFont({
  family: '"Cherry Bomb", Arial, sans-serif'
});
var silkscreenFont = createSilkscreenFont();
var headingFont = createInterFont({
  size: {
    5: 13,
    6: 15,
    9: 30,
    10: 44
  },
  transform: {
    6: "uppercase",
    7: "none"
  },
  weight: {
    6: "400",
    7: "700"
  },
  color: {
    6: "$colorFocus",
    7: "$color"
  },
  letterSpacing: {
    5: 2,
    6: 1,
    7: 0,
    8: 0,
    9: -0.1,
    10: -0.25,
    11: -0.5,
    12: -0.75,
    14: -1,
    15: -2
  },
  // for native
  face: {
    700: {
      normal: "InterBold"
    },
    800: {
      normal: "InterBold"
    },
    900: {
      normal: "InterBold"
    }
  }
}, {
  sizeLineHeight: /* @__PURE__ */ __name((size3) => Math.round(size3 * 1.1 + (size3 < 30 ? 10 : 5)), "sizeLineHeight")
});
var bodyFont = createInterFont({
  weight: {
    1: "400"
  }
}, {
  sizeSize: /* @__PURE__ */ __name((size3) => Math.round(size3), "sizeSize"),
  sizeLineHeight: /* @__PURE__ */ __name((size3) => Math.round(size3 * 1.2 + (size3 >= 20 ? 12 : 8)), "sizeLineHeight")
});
var monoFont = createGenericFont(`"Berkeley Mono", "ui-monospace", "SFMono-Regular", "SF Mono", Menlo, Consolas, "Liberation Mono", monospace`, {
  weight: {
    1: "400"
  },
  size: {
    1: 11,
    2: 12,
    3: 13,
    4: 14,
    5: 16,
    6: 18,
    7: 20,
    8: 22,
    9: 24,
    10: 32,
    11: 46,
    12: 62,
    13: 72,
    14: 92,
    15: 114,
    16: 124
  }
}, {
  sizeLineHeight: /* @__PURE__ */ __name((x) => x * 1.5 + 2, "sizeLineHeight")
});

// ../packages/gui-dev-config/dist/esm/media.mjs
var demoMedia = [500, 620, 780, 900];
var widths = [660, 800, 1020, 1280];
var breakpoints2 = {
  "2xl": 1536,
  xl: 1280,
  lg: 1024,
  md: 768,
  sm: 640,
  xs: 460,
  "2xs": 340
};
var media2 = {
  // v4 Config
  maxXs: {
    maxWidth: breakpoints2.xs
  },
  max2xs: {
    maxWidth: breakpoints2["2xs"]
  },
  maxSm: {
    maxWidth: breakpoints2.sm
  },
  maxMd: {
    maxWidth: breakpoints2.md
  },
  maxLg: {
    maxWidth: breakpoints2.lg
  },
  maxXl: {
    maxWidth: breakpoints2.xl
  },
  max2Xl: {
    maxWidth: breakpoints2["2xl"]
  },
  // for site
  xl: {
    maxWidth: 1650
  },
  // between lg and xl - for studio usage
  lg_xl: {
    maxWidth: 1400
  },
  lg: {
    maxWidth: 1280
  },
  md: {
    maxWidth: 1020
  },
  sm: {
    maxWidth: 800
  },
  xs: {
    maxWidth: 660
  },
  xxs: {
    maxWidth: 390
  },
  gtXxs: {
    minWidth: 390 + 1
  },
  gtXs: {
    minWidth: 660 + 1
  },
  gtSm: {
    minWidth: 800 + 1
  },
  gtMd: {
    minWidth: 1020 + 1
  },
  gtLg: {
    minWidth: 1280 + 1
  },
  gtXl: {
    minWidth: 1650 + 1
  },
  pointerFine: {
    pointer: "fine"
  }
};
var mediaQueryDefaultActive2 = {
  xl: true,
  lg: true,
  md: true,
  sm: true,
  xs: true,
  // false
  xxs: false
};

// ../packages/gui-dev-config/dist/esm/gui.dev.config.mjs
setupDev({
  visualizer: true
});
var fonts2 = {
  heading: headingFont,
  body: bodyFont,
  mono: monoFont,
  silkscreen: silkscreenFont,
  cherryBomb: cherryBombFont
};
var animations = {
  default: animationsMotion,
  css: animationsCSS
};
var config = {
  ...defaultConfig,
  themes: process.env.VITE_ENVIRONMENT === "client" ? {} : themes,
  fonts: fonts2,
  animations,
  media: media2,
  settings: {
    ...defaultConfig.settings,
    mediaQueryDefaultActive: mediaQueryDefaultActive2,
    allowedStyleValues: "somewhat-strict-web",
    autocompleteSpecificTokens: "except-special",
    // Allow both shorthands and longhand names for flexibility
    onlyAllowShorthands: false
  }
};
Object.assign(config.media, {
  tiny: {
    maxWidth: 500
  },
  gtTiny: {
    minWidth: 500 + 1
  },
  small: {
    maxWidth: 620
  },
  gtSmall: {
    minWidth: 620 + 1
  },
  medium: {
    maxWidth: 780
  },
  gtMedium: {
    minWidth: 780 + 1
  },
  large: {
    maxWidth: 900
  },
  gtLarge: {
    minWidth: 900 + 1
  }
});
export {
  animations,
  config,
  demoMedia,
  media2 as media,
  mediaQueryDefaultActive2 as mediaQueryDefaultActive,
  widths
};
