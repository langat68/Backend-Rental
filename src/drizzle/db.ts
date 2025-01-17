import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { Client } from "pg";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";
import Stripe from 'stripe';

export const client = new Client({
    connectionString: process.env.Database_URL as string,
});

const DatabaseUrl = process.env.Database_URL as string;

if (!DatabaseUrl) {
    throw new Error("DatabaseUrl not set");
}

console.log("neon client creating");
const clienter = neon(DatabaseUrl);
console.log("neon client created");

export const db = drizzle(clienter, { schema, logger: true });

const main = async () => {
    await client.connect();
}

main().catch((err) => console.log(err));

export default db;

// Stripe initialization
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set in the environment variables");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
    typescript: true
});

//////////postgres
// import "dotenv/config";
// import { drizzle } from "drizzle-orm/node-postgres";
// import {Client} from "pg";
// import * as schema from "./schema";

// export const client = new Client({
//    connectionString: process.env.DATABASE_URL as string,
// })
// const main = async () => {
//    await client.connect();
// }
// main();

// const db = drizzle(client, {schema, logger:true})
// export default db;