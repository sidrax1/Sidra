import {
  collection,
  type CollectionReference,
} from "firebase/firestore";

import { COLLECTIONS } from "@/constants";

import { getFirebaseFirestore } from "@/firebase/firestore";
import {
  orderConverter,
  productConverter,
  studioConverter,
  userConverter,
} from "@/firebase/converters";

import type {
  Order,
  Product,
  Studio,
  User,
} from "@/types";

const db = getFirebaseFirestore();

export const usersCollection =
 collection(
   db,
   COLLECTIONS.USERS
 ).withConverter(userConverter) as CollectionReference<User>;

export const studiosCollection =
 collection(
   db,
   COLLECTIONS.STUDIOS
 ).withConverter(studioConverter) as CollectionReference<Studio>;

export const productsCollection =
 collection(
   db,
   COLLECTIONS.PRODUCTS
 ).withConverter(productConverter) as CollectionReference<Product>;

export const ordersCollection =
  collection(
    db,
    COLLECTIONS.ORDERS
  ).withConverter(orderConverter) as CollectionReference<Order>;
