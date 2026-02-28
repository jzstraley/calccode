// /calcs/fick_co.js
import { num, round, clampNum } from "../utils/math.js";

export default {
  id: "fick_co",
  name: "Cardiac Output (Fick)",
  category: "Cardiology",
  tags: ["cath", "hemodynamics", "fick", "co", "ci", "svr"],
  fields: [
    { key: "vo2", label: "VO₂ (mL/min)", type: "number", placeholder: "250" },
    { key: "hb", label: "Hemoglobin (g/dL)", type: "number", placeholder: "12" },
    { key: "sao2", label: "SaO₂ (%)", type: "number", placeholder: "98" },
    { key: "svo2", label: "SvO₂ (%)", type: "number", placeholder: "65" },
    { key: "bsa", label: "BSA (m²) [optional]", type: "number", placeholder: "1.9" },
  ],
  compute: (v) => {
    const vo2 = num(v.vo2);
    const hb = num(v.hb);
    const sao2 = num(v.sao2);
    const svo2 = num(v.svo2);
    const bsa = num(v.bsa);

    if (!Number.isFinite(vo2) || !Number.isFinite(hb) || !Number.isFinite(sao2) || !Number.isFinite(svo2)) {
      return { title: "Fick CO", lines: [], notes: ["Enter VO₂, Hb, SaO₂, SvO₂."] };
    }

    const Hb = clampNum(hb, 3, 25);
    const Sa = clampNum(sao2, 0, 100) / 100;
    const Sv = clampNum(svo2, 0, 100) / 100;

    const Ca = 1.34 * Hb * Sa; // simplified, no dissolved term
    const Cv = 1.34 * Hb * Sv;
    const deltaC = Ca - Cv;

    if (!Number.isFinite(deltaC) || deltaC <= 0) {
      return {
        title: "Fick CO",
        lines: [{ label: "Error", value: "CaO₂−CvO₂ must be > 0.", severity: "critical" }],
        notes: ["Check SaO₂/SvO₂ and Hb."],
      };
    }

    const co = vo2 / (deltaC * 10);
    const CO = round(co, 2);

    let ci = null;
    if (Number.isFinite(bsa) && bsa > 0.5) ci = co / bsa;

    let coSev = "ok";
    if (co < 2.5) coSev = "critical";
    else if (co < 3.0) coSev = "high";
    else if (co < 4.0) coSev = "borderline";

    let ciSev = "ok";
    if (ci !== null) {
      if (ci < 2.0) ciSev = "critical";
      else if (ci < 2.2) ciSev = "high";
      else if (ci < 2.5) ciSev = "borderline";
    }

    const interp =
      coSev === "critical" || ciSev === "critical"
        ? "Low output state."
        : coSev === "high" || ciSev === "high"
        ? "Borderline low output."
        : "Normal output.";

    const sev =
      coSev === "critical" || ciSev === "critical"
        ? "critical"
        : coSev === "high" || ciSev === "high"
        ? "high"
        : coSev === "borderline" || ciSev === "borderline"
        ? "borderline"
        : "ok";

    const lines = [
      { label: "Interpretation", value: interp, severity: sev },
      { label: "CO", value: `${CO} L/min`, severity: coSev },
      ...(ci !== null ? [{ label: "CI", value: `${round(ci, 2)} L/min/m²`, severity: ciSev }] : []),
      { label: "CaO₂", value: `${round(Ca, 1)} mL/dL`, severity: "ok" },
      { label: "CvO₂", value: `${round(Cv, 1)} mL/dL`, severity: "ok" },
      { label: "Δ(O₂ content)", value: `${round(deltaC, 1)} mL/dL`, severity: deltaC < 3 ? "high" : "ok" },
    ];

    return {
      title: "Fick CO",
      lines,
      notes: [
        "Simplified O₂ content: 1.34×Hb×Sat (no dissolved O₂ term).",
        "CO = VO₂ / ((CaO₂−CvO₂)×10).",
      ],
    };
  },
  copyText: (_values, result) => {
    const co = result?.lines?.find((l) => l.label === "CO")?.value ?? "";
    const ci = result?.lines?.find((l) => l.label === "CI")?.value ?? "";
    const interp = result?.lines?.find((l) => l.label === "Interpretation")?.value ?? "";
    return `Fick CO ${co}${ci ? `, CI ${ci}` : ""}. ${interp}`;
  },
};