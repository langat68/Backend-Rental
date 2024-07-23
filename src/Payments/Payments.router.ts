import { Hono } from "hono";
import { Context } from "hono";
import { listPayments, getPayments, createPayments, updatePayments, deletePayments } from "./Payments.controller";
import { zValidator } from "@hono/zod-validator";
import { paymentsSchema } from "../validators";
import { adminRoleAuth,userRoleAuth } from "../middleware/middleAuth"


export const paymentsRouter = new Hono();

// Get all payments
paymentsRouter.get("/payment", listPayments);
// Get a single payment
paymentsRouter.get("/payment/:id", getPayments);
// Create a payment
paymentsRouter.post("/payment", zValidator('json', paymentsSchema, (result, c) => {
  if (!result.success) {
    return c.json(result.error, 400);
  }
}), createPayments);

// Update a payment
paymentsRouter.put("/payment/:id", updatePayments);

paymentsRouter.get("/payment", zValidator('json', paymentsSchema, (result, c) => {
  if (!result.success) {
    return c.json(result.error, 400);
  }
}), createPayments);

// Delete a payment
paymentsRouter.delete("/payment/:id", deletePayments);

paymentsRouter.get("/payment", getPayments);
