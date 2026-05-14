import * as React from "react"

import { Switch as ShadSwitch } from "@/components/ui/switch"

export type SwitchProps = React.ComponentProps<typeof ShadSwitch>

function Switch({ ...props }: SwitchProps) {
  return <ShadSwitch {...props} />
}

Switch.displayName = "Switch"

Switch.displayName = "Switch"

export { Switch }
export default Switch
