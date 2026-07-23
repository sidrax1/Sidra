/**
 * SIDRA Regular Expressions
 */

export const REGEX = {
 EMAIL:
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

 PHONE:
  /^[6-9]\d{9}$/,

 USERNAME:
  /^[a-zA-Z0-9_]{3,30}$/,

 SLUG:
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/,

 PINCODE:
  /^[1-9][0-9]{5}$/,

 HEX_COLOR:
  /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,

 URL:
  /^https?:\/\/.+$/,

  OTP:
    /^[0-9]{6}$/
} as const;
