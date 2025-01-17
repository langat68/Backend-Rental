import { Hono } from "hono";
import { Context } from "hono";
import { listCustomerSupport, getCustomerSupport, createCustomerSupport, updateCustomerSupport, deleteCustomerSupport } from "./CustomerSupport.controller";
import { zValidator } from "@hono/zod-validator";
import { customerSupportSchema } from "../validators";

export const customerSupportRouter = new Hono();

// Get all customer support
customerSupportRouter.get("/customer-support-tickets", listCustomerSupport);
// Get a single customer support entry
customerSupportRouter.get("/customer-support-tickets/:id", getCustomerSupport);
// Create a customer support entry
customerSupportRouter.post("/customer-support-tickets", zValidator('json', customerSupportSchema, (result, c) => {
  if (!result.success) {
    return c.json(result.error, 400);
  }
}), createCustomerSupport);

// Update a customer support entry
customerSupportRouter.put("/customer-support-tickets/:id", updateCustomerSupport);

customerSupportRouter.get("/customer-support-tickets", zValidator('json', customerSupportSchema, (result, c) => {
  if (!result.success) {
    return c.json(result.error, 400);
  }
}), createCustomerSupport);

// Delete a customer support entry
customerSupportRouter.delete("/customer-support/:id", deleteCustomerSupport);

customerSupportRouter.get("/customer-support", getCustomerSupport);
