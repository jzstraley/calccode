// src/calcs/svr.js
import { num, round } from "../utils/math.js";

export default {
  id: "svr",
  name: "SVR",
  category: "Hemodynamics",
  tags: ["svr"],
  fields: [
    { key: "map", label: "MAP (mmHg)", type: "number", placeholder: "75" },
    { key: "rap", label: "RAP/CVP (mmHg)", type: "number", placeholder: "8" },
    { key: "co", label: "CO (L/min)", type: "number", placeholder: "4.5" },
  ],
  compute: (v) => {
    const map = num(v.map);
    const rap = num(v.rap);
    const co = num(v.co);
    if (!Number.isFinite(map) || !Number.isFinite(rap) || !Number.isFinite(co) || co <= 0) return { title: "SVR", lines: [], notes: [] };

    const svr = 80 * (map - rap) / co;
    const SVR = round(svr, 0);

    let sev = "ok";
    if (SVR < 700) sev = "high";
    else if (SVR > 1600) sev = "high";
    else if (SVR < 800 || SVR > 1400) sev = "borderline";

    return {
      title: "SVR",
      lines: [{ label: "SVR", value: `${SVR} dyn·s·cm⁻⁵`, severity: sev }],
      notes: [],
    };
  },
  copyText: (_v, r) => `SVR ${r?.lines?.[0]?.value ?? ""}`,
};