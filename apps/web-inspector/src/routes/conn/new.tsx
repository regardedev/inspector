import { createFileRoute } from "@tanstack/react-router";

import { NewConnectionSheet } from "@/components/onboarding/newConnectionSheet";

export const Route = createFileRoute("/conn/new")({
  component: NewConnectionSheet,
});
