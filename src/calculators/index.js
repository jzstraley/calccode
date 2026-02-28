// src/calculators/index.js
import { clampNum, num, round } from "../utils/math.js";

/**
 * Output line shape supports:
 * { label, value, severity?: "ok"|"borderline"|"high"|"critical" }
 */

export const CALCS = [
  {
    id: "map",
    name: "Mean Arterial Pressure (MAP)",
    category: "Critical Care",
    tags: ["bp", "hemodynamics"],
    fields: [
      { key: "sbp", label: "SBP (mmHg)", type: "number", placeholder: "120" },
      { key: "dbp", label: "DBP (mmHg)", type: "number", placeholder: "70" },
    ],
    compute: (v) => {
      const sbp = num(v.sbp);
      const dbp = num(v.dbp);
      const map = (sbp + 2 * dbp) / 3;
      const m = round(map, 1);

      let sev = "ok";
      if (Number.isFinite(m) && m < 65) sev = "critical";
      else if (Number.isFinite(m) && m < 70) sev = "high";

      return {
        title: "MAP Result",
        lines: [{ label: "MAP", value: `${m} mmHg`, severity: sev }],
        notes: ["Formula: (SBP + 2×DBP) / 3", "Common target ≥65 mmHg in shock states."],
      };
    },
    copyText: (values, result) => {
      const hero = result?.lines?.[0]?.value ?? "";
      const sev = result?.lines?.[0]?.severity;
      const interp =
        sev === "critical" ? "Critically low." : sev === "high" ? "Low." : "OK.";
      return `MAP ${hero}. ${interp}`;
    },
  },

  {
    id: "crcl_cg",
    name: "Creatinine Clearance (Cockcroft-Gault)",
    category: "General",
    tags: ["renal", "dosing", "crcl"],
    fields: [
      { key: "age", label: "Age (years)", type: "number", placeholder: "65" },
      { key: "weight", label: "Weight (kg)", type: "number", placeholder: "80" },
      { key: "scr", label: "Serum creatinine (mg/dL)", type: "number", placeholder: "1.2" },
      {
        key: "sex",
        label: "Sex at birth",
        type: "select",
        options: [
          { value: "m", label: "Male" },
          { value: "f", label: "Female" },
        ],
        defaultValue: "m",
      },
    ],
    compute: (v) => {
      const age = clampNum(num(v.age), 0, 120);
      const wt = clampNum(num(v.weight), 0, 300);
      const scr = clampNum(num(v.scr), 0.1, 20);
      const sex = v.sex || "m";

      let crcl = ((140 - age) * wt) / (72 * scr);
      if (sex === "f") crcl *= 0.85;

      const cc = round(crcl, 1);

      let sev = "ok";
      if (Number.isFinite(cc) && cc < 15) sev = "critical";
      else if (Number.isFinite(cc) && cc < 30) sev = "high";
      else if (Number.isFinite(cc) && cc < 60) sev = "borderline";

      let band = "≥60";
      if (cc < 15) band = "<15";
      else if (cc < 30) band = "15–29";
      else if (cc < 60) band = "30–59";

      return {
        title: "CrCl Result",
        lines: [
          { label: "CrCl", value: `${cc} mL/min`, severity: sev },
          { label: "Band", value: band, severity: sev },
        ],
        notes: ["Use caution in unstable creatinine and extremes of body size."],
      };
    },
    copyText: (values, result) => {
      const crcl = result?.lines?.find((l) => l.label === "CrCl")?.value ?? "";
      const band = result?.lines?.find((l) => l.label === "Band")?.value ?? "";
      return `CrCl (Cockcroft-Gault) ${crcl} (band ${band}).`;
    },
  },

  {
    id: "cha2ds2vasc",
    name: "CHA₂DS₂-VASc (Atrial Fibrillation)",
    category: "Cardiology",
    tags: ["afib", "stroke", "anticoag"],
    fields: [
      { key: "chf", label: "CHF/LV dysfunction", type: "boolean" },
      { key: "htn", label: "Hypertension", type: "boolean" },
      { key: "age75", label: "Age ≥75", type: "boolean" },
      { key: "dm", label: "Diabetes", type: "boolean" },
      { key: "stroke", label: "Stroke/TIA/TE", type: "boolean" },
      { key: "vasc", label: "Vascular disease", type: "boolean" },
      { key: "age6574", label: "Age 65–74", type: "boolean" },
      { key: "female", label: "Female sex", type: "boolean" },
    ],
    compute: (v) => {
      let score = 0;
      if (v.chf) score += 1;
      if (v.htn) score += 1;
      if (v.dm) score += 1;
      if (v.vasc) score += 1;
      if (v.female) score += 1;

      if (v.age75) score += 2;
      else if (v.age6574) score += 1;

      if (v.stroke) score += 2;

      // MVP thresholds for highlighting (you can refine later by sex/AF context)
      let sev = "ok";
      if (score >= 4) sev = "critical";
      else if (score >= 2) sev = "high";
      else if (score === 1) sev = "borderline";

      let bucket = "Low";
      if (score === 0) bucket = "Very low";
      else if (score === 1) bucket = "Low to intermediate";
      else bucket = "Elevated";

      // MVP action language
      let action = "No anticoagulation typically needed.";
      if (score >= 2) action = "Anticoagulation generally recommended if no contraindication.";
      else if (score === 1) action = "Consider anticoagulation depending on context and bleeding risk.";

      return {
        title: "CHA₂DS₂-VASc Result",
        lines: [
          { label: "Score", value: `${score}`, severity: sev },
          { label: "Risk bucket", value: bucket, severity: sev },
          { label: "Suggested action", value: action, severity: sev },
        ],
        notes: ["MVP guidance. Customize thresholds and language to your practice patterns."],
      };
    },
    copyText: (values, result) => {
      const score = result?.lines?.find((l) => l.label === "Score")?.value ?? "";
      const bucket = result?.lines?.find((l) => l.label === "Risk bucket")?.value ?? "";
      const action = result?.lines?.find((l) => l.label === "Suggested action")?.value ?? "";
      return `CHA₂DS₂-VASc ${score}. ${bucket}. ${action}`;
    },
  },
];