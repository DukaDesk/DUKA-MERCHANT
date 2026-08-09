const FLAG_BY_MODULE = {
  products: ["commerce", "booking"],
  orders: ["commerce", "booking"],
  customers: ["commerce", "booking"],
  inventory: ["commerce"],
  analytics: ["analytics"],
  marketing: ["analytics", "notifications"],
  messages: ["notifications"],
  integrations: ["integrations"],
  billing: [],
  team: [],
  settings: [],
  giving: ["commerce"],
  donation: ["commerce"],
  attendance: [],
  fees: ["commerce"],
  appointments: ["booking"],
  reservations: ["booking", "commerce"],
  memberships: [],
  tickets: ["commerce"],
  classes: [],
};

function hasAnyFlag(flags, names) {
  if (!flags || typeof flags !== "object") return true;
  if (Object.keys(flags).length === 0) return true;
  return names.length === 0 || names.some(n => flags[n] === true);
}

export function applyFlagGate(vertical, flags) {
  if (!vertical) return vertical;
  const excluded = vertical.excludedModules || [];
  const modules = (vertical.modules || []).filter(m => {
    if (excluded.includes(m.id)) return false;
    return hasAnyFlag(flags, FLAG_BY_MODULE[m.id]);
  });
  return { ...vertical, modules };
}