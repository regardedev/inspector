import { Check, Copy } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useClipboard } from "@/hooks/use-clipboard";
import { cn } from "@/lib/utils";

interface CopyPopoverProps {
  className?: string;
  text: string;
  children: React.ReactNode;
}

export function CopyPopover({
  className,
  text,
  children,
}: CopyPopoverProps): React.ReactElement {
  const { copied, copy } = useClipboard();

  return (
    <Popover>
      <PopoverTrigger
        openOnHover={true}
        closeDelay={200}
        render={<div className={cn("block w-full cursor-pointer", className)}>{children}</div>}
      />
      <PopoverContent
        className="w-auto rounded-xs cursor-pointer p-2"
        onClick={() => {
          copy(text);
        }}
      >
        <div className="flex items-center gap-2">
          <span className="max-w-xs break-all font-mono text-xs">{text}</span>
          {copied === true ? (
            <Check className="size-3 shrink-0 text-primary" />
          ) : (
            <Copy className="size-3 shrink-0 text-muted-foreground" />
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
