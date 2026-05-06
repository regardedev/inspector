import { createFileRoute } from "@tanstack/react-router";

import { ConnPage } from "@/components/onboarding/connPage";

export const Route = createFileRoute("/conn")({
  component: ConnPage,
});
