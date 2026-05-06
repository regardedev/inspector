import { createFileRoute } from "@tanstack/react-router";

import { NewConnectionPage } from "@/components/onboarding/newConnectionPage";

export const Route = createFileRoute("/conn/new")({
  component: NewConnectionPage,
});
