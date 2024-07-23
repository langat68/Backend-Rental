import { Hono } from "hono";
import { Context } from "hono";
import { listVehicles, getVehicles, createVehicles, updateVehicles, deleteVehicles } from "./Vehicles.controller";
import { zValidator } from "@hono/zod-validator";
import { vehiclesSchema } from "../validators";
import { adminRoleAuth,userRoleAuth } from "../middleware/middleAuth"


export const vehiclesRouter = new Hono();

// Get all vehicles
vehiclesRouter.get("/Vehicles", listVehicles);
// Get a single vehicle
vehiclesRouter.get("/Vehicles/:id", getVehicles);
// Create a vehicle
vehiclesRouter.post("/Vehicles", zValidator('json', vehiclesSchema, (result, c) => {
  if (!result.success) {
    return c.json(result.error, 400);
  }
}), createVehicles);

// Update a vehicle
vehiclesRouter.put("/Vehicles/:id", updateVehicles);

vehiclesRouter.get("/Vehicles", zValidator('json', vehiclesSchema, (result, c) => {
  if (!result.success) {
    return c.json(result.error, 400);
  }
}), createVehicles);

// Delete a vehicle
vehiclesRouter.delete("/Vehicles/:id", deleteVehicles);

vehiclesRouter.get("/Vehicles", getVehicles);
