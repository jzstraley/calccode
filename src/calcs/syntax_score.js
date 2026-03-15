// src/calcs/syntax_score.js
// SYNTAX Score for Coronary Artery Lesion Complexity
// Reference: Sianos et al., EuroIntervention 2005

export default {
  id: "syntax_score",
  name: "SYNTAX Score",
  category: "Coronary",
  tags: ["syntax", "lesion", "complexity", "cad", "pci", "cabg"],

  fields: [
    // Location
    {
      key: "location",
      label: "Lesion Location",
      type: "select",
      options: [
        { value: "proximal_lad", label: "Proximal LAD" },
        { value: "mid_lad", label: "Mid LAD" },
        { value: "distal_lad", label: "Distal LAD" },
        { value: "proximal_lcx", label: "Proximal LCx" },
        { value: "mid_lcx", label: "Mid LCx" },
        { value: "distal_lcx", label: "Distal LCx" },
        { value: "proximal_rca", label: "Proximal RCA" },
        { value: "mid_rca", label: "Mid RCA" },
        { value: "distal_rca", label: "Distal RCA" },
        { value: "lmca", label: "Left Main (LMCA)" },
      ],
      defaultValue: "proximal_lad",
    },

    // Lesion characteristics - points
    {
      key: "aortic_ostial",
      label: "Aortic Ostial Location",
      type: "boolean",
    },
    {
      key: "length",
      label: "Lesion Length ≥20mm",
      type: "boolean",
    },
    {
      key: "calcification",
      label: "Calcification (moderate/severe)",
      type: "boolean",
    },
    {
      key: "tortuosity",
      label: "Tortuosity (moderate/severe)",
      type: "boolean",
    },
    {
      key: "bifurcation",
      label: "Bifurcation/Trifurcation",
      type: "boolean",
    },
    {
      key: "angulation",
      label: "Angulation >90°",
      type: "boolean",
    },
    {
      key: "thrombus",
      label: "Thrombus",
      type: "boolean",
    },
    {
      key: "intimal_flap",
      label: "Intimal Flap/Dissection",
      type: "boolean",
    },
    {
      key: "stump",
      label: "Blunt Stump",
      type: "boolean",
    },
    {
      key: "small_vessel",
      label: "Diseased Vessel <2.5mm",
      type: "boolean",
    },

    // Stenosis severity
    {
      key: "stenosis",
      label: "Stenosis Severity",
      type: "select",
      options: [
        { value: "50", label: "50–75%" },
        { value: "75", label: "75–99%" },
        { value: "100", label: "100% (Total)" },
      ],
      defaultValue: "75",
    },

    // Multiple lesions
    {
      key: "num_lesions",
      label: "Number of Lesions Evaluated",
      type: "select",
      options: [
        { value: "1", label: "Single lesion" },
        { value: "2", label: "2 lesions" },
        { value: "3", label: "3 lesions" },
      ],
      defaultValue: "1",
    },
  ],

  compute: (v) => {
    // Base score from lesion location
    let baseScore = 0;
    const location = v.location || "proximal_lad";

    // Location weighting (SYNTAX scoring matrix)
    const locationScores = {
      proximal_lad: 5,
      mid_lad: 5,
      distal_lad: 2,
      proximal_lcx: 5,
      mid_lcx: 3,
      distal_lcx: 1,
      proximal_rca: 5,
      mid_rca: 3,
      distal_rca: 1,
      lmca: 8,
    };
    baseScore = locationScores[location] || 0;

    // Lesion characteristics (each adds points)
    let characteristicPoints = 0;
    if (v.aortic_ostial) characteristicPoints += 5;
    if (v.length) characteristicPoints += 2;
    if (v.calcification) characteristicPoints += 2;
    if (v.tortuosity) characteristicPoints += 2;
    if (v.bifurcation) characteristicPoints += 5;
    if (v.angulation) characteristicPoints += 1;
    if (v.thrombus) characteristicPoints += 5;
    if (v.intimal_flap) characteristicPoints += 1;
    if (v.stump) characteristicPoints += 2;
    if (v.small_vessel) characteristicPoints += 1;

    // Stenosis severity modifier
    const stenosis = v.stenosis || "75";
    let stenosisModifier = 0;
    if (stenosis === "50") stenosisModifier = 0;
    else if (stenosis === "75") stenosisModifier = 0;
    else if (stenosis === "100") stenosisModifier = 2; // Total occlusion adds 2 points

    // Calculate single lesion score
    let singleLesionScore = baseScore + characteristicPoints + stenosisModifier;

    // Adjust for multiple lesions (simplified; SYNTAX uses weighted algorithm)
    const numLesions = parseInt(v.num_lesions || "1", 10);
    let syntaxScore = singleLesionScore;

    if (numLesions === 2) {
      syntaxScore = Math.round(singleLesionScore * 1.15);
    } else if (numLesions === 3) {
      syntaxScore = Math.round(singleLesionScore * 1.25);
    }

    // Determine risk category
    let severity = "ok";
    let category = "Low";
    if (syntaxScore >= 33) {
      severity = "critical";
      category = "High";
    } else if (syntaxScore >= 23) {
      severity = "high";
      category = "Intermediate";
    }

    // Recommendations based on score
    const recommendation = (() => {
      if (syntaxScore < 23) {
        return "SYNTAX Low: PCI generally preferred over CABG";
      } else if (syntaxScore < 33) {
        return "SYNTAX Intermediate: Heart Team assessment recommended (PCI vs CABG)";
      } else {
        return "SYNTAX High: CABG often preferred; consider Heart Team discussion";
      }
    })();

    return {
      title: "SYNTAX Score",
      lines: [
        { label: "SYNTAX Score", value: `${syntaxScore}`, severity },
        { label: "Risk Category", value: category, severity },
      ],
      notes: [
        recommendation,
        "Note: This is a simplified single-lesion SYNTAX calculation. Full SYNTAX scoring accounts for all lesions in the coronary tree and applies a weighted algorithm.",
        "SYNTAX ≤22: Low complexity | 23–32: Intermediate | ≥33: High complexity",
        "Reference: Sianos et al., EuroIntervention 2005",
      ],
    };
  },

  copyText: (_v, r) => {
    const score = r?.lines?.[0]?.value ?? "";
    const category = r?.lines?.[1]?.value ?? "";
    return `SYNTAX Score: ${score} (${category} complexity)`;
  },

  links: [
    {
      label: "SYNTAX Score Online Calculator",
      url: "https://www.syntaxscore.com/",
    },
  ],
};
