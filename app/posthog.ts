import posthog from "posthog-js";

if (typeof window !== "undefined") {
  posthog.init("phc_dCf5qVzEYMa0U1WFXkOPADoLfwynEtgM2DVt7LrojUm", {
    api_host: "https://app.posthog.com",
    capture_pageview: true,
  });
}

export default posthog;
