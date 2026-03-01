// src/calcs/pvr.js
import { num, round } from "../utils/math.js";

export default {
  id: "pvr",
  name: "PVR",
  category: "Hemodynamics",
  tags: ["pvr", "pulmonary", "hemodynamics", "cath"],
  fields: [
    { key: "mpap", label: "mPAP (mmHg)", type: "number", placeholder: "25" },
    { key: "pcwp", label: "PCWP (mmHg)", type: "number", placeholder: "12" },
    { key: "co",   label: "CO (L/min)",  type: "number", placeholder: "4.5" },
  ],
  compute: (v) => {
    const mpap = num(v.mpap);
    const pcwp = num(v.pcwp);
    const co   = num(v.co);

    if (!Number.isFinite(mpap) || !Number.isFinite(pcwp) || !Number.isFinite(co) || co <= 0) {
      return { title: "PVR", lines: [], notes: [] };
    }

    const transpulmonary = mpap - pcwp;
    const pvr_wu = transpulmonary / co;                 // Wood Units
    const pvr_dyn = round(80 * pvr_wu, 0);             // dyn·s·cm⁻⁵
    const PVR_WU = round(pvr_wu, 1);

    // Severity thresholds (post-capillary PH: PVR > 3 WU = combined pre+post)
    let sev = "ok";
    if (PVR_WU >= 5)      sev = "critical";
    else if (PVR_WU >= 3) sev = "high";
    else if (PVR_WU >= 2) sev = "borderline";

    const tpg = round(transpulmonary, 0);
    let tpgSev = "ok";
    if (tpg > 12) tpgSev = "high";

    return {
      title: "PVR",
      lines: [
        { label: "PVR", value: `${PVR_WU} WU`, severity: sev },
        { label: "PVR", value: `${pvr_dyn} dyn·s·cm⁻⁵`, severity: sev },
        { label: "TPG", value: `${tpg} mmHg`, severity: tpgSev },
      ],
      notes: [
        "PVR = (mPAP − PCWP) / CO",
        "PVR ≥ 3 WU = elevated (combined pre+post-capillary PH per ESC 2022).",
        "TPG > 12 mmHg suggests pre-capillary component.",
      ],
    };
  },
  copyText: (_v, r) =>
    r?.lines?.filter((l, i) => i < 2).map(l => `${l.label} ${l.value}`).join(", ") ?? "",
};