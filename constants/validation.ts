/**
 * SIDRA Validation Rules
 */

export const VALIDATION = {
 NAME: {
   MIN: 2,
   MAX: 60
 },

 BIO: {

   MAX: 500
 },

 PRODUCT_TITLE: {
   MIN: 5,
   MAX: 120
 },

 PRODUCT_DESCRIPTION: {
   MIN: 30,
   MAX: 5000
 },

 CATEGORY_NAME: {
   MIN: 3,
   MAX: 40
 },

 PRICE: {
   MIN: 1,
   MAX: 10000000
 },

 STOCK: {
   MIN: 0,
   MAX: 999999
 },

 REVIEW: {
   MIN: 10,
   MAX: 2000
 },

  SEARCH: {
    MIN: 2,
    MAX: 100
  }
} as const;
