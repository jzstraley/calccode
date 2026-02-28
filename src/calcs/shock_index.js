// src/calcs/shock_index.js
import { num, round } from "../utils/math.js";

export default {
  id: "shock_index",
  name: "Shock Index",
  category: "Critical Care",
  tags: ["shock", "hemodynamics"],
  fields: [
    { key: "hr", label: "Heart Rate (bpm)", type: "number", placeholder: "110" },
    { key: "sbp", label: "Systolic BP (mmHg)", type: "number", placeholder: "100" },
  ],

  compute: (v) => {
    const hr = num(v.hr);
    const sbp = num(v.sbp);

    if (!Number.isFinite(hr) || !Number.isFinite(sbp) || sbp <= 0) {
      return { title: "Shock Index", lines: [], notes: [] };
    }

    const si = round(hr / sbp, 2);

    let severity = "ok";
    if (si >= 1.0) severity = "critical";
    else if (si >= 0.9) severity = "high";
    else if (si >= 0.7) severity = "borderline";

    return {
      title: "Shock Index",
      lines: [
        { label: "Shock Index", value: `${si}`, severity },
      ],
      notes: [],
    };
  },

  copyText: (_values, result) => {
    const si = result?.lines?.[0]?.value ?? "";
    return `Shock Index ${si}`;
  },
};