import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";

import App from "./App.jsx";
import { AppContexProvider } from "./contex/AppContex.jsx";

import "./index.css";


// =====================================
// CLERK PUBLISHABLE KEY
// =====================================

const PUBLISHABLE_KEY =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;


// =====================================
// CHECK CLERK KEY
// =====================================

if (!PUBLISHABLE_KEY) {

  throw new Error(
    "Missing VITE_CLERK_PUBLISHABLE_KEY environment variable"
  );

}


// =====================================
// ROOT ELEMENT
// =====================================

const rootElement =
  document.getElementById("root");


// =====================================
// CHECK ROOT ELEMENT
// =====================================

if (!rootElement) {

  throw new Error(
    "Root element not found"
  );

}


// =====================================
// RENDER APPLICATION
// =====================================

createRoot(rootElement).render(

  <StrictMode>

    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
    >

      <BrowserRouter>

        <AppContexProvider>

          <App />

        </AppContexProvider>

      </BrowserRouter>

    </ClerkProvider>

  </StrictMode>

);