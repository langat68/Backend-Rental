import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import 'dotenv/config';
import { logger } from 'hono/logger';
import { csrf } from 'hono/csrf';
import { trimTrailingSlash } from 'hono/trailing-slash';
import { timeout } from 'hono/timeout';
import { HTTPException } from 'hono/http-exception';
import { prometheus } from '@hono/prometheus';
import { cors } from 'hono/cors';

// Import all routers
import { userRouter } from './users/user.router';
import { vehiclesRouter } from './Vehicles/Vehicles.router';
import { locationsRouter } from './Location/Location.router';
import { bookingsRouter } from './Bookings/Bookings.router';
import { paymentsRouter } from './Payments/Payments.router';
import { authRouter } from './auth/auth.router';
import { customerSupportRouter } from './CustomerSupport/CustomerSupport.router';
import { fleetRouter } from './Fleet/Fleet.router';
import { vehicleSpecificationsRouter } from './VehicleSpecicifations/VehicleSpecifications.router';
import { handleStripeWebhook } from './Payments/Payments.controller';

const app = new Hono().basePath('/api');

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Adjust to match your frontend origin
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// CSP Middleware
app.use('*', (c, next) => {
  c.res.headers.set("Content-Security-Policy", "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:;");
  return next();
});

// Custom timeout exception
const customTimeoutException = () =>
  new HTTPException(408, { message: `Request timeout` });

// Prometheus metrics
const { printMetrics, registerMetrics } = prometheus();

// Middlewares
app.use(logger());
app.use(csrf());
app.use(trimTrailingSlash());
app.use('/', timeout(10000, customTimeoutException));
app.use('*', registerMetrics);

// Routes
app.get('/ok', (c) => c.text('The server is running!'));
app.get('/timeout', async (c) => {
  await new Promise((resolve) => setTimeout(resolve, 11000));
  return c.text("data after 11 seconds", 200);
});
app.get('/metrics', printMetrics);

// Use all routers
app.route("/", userRouter);
app.route("/", vehiclesRouter);
app.route("/", locationsRouter);
app.route("/", bookingsRouter);
app.route("/", paymentsRouter);
app.route("/", authRouter);
app.route("/", customerSupportRouter);
app.route("/", fleetRouter);
app.route("/", vehicleSpecificationsRouter);

// Stripe webhook
app.post('/webhook', handleStripeWebhook);

// Home route
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Vehicle Rental Management System</title>
    </head>
    <body>
      <h1>Welcome to the Vehicle Rental Management System</h1>
      <p>Server is running...</p>
      <h2>Available Routes:</h2>
      <ul>
        <li><a href="/api/ok">/api/ok</a></li>
        <li><a href="/api/timeout">/api/timeout</a></li>
        <li><a href="/api/metrics">/api/metrics</a></li>
      </ul>
    </body>
    </html>
  `);
});

// Start the server
serve({
  fetch: app.fetch,
  port: Number(process.env.PORT) || 8000
});

console.log(`Server is running on port ${process.env.PORT || 8000}`);
