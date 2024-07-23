import { Hono } from "hono";
import { Context } from "hono";
import { listLocations, getLocations, createLocations, updateLocations, deleteLocations } from "./Location.controller"; // Importing controller functions for locations
import { zValidator } from "@hono/zod-validator";
import { locationsSchema } from "../validators"; 
import { adminRoleAuth,userRoleAuth } from "../middleware/middleAuth"


// Creating a new instance of Hono router
export const locationsRouter = new Hono();

// Endpoint to get all locations
locationsRouter.get("/location", listLocations);

// Endpoint to get a single location by ID
locationsRouter.get("/location/:id", getLocations);

// Endpoint to create a new location
locationsRouter.post("/location", zValidator('json', locationsSchema, (result, c) => {
  if (!result.success) {
    return c.json(result.error, 400); // Return validation error if schema validation fails
  }
}), createLocations);

// Endpoint to update an existing location by ID
locationsRouter.put("/location/:id", updateLocations);

// Endpoint to delete a location by ID
locationsRouter.delete("/location/:id", deleteLocations);

// Endpoint to get a location by ID (duplicate definition, assuming it's intentional)
locationsRouter.get("/location/:id", getLocations);
