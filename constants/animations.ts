/**
 * SIDRA Motion System
 */

export const ANIMATIONS = {
 DURATION: {
  INSTANT: 0,

      FAST: 150,

      NORMAL: 250,

      SLOW: 400,

      HERO: 600,

   SPLASH: 3500
 },

 EASING: {
  STANDARD: [0.4, 0, 0.2, 1],

      EMPHASIZED: [0.2, 0, 0, 1],

      DECELERATE: [0, 0, 0.2, 1],

   ACCELERATE: [0.4, 0, 1, 1]
 },

 DISCOVERY_PAD: {
  RIPPLE: 300,

      PORTAL: 700,

   GLASS: 500
 },

 PAGE: {
  ENTER: 400,

      EXIT: 250
  }
} as const;
