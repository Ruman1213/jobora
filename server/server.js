import "./config/instrument.js";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import * as Sentry from "@sentry/node";

import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";

import { clerkMiddleware } from "@clerk/express";

import { clerkWebhooks } from "./controllers/webhooks.js";

import companyRoutes from "./routes/companyRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

// ==============================
// CONNECT DATABASE
// ==============================

await connectDB();

// ==============================
// CONNECT CLOUDINARY
// ==============================

await connectCloudinary();

// ==============================
// CORS
// ==============================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ==============================
// BODY PARSER
// ==============================

app.use(express.json());

// ==============================
// CLERK MIDDLEWARE
// ==============================

app.use(clerkMiddleware());

// ==============================
// TEST ROUTE
// ==============================

app.get("/", (req, res) => {
  res.send("API Working");
});

// ==============================
// CLERK WEBHOOK
// ==============================

app.post("/webhooks", clerkWebhooks);

// ==============================
// ROUTES
// ==============================

app.use("/api/company", companyRoutes);

app.use("/api/jobs", jobRoutes);

app.use("/api/users", userRoutes);

// ==============================
// SENTRY ERROR HANDLER
// ==============================

Sentry.setupExpressErrorHandler(app);

// ==============================
// START SERVER
// ==============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});