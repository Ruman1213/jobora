



import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
    dsn: "https://aaef77d85441b95426cb30973b80fd6f@o4511875807576064.ingest.us.sentry.io/4511875815112704",

    integrations: [
        nodeProfilingIntegration(),
        Sentry.mongooseIntegration()
         
    ],
 
    // tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
});

