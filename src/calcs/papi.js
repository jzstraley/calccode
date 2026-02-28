// src/calcs/papi.js
import { num, round } from "../utils/math.js";

export default {
  id: "papi",
  name: "PAPI",
  category: "Hemodynamics",
  tags: ["rv", "shock", "papi"],
  fields: [
    { key: "pasp", label: "PASP (mmHg)", type: "number", placeholder: "45" },
    { key: "padp", label: "PADP (mmHg)", type: "number", placeholder: "20" },
    { key: "rap", label: "RAP (mmHg)", type: "number", placeholder: "10" },
  ],
  compute: (v) => {
    const pasp = num(v.pasp);
    const padp = num(v.padp);
    const rap = num(v.rap);
    if (!Number.isFinite(pasp) || !Number.isFinite(padp) || !Number.isFinite(rap) || rap <= 0) return { title: "PAPI", lines: [], notes: [] };

    const papi = (pasp - padp) / rap;
    const PAPI = round(papi, 2);

    let sev = "ok";
    if (PAPI < 0.9) sev = "critical";
    else if (PAPI < 1.5) sev = "high";
    else if (PAPI < 2.0) sev = "borderline";

    return {
      title: "PAPI",
      lines: [{ label: "PAPI", value: `${PAPI}`, severity: sev }],
      notes: [],
    };
  },
  copyText: (_v, r) => `PAPI ${r?.lines?.[0]?.value ?? ""}`,
};