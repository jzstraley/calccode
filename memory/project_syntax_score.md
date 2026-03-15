---
name: SYNTAX Score Calculator Implementation
description: Added SYNTAX score for coronary artery lesion complexity assessment
type: project
---

Added **SYNTAX Score calculator** (src/calcs/syntax_score.js) to CalcCode for assessing coronary artery disease complexity.

**Why:** Supports the "Auto-Draft Cath Report" feature mentioned in TODO. SYNTAX score is critical for PCI vs CABG decision-making in cardiac catheterization reports.

**Key features:**
- Location-based scoring (LAD/LCx/RCA/LMCA, proximal/mid/distal)
- Lesion characteristic modifiers (calcification, tortuosity, bifurcation, thrombus, etc.)
- Stenosis severity adjustment
- Multi-lesion adjustment
- Risk stratification: Low (≤22) → PCI preferred, Intermediate (23–32) → Heart Team discussion, High (≥33) → CABG often preferred
- Links to official SYNTAX calculator and references

**Related tasks:** Used for cath lab report generation when lesion data is entered or parsed from DICOM.
