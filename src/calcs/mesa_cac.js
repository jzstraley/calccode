// src/calcs/mesa_cac.js
export default {
  id: "mesa_cac",
  name: "MESA CAC Percentile",
  category: "Cardiology",
  tags: ["cac", "calcium", "mesa", "risk", "coronary"],
  fields: [],
  links: [
    {
      label: "Open MESA CAC Calculator",
      url: "https://tools.mesa-nhlbi.org/Calcium/input.aspx",
    },
  ],
  compute: () => ({
    title: "MESA CAC Percentile",
    lines: [],
    notes: [
      "Inputs: age (45–84), sex, race/ethnicity, and optional Agatston CAC score.",
      "Outputs: probability of any CAC, 25th/50th/75th/90th percentile scores for the group, and percentile rank if a score is entered.",
      "Based on MESA cohort (n=6,110). McClelland RL et al., Circulation 2006;113:30–37.",
    ],
  }),
  copyText: () => "See MESA CAC Percentile calculator: https://tools.mesa-nhlbi.org/Calcium/input.aspx",
};
