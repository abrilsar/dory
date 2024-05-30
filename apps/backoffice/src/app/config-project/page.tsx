import Steps from "@/components/steps/Steps";
import { EnvProvider } from "@/context/env-provider";

export default function ConfigProject() {
  return (<EnvProvider>
    <Steps />
  </EnvProvider>);
}
