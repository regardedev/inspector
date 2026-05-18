import { Check, Copy } from "lucide-react";

import { Button, type ButtonProps } from "@/components/atoms/button";
import { useClipboard } from "@/hooks/use-clipboard";

interface CopyButtonProps {
  className?: string;
  size?: ButtonProps["size"];
  text: string;
  variant?: ButtonProps["variant"];
}

export function CopyButton({
  className,
  size = "icon-sm",
  text,
  variant = "ghost",
}: CopyButtonProps): React.ReactElement {
  const { copied, copy } = useClipboard();

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      className={className}
      onClick={() => copy(text)}
      aria-label={copied === true ? "Copied" : "Copy"}
      title={copied === true ? "Copied" : "Copy"}
    >
      {copied === true ? <Check className="size-4" /> : <Copy className="size-4" />}
    </Button>
  );
}
