// src/calcs/bmi.js
import { num, round } from "../utils/math.js";

export default {
  id: "bmi",
  name: "BMI",
  category: "General",
  tags: ["bmi"],
  fields: [
    {
      key: "units",
      label: "Units",
      type: "select",
      options: [
        { value: "metric", label: "Metric (kg, cm)" },
        { value: "us", label: "US (lb, in)" },
      ],
      defaultValue: "metric",
    },
    { key: "weight", label: "Weight", type: "number", placeholder: "80" },
    { key: "height", label: "Height", type: "number", placeholder: "180" },
  ],
  compute: (v) => {
    const units = v.units || "metric";
    const wt = num(v.weight);
    const ht = num(v.height);
    if (!Number.isFinite(wt) || !Number.isFinite(ht) || wt <= 0 || ht <= 0) return { title: "BMI", lines: [], notes: [] };

    let bmi = NaN;
    if (units === "metric") {
      const m = ht / 100;
      bmi = wt / (m * m);
    } else {
      bmi = (wt / (ht * ht)) * 703;
    }

    const BMI = round(bmi, 1);

    // Optional severity bands for visual cue only
    let sev = "ok";
    if (BMI >= 40) sev = "critical";
    else if (BMI >= 30) sev = "high";
    else if (BMI >= 25) sev = "borderline";

    return {
      title: "BMI",
      lines: [{ label: "BMI", value: `${BMI}`, severity: sev }],
      notes: [],
    };
  },
  copyText: (_v, r) => `BMI ${r?.lines?.[0]?.value ?? ""}`,
};