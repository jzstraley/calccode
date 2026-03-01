// src/calcs/stroke_volume.js
import { num, round } from "../utils/math.js";

export default {
  id: "stroke_volume",
  name: "Stroke Volume & SVI",
  category: "Hemodynamics",
  tags: ["sv", "svi", "stroke volume", "hemodynamics"],
  fields: [
    { key: "co",  label: "CO (L/min)", type: "number", placeholder: "4.5" },
    { key: "hr",  label: "Heart Rate (bpm)", type: "number", placeholder: "75" },
    { key: "bsa", label: "BSA (m²) [optional]", type: "number", placeholder: "1.9" },
  ],
  compute: (v) => {
    const co  = num(v.co);
    const hr  = num(v.hr);
    const bsa = num(v.bsa);

    if (!Number.isFinite(co) || !Number.isFinite(hr) || co <= 0 || hr <= 0) {
      return { title: "Stroke Volume", lines: [], notes: [] };
    }

    const sv = (co / hr) * 1000;   // mL/beat
    const SV = round(sv, 0);

    let svSev = "ok";
    if (SV < 40)       svSev = "critical";
    else if (SV < 55)  svSev = "high";
    else if (SV < 60)  svSev = "borderline";

    const lines = [
      { label: "SV", value: `${SV} mL/beat`, severity: svSev },
    ];

    if (Number.isFinite(bsa) && bsa > 0.5) {
      const svi = sv / bsa;
      const SVI = round(svi, 0);

      let sviSev = "ok";
      if (SVI < 25)      sviSev = "critical";
      else if (SVI < 33) sviSev = "high";
      else if (SVI < 35) sviSev = "borderline";

      lines.push({ label: "SVI", value: `${SVI} mL/beat/m²`, severity: sviSev });
    }

    return {
      title: "Stroke Volume",
      lines,
      notes: [
        "SV = (CO / HR) × 1000",
        "Normal SV: 60–100 mL/beat. Normal SVI: 33–47 mL/beat/m².",
      ],
    };
  },
  copyText: (_v, r) =>
    r?.lines?.map(l => `${l.label} ${l.value}`).join(", ") ?? "",
};
