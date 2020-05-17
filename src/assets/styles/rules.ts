import { breakPoints } from "./variables";

export const breakRules = {
  maxSmall: `@media only screen and (max-width: ${breakPoints.small})`,
  maxMedium: `@media only screen and (max-width: ${breakPoints.medium})`,
  maxLarge: `@media only screen and (max-width: ${breakPoints.large})`
};

export const boxShadow = "inset 0 9px 11px -9px rgba(0, 0, 0, 0.22)";

export const fadeOutRule = {
  animationName: "fade-out",
  animationIterationCount: 1,
  animationDuration: "0.2s",
  animationFillMode: "forwards",
  animationTimingFunction: "ease-in"
};

export const fadeInRule = {
  animationName: "fade-in",
  animationIterationCount: 1,
  animationDuration: "0.2s",
  animationFillMode: "forwards",
  animationTimingFunction: "ease-in"
};
