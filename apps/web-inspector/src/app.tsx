import "./index.css";

import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import { TooltipProvider } from "@regarde/ui/ui/tooltip";

import { routeTree } from "./routeTree.gen";
import ReactDOM from "react-dom/client";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <TooltipProvider>
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>
    </TooltipProvider>
  );
}
