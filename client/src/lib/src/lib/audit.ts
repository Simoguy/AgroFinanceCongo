import { addSecurityLog } from "@/lib/securityLogs";
import { getDeviceInfo } from "@/lib/deviceInfo";

export function audit(
  user: string,
  type: "ACCES" | "ACTION" | "ADMIN",
  action: string
) {
  const device = getDeviceInfo();

  addSecurityLog({
    date: new Date().toLocaleString(),
    user,
    type,
    action,
    device: device.device,
    browser: device.browser,
    os: device.os,
  });
}
