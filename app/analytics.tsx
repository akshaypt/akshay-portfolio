"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export default function Analytics() {
  useEffect(() => {
    posthog.init("phc_dCf5qVzEYMa0U1WFXkOPADoLfwynEtgM2DVt7LrojUm", {
      api_host: "https://app.posthog.com",
      capture_pageview: true,
    });
  }, []);

  return null;
}
