import {
  DataGridScrollArea as ReuiDataGridScrollArea,
  type DataGridScrollAreaOrientation,
  type DataGridScrollAreaProps,
} from "@/components/reui/data-grid/data-grid-scroll-area";
import { cn } from "@/lib/utils";

export type { DataGridScrollAreaOrientation, DataGridScrollAreaProps };

export function DataGridScrollArea({
  children,
  className,
  ...props
}: DataGridScrollAreaProps): React.ReactElement {
  return (
    <div
      className={cn(
        "h-full min-h-0 w-full overflow-hidden [&>*]:h-full [&>*]:min-h-0 [&>*]:w-full [&>*]:overflow-hidden",
        className,
      )}
    >
      <ReuiDataGridScrollArea className="h-full min-h-0 w-full overflow-hidden" {...props}>
        {children}
      </ReuiDataGridScrollArea>
    </div>
  );
}
