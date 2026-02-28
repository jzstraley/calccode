import { num, round } from "../utils/math.js";

export default {
  id: "cardiac_output",
  name: "Cardiac Output",
  category: "Hemodynamics",
  tags: ["co", "ci", "cpo", "svr"],

  fields: [
    { key: "method", label: "Method", type: "select", options: [
      { value: "fick", label: "Fick CO" },
      { value: "thermo", label: "Thermodilution CO" },
    ], defaultValue: "fick" },

    { key: "co", label: "Cardiac Output (L/min)", type: "number", placeholder: "3.5" },

    { key: "bsa", label: "BSA (m²) [optional]", type: "number", placeholder: "1.9" },

    { key: "map", label: "MAP (mmHg) [optional]", type: "number", placeholder: "65" },
    { key: "rap", label: "RAP/CVP (mmHg) [optional]", type: "number", placeholder: "8" },
  ],

  compute: (v) => {
    const co = num(v.co);
    const bsa = num(v.bsa);
    const map = num(v.map);
    const rap = num(v.rap);

    if (!Number.isFinite(co) || co <= 0) {
      return { title: "Cardiac Output", lines: [], notes: [] };
    }

    const CO = round(co, 2);

    // CO severity
    let coSev = "ok";
    if (CO < 2.5) coSev = "critical";
    else if (CO < 3.0) coSev = "high";
    else if (CO < 4.0) coSev = "borderline";

    const lines = [
      { label: "CO", value: `${CO} L/min`, severity: coSev },
    ];

    // CI (derived)
    if (Number.isFinite(bsa) && bsa > 0.5) {
      const ci = round(co / bsa, 2);

      let ciSev = "ok";
      if (ci < 2.0) ciSev = "critical";
      else if (ci < 2.2) ciSev = "high";
      else if (ci < 2.5) ciSev = "borderline";

      lines.push({
        label: "CI",
        value: `${ci} L/min/m²`,
        severity: ciSev,
      });
    }

    // CPO (derived)
    if (Number.isFinite(map)) {
      const cpo = round((map * co) / 451, 2);

      let cpoSev = "ok";
      if (cpo < 0.6) cpoSev = "critical";
      else if (cpo < 0.8) cpoSev = "high";
      else if (cpo < 1.0) cpoSev = "borderline";

      lines.push({
        label: "CPO",
        value: `${cpo} W`,
        severity: cpoSev,
      });
    }

    // SVR (derived)
    if (Number.isFinite(map) && Number.isFinite(rap)) {
      const svr = round(80 * (map - rap) / co, 0);

      let svrSev = "ok";
      if (svr < 700 || svr > 1600) svrSev = "high";
      else if (svr < 800 || svr > 1400) svrSev = "borderline";

      lines.push({
        label: "SVR",
        value: `${svr} dyn·s·cm⁻⁵`,
        severity: svrSev,
      });
    }

    return {
      title: "Cardiac Output",
      lines,
      notes: [],
    };
  },

  copyText: (_v, r) =>
    r?.lines?.map(l => `${l.label} ${l.value}`).join(". ") ?? "",
};