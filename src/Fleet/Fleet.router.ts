import { Hono } from "hono";
import { Context } from "hono";
import { listFleet, getFleet, createFleet, updateFleet, deleteFleet } from "./Fleet.controller";
import { zValidator } from "@hono/zod-validator";
import { fleetSchema } from "../validators";
import { adminRoleAuth,userRoleAuth } from "../middleware/middleAuth"

export const fleetRouter = new Hono();

// get all fleets
fleetRouter.get("/fleet-management",listFleet);

// get a single fleet
fleetRouter.get("/fleet-management/:id", getFleet);

// create a fleet
fleetRouter.post("/fleet-management", zValidator('json', fleetSchema, (result, c) => {
  if (!result.success) {
    return c.json(result.error, 400);
  }
}), createFleet);

// update a fleet
fleetRouter.put("/fleet-management/:id", updateFleet);

// delete fleet
fleetRouter.delete("/fleet-management/:id", deleteFleet);
