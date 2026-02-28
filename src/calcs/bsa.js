// src/calcs/bsa.js
import { num, round } from "../utils/math.js";

export default {
  id: "bsa",
  name: "BSA (Mosteller)",
  category: "General",
  tags: ["bsa"],
  fields: [
    { key: "height_cm", label: "Height (cm)", type: "number", placeholder: "180" },
    { key: "weight_kg", label: "Weight (kg)", type: "number", placeholder: "80" },
  ],
  compute: (v) => {
    const h = num(v.height_cm);
    const w = num(v.weight_kg);
    if (!Number.isFinite(h) || !Number.isFinite(w) || h <= 0 || w <= 0) return { title: "BSA", lines: [], notes: [] };

    const bsa = Math.sqrt((h * w) / 3600);
    const BSA = round(bsa, 2);

    return {
      title: "BSA",
      lines: [{ label: "BSA", value: `${BSA} m²`, severity: "ok" }],
      notes: [],
    };
  },
  copyText: (_v, r) => `BSA ${r?.lines?.[0]?.value ?? ""}`,
};