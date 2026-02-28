// src/calcs/cpo_td.js
import { num, round } from "../utils/math.js";

export default {
  id: "cpo_td",
  name: "CPO (Thermodilution)",
  category: "Hemodynamics",
  tags: ["cpo", "thermodilution"],
  fields: [
    { key: "map", label: "MAP (mmHg)", type: "number", placeholder: "65" },
    { key: "co", label: "CO (L/min) [Thermo]", type: "number", placeholder: "3.5" },
  ],
  compute: (v) => {
    const map = num(v.map);
    const co = num(v.co);
    if (!Number.isFinite(map) || !Number.isFinite(co) || co <= 0) return { title: "CPO", lines: [], notes: [] };

    const cpo = (map * co) / 451;
    const CPO = round(cpo, 2);

    let sev = "ok";
    if (CPO < 0.6) sev = "critical";
    else if (CPO < 0.8) sev = "high";
    else if (CPO < 1.0) sev = "borderline";

    return {
      title: "CPO",
      lines: [{ label: "CPO", value: `${CPO} W`, severity: sev }],
      notes: [],
    };
  },
  copyText: (_v, r) => `CPO (TD) ${r?.lines?.[0]?.value ?? ""}`,
};