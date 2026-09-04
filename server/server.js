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


// =====================================
// LOAD ENVIRONMENT VARIABLES
// =====================================

dotenv.config();


// =====================================
// CREATE EXPRESS APP
// =====================================

const app = express();


// =====================================
// ALLOWED FRONTEND ORIGINS
// =====================================

const allowedOrigins = [
  "http://localhost:5173",
  "https://jobora-client.vercel.app",
];


// =====================================
// CORS CONFIGURATION
// =====================================

app.use(
  cors({
    origin: (origin, callback) => {

      console.log("Request Origin:", origin);

      // Allow Postman / server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      // Allow localhost and production frontend
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow Vercel preview deployments
      if (
        origin.endsWith(".vercel.app") &&
        origin.includes("jobora-client")
      ) {
        return callback(null, true);
      }

      console.log(
        "CORS blocked:",
        origin
      );

      return callback(
        new Error(
          `CORS not allowed for origin: ${origin}`
        )
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "token",
    ],
  })
);


// =====================================
// CLERK WEBHOOK
// MUST COME BEFORE express.json()
// =====================================

app.post(
  "/webhooks",
  express.raw({
    type: "application/json",
  }),
  clerkWebhooks
);


// =====================================
// BODY PARSERS
// =====================================

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);


// =====================================
// CLERK MIDDLEWARE
// =====================================

app.use(
  clerkMiddleware()
);


// =====================================
// TEST ROUTE
// =====================================

app.get(
  "/",
  (req, res) => {

    return res.status(200).json({
      success: true,
      message: "API Working",
    });

  }
);


// =====================================
// API ROUTES
// =====================================

app.use(
  "/api/company",
  companyRoutes
);

app.use(
  "/api/jobs",
  jobRoutes
);

app.use(
  "/api/users",
  userRoutes
);


// =====================================
// SENTRY ERROR HANDLER
// =====================================

Sentry.setupExpressErrorHandler(app);


// =====================================
// GENERAL ERROR HANDLER
// =====================================

app.use(
  (error, req, res, next) => {

    console.error(
      "Server Error:",
      error.message
    );

    return res.status(
      error.status || 500
    ).json({
      success: false,
      message:
        error.message ||
        "Internal Server Error",
    });

  }
);


// =====================================
// START SERVER
// =====================================

const PORT =
  process.env.PORT || 5000;


const startServer = async () => {

  try {

    await connectDB();

    await connectCloudinary();

    app.listen(
      PORT,
      () => {

        console.log(
          `Server is running on port ${PORT}`
        );

      }
    );

  } catch (error) {

    console.error(
      "Failed to start server:",
      error
    );

    process.exit(1);

  }

};


startServer();