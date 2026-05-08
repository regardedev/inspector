import { useMemo, useState } from "react";

import { useNavigate } from "@tanstack/react-router";
import { fetchSchemaHashes } from "jazz-tools";

import { Button } from "@regarde/ui/button";
import { Input } from "@regarde/ui/input";
import { Label } from "@regarde/ui/label";
import { SidePanel } from "@regarde/ui/sidePanel";

import { useInspector } from "@/components/providers/inspectorProvider";
import { findConnectionByCredentials } from "@/lib/config/connectionIdentity";
import { DEFAULT_BRANCH_NAME, DEFAULT_SERVER_URL, type ConnectionDraft } from "@/lib/config/connections";
import { appRoutes } from "@/lib/navigation/appRoutes";

interface NewConnectionFormValues extends ConnectionDraft {
  branch: string;
}

type NewConnectionStep = "form" | "schema";

function createInitialFormValues(
  prefill: ReturnType<typeof useInspector>["prefill"],
): NewConnectionFormValues {
  return {
    name: prefill?.name ?? "",
    serverUrl: prefill?.serverUrl ?? DEFAULT_SERVER_URL,
    appId: prefill?.appId ?? "",
    adminSecret: prefill?.adminSecret ?? "",
    env: prefill?.env ?? "dev",
    branch: prefill?.branch ?? DEFAULT_BRANCH_NAME,
  };
}

function getPrefillKey(prefill: ReturnType<typeof useInspector>["prefill"]): string {
  if (prefill === null) {
    return "empty";
  }

  return JSON.stringify([
    prefill.name,
    prefill.serverUrl,
    prefill.appId,
    prefill.adminSecret,
    prefill.env,
    prefill.branch,
  ]);
}

export function NewConnectionSheet(): React.ReactElement {
  const { prefill } = useInspector();
  const navigate = useNavigate();
  const prefillKey = getPrefillKey(prefill);

  return (
    <SidePanel.Provider
      open={true}
      onOpenChange={(open) => {
        if (open === false) {
          void navigate({ to: appRoutes.connections });
        }
      }}
    >
      <NewConnectionPanelContent key={prefillKey} prefill={prefill} />
    </SidePanel.Provider>
  );
}

interface NewConnectionPanelContentProps {
  prefill: ReturnType<typeof useInspector>["prefill"];
}

function NewConnectionPanelContent({ prefill }: NewConnectionPanelContentProps): React.ReactElement {
  const sidePanel = SidePanel.useSidePanel();
  const { connections, saveConnection, setActiveConnection } = useInspector();
  const navigate = useNavigate();
  const [step, setStep] = useState<NewConnectionStep>("form");
  const [formValues, setFormValues] = useState<NewConnectionFormValues>(() => createInitialFormValues(prefill));
  const [schemaHashes, setSchemaHashes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return (
      formValues.serverUrl.trim().length > 0 &&
      formValues.appId.trim().length > 0 &&
      formValues.adminSecret.trim().length > 0
    );
  }, [formValues.adminSecret, formValues.appId, formValues.serverUrl]);

  const updateField = (field: keyof NewConnectionFormValues, value: string) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  };

  const openResolvedConnection = async (schemaHash: string) => {
    const trimmedBranch = formValues.branch.trim();
    const branch = trimmedBranch.length > 0 ? trimmedBranch : DEFAULT_BRANCH_NAME;
    const existingConnection = findConnectionByCredentials(connections, formValues);
    const connection =
      existingConnection ??
      saveConnection({
        name: formValues.name,
        serverUrl: formValues.serverUrl,
        appId: formValues.appId,
        adminSecret: formValues.adminSecret,
        env: formValues.env,
      });

    if (existingConnection !== null) {
      setActiveConnection(connection.id);
    }

    await navigate({
      to: appRoutes.tables,
      params: {
        connectionId: connection.id,
        branch,
        schemaHash,
      },
    });
  };

  const handleFetchSchemas = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (canSubmit === false || isSubmitting === true) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetchSchemaHashes(formValues.serverUrl.trim(), {
        appId: formValues.appId.trim(),
        adminSecret: formValues.adminSecret.trim(),
      });

      if (response.hashes.length === 0) {
        setErrorMessage("No stored schemas were found for this server.");
        setSchemaHashes([]);
        setStep("form");
        return;
      }

      if (response.hashes.length === 1) {
        await openResolvedConnection(response.hashes[0]);
        return;
      }

      setSchemaHashes(response.hashes);
      setStep("schema");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSchemaSelect = async (schemaHash: string) => {
    if (isSubmitting === true) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await openResolvedConnection(schemaHash);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
      setIsSubmitting(false);
    }
  };

  return (
    <SidePanel>
      <div className="flex h-full flex-col overflow-hidden border-l border-border">
        <SidePanel.Header className="h-11 justify-between border-b border-border px-3 py-2">
          <SidePanel.Title className="rounded-xs px-1 py-1 text-sm leading-[1.4] font-normal text-foreground">
            Add New Connection
          </SidePanel.Title>
          <SidePanel.CloseButton />
        </SidePanel.Header>
        <SidePanel.Content className="mt-0 flex flex-1 flex-col p-4 text-sm leading-[1.4] text-foreground">
          {step === "form" ? (
            <form className="flex flex-1 flex-col gap-4" onSubmit={handleFetchSchemas}>
              <div className="grid gap-4">
                <FormField label="Connection name" htmlFor="connection-name">
                  <Input
                    id="connection-name"
                    value={formValues.name}
                    onChange={(event) => {
                      updateField("name", event.currentTarget.value);
                    }}
                    placeholder="My Jazz app"
                  />
                </FormField>
                <FormField label="Server URL" htmlFor="connection-server-url">
                  <Input
                    id="connection-server-url"
                    value={formValues.serverUrl}
                    onChange={(event) => {
                      updateField("serverUrl", event.currentTarget.value);
                    }}
                    placeholder="https://v2.sync.jazz.tools/"
                    required
                  />
                </FormField>
                <FormField label="App ID" htmlFor="connection-app-id">
                  <Input
                    id="connection-app-id"
                    value={formValues.appId}
                    onChange={(event) => {
                      updateField("appId", event.currentTarget.value);
                    }}
                    required
                  />
                </FormField>
                <FormField label="Admin secret" htmlFor="connection-admin-secret">
                  <Input
                    id="connection-admin-secret"
                    type="password"
                    value={formValues.adminSecret}
                    onChange={(event) => {
                      updateField("adminSecret", event.currentTarget.value);
                    }}
                    required
                  />
                </FormField>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Env" htmlFor="connection-env">
                    <Input
                      id="connection-env"
                      value={formValues.env}
                      onChange={(event) => {
                        updateField("env", event.currentTarget.value);
                      }}
                    />
                  </FormField>
                  <FormField label="Branch" htmlFor="connection-branch">
                    <Input
                      id="connection-branch"
                      value={formValues.branch}
                      onChange={(event) => {
                        updateField("branch", event.currentTarget.value);
                      }}
                    />
                  </FormField>
                </div>
              </div>
              <ErrorNotice message={errorMessage} />
              <div className="mt-auto flex items-center justify-end gap-2 border-t border-border pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    sidePanel.onOpenChange(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={canSubmit === false} loading={isSubmitting}>
                  Fetch schemas
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex flex-1 flex-col gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-foreground">Select schema</h3>
                 <p className="text-sm text-muted-foreground">
                  Choose the stored schema to open for {formValues.appId.trim().length > 0 ? formValues.appId.trim() : "this connection"}.
                 </p>
              </div>
              <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
                {schemaHashes.map((schemaHash) => (
                  <Button
                    key={schemaHash}
                    type="button"
                    variant="ghost"
                    className="h-auto justify-start rounded-sm border border-border px-3 py-2 text-left"
                    onClick={() => {
                      void handleSchemaSelect(schemaHash);
                    }}
                    disabled={isSubmitting}
                  >
                    <span className="truncate text-sm">{schemaHash}</span>
                  </Button>
                ))}
              </div>
              <ErrorNotice message={errorMessage} />
              <div className="flex items-center justify-between border-t border-border pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setErrorMessage(null);
                    setStep("form");
                  }}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    sidePanel.onOpenChange(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </SidePanel.Content>
      </div>
    </SidePanel>
  );
}

interface FormFieldProps {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}

interface ErrorNoticeProps {
  message: string | null;
}

function ErrorNotice({ message }: ErrorNoticeProps): React.ReactElement | null {
  if (message === null) {
    return null;
  }

  return (
    <div className="rounded-sm border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
      {message}
    </div>
  );
}

function FormField({ label, htmlFor, children }: FormFieldProps): React.ReactElement {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
