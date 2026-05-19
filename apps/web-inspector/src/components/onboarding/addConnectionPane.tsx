import { useNavigate } from "@tanstack/react-router";
import { XIcon } from "lucide-react";

import { Button } from "@regarde/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@regarde/ui/ui/sheet";

import { useInspector } from "@/components/providers/inspectorProvider";
import { appRoutes } from "@/lib/navigation/appRoutes";

import { AddConnectionForm } from "./addConnectionForm";
import { getPrefillKey } from "./connectionFormTypes";
import { SchemaSwitcher } from "./schemaSwitcher";
import { useAddConnectionFlow } from "./useAddConnectionFlow";

export function AddConnectionPane(): React.ReactElement {
  const { prefill } = useInspector();
  const navigate = useNavigate();
  const prefillKey = getPrefillKey(prefill);

  const closePane = () => {
    void navigate({ to: appRoutes.connections });
  };

  return <AddConnectionPaneContent key={prefillKey} onClose={closePane} />;
}

interface AddConnectionPaneContentProps {
  onClose: () => void;
}

function AddConnectionPaneContent({ onClose }: AddConnectionPaneContentProps): React.ReactElement {
  const flow = useAddConnectionFlow();

  return (
    <Sheet
      open={true}
      onOpenChange={(open) => {
        if (open === false) {
          onClose();
        }
      }}
    >
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-[min(100vw,25rem)] max-w-none border-l border-border bg-background p-0 sm:max-w-none"
      >
        <SheetHeader className="flex h-11 shrink-0 flex-row items-center justify-between border-b border-border p-3">
          <div className="min-w-0 space-y-0.5">
            <SheetTitle className="rounded-xs px-1 py-1 text-sm leading-[1.4] font-normal text-foreground">
              Add connection
            </SheetTitle>
            <SheetDescription className="sr-only">Connect to a Jazz app and select a stored schema.</SheetDescription>
          </div>
          <Button type="button" variant="ghost" size="icon-sm" onClick={onClose} className="-mr-1 shrink-0">
            <XIcon />
            <span className="sr-only">Close</span>
          </Button>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col p-3 text-sm leading-[1.4] text-foreground">
          {flow.step === "form" ? (
            <AddConnectionForm
              canSubmit={flow.canSubmit}
              errorMessage={flow.errorMessage}
              formValues={flow.formValues}
              isSubmitting={flow.isSubmitting}
              onCancel={onClose}
              onSubmit={flow.fetchSchemas}
              onUpdateField={flow.updateField}
            />
          ) : (
            <SchemaSwitcher
              appId={flow.formValues.appId}
              errorMessage={flow.errorMessage}
              isSubmitting={flow.isSubmitting}
              onBack={flow.goBackToForm}
              onCancel={onClose}
              onSelectSchema={flow.selectSchema}
              schemaHashes={flow.schemaHashes}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
