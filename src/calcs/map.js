// src/calcs/map.js
import { num, round } from "../utils/math.js";

export default {
  id: "map",
  name: "MAP",
  category: "Critical Care",
  tags: ["bp", "map"],
  fields: [
    { key: "sbp", label: "SBP (mmHg)", type: "number", placeholder: "120" },
    { key: "dbp", label: "DBP (mmHg)", type: "number", placeholder: "70" },
  ],
  compute: (v) => {
    const sbp = num(v.sbp);
    const dbp = num(v.dbp);
    if (!Number.isFinite(sbp) || !Number.isFinite(dbp)) return { title: "MAP", lines: [], notes: [] };

    const map = (sbp + 2 * dbp) / 3;
    const MAP = round(map, 1);

    let sev = "ok";
    if (MAP < 60) sev = "critical";
    else if (MAP < 65) sev = "high";
    else if (MAP < 70) sev = "borderline";

    return {
      title: "MAP",
      lines: [{ label: "MAP", value: `${MAP} mmHg`, severity: sev }],
      notes: [],
    };
  },
  copyText: (_v, r) => `MAP ${r?.lines?.[0]?.value ?? ""}`,
};