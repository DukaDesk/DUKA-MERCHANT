import { useMemo } from "react";
import { useAuth } from "../contexts";

const rolePermissions = {
  super_admin: ["*"],
  platform_operator: ["product:*", "order:*", "customer:*", "team:*", "billing:*", "analytics:*", "settings:*"],
  support_agent: ["order:read", "order:update", "customer:read", "analytics:read"],
  tenant_owner: ["product:*", "order:*", "customer:*", "team:*", "billing:*", "analytics:*", "settings:*", "marketing:*", "integration:*"],
  business_manager: ["product:*", "order:*", "customer:*", "analytics:*", "billing:*", "marketing:*", "integration:*"],
  store_manager: ["product:read", "product:create", "product:update", "order:read", "order:update", "customer:read", "integration:read"],
  sales_staff: ["order:read", "order:update", "customer:read"],
  content_manager: ["product:read", "product:create", "product:update", "marketing:*"],
  customer: [],
  member: [],
};

const allResources = ["product", "order", "customer", "team", "billing", "analytics", "settings", "marketing", "integration"];

function matchPermission(perm, required) {
  if (perm === "*") return true;
  const [pRes, pAct] = perm.split(":");
  const [rRes, rAct] = required.split(":");
  if (pRes !== rRes && pRes !== "*") return false;
  if (pAct === "*" || rAct === "*") return true;
  return pAct === rAct;
}

export function usePermission() {
  const { merchant } = useAuth();
  return useMemo(() => {
    const role = merchant?.role || "member";
    const perms = rolePermissions[role] || [];

    return {
      role,
      can(required) {
        if (perms.includes("*")) return true;
        return perms.some(p => matchPermission(p, required));
      },
      canAny(resource) {
        if (perms.includes("*")) return true;
        return perms.some(p => {
          const [pRes] = p.split(":");
          return pRes === resource || pRes === "*";
        });
      },
    };
  }, [merchant?.role]);
}
