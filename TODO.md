# CALCCODE TODO

---

## Valve Severity Calculator

- [ ] ASE/ACC/AHA grading tables: AS, AR, MS, MR, TR
- [ ] Input fields per valve: relevant Doppler parameters (Vmax, mean gradient, AVA, EROA, RVol, PHT, PISA, etc.)
- [ ] Output: severity grade with specific threshold that was crossed
- [ ] Multi-parameter reconciliation: flag disagreements (e.g. AVA severe but gradient moderate → low-flow low-gradient alert)
- [ ] ASE reference citation displayed per calculation
- [ ] Integrated grading summary: all valves on one screen for multi-valve patient
- [ ] No PHI — pure calculator, no patient data stored
- [ ] Offline capable: all logic runs client-side, no network required mid-echo
- [ ] 3 taps max to a result from home screen
- [ ] Phase 2: link to FellowShift procedure logger as a reference tool

---

## Auto-Draft Cath Report

- [ ] Confirm DICOM access options at CAMC — check syngo.via API/export capabilities
- [ ] **Path 1 — Manual input:** fellow enters hemodynamics + lesion data → AI drafts structured report in dotphrase format
- [ ] **Path 2 — DICOM-assisted:** parse structured data from syngo.via if HL7/FHIR export available → skip manual entry
- [ ] **Path 3 — Image analysis:** DICOM upload → Claude vision API estimates stenosis → fellow confirms → report drafted
- [ ] Output matches existing cath lab dotphrase/template structure
- [ ] Hemodynamic summary block: pressures, outputs, gradients, valve areas auto-calculated
- [ ] Coronary anatomy block: vessel-by-vessel lesion description with severity and intervention
- [ ] Impression + plan block: AI-generated, fellow edits before signing
- [ ] HIPAA: Path 2/3 data never leaves hospital network — local or CAMC-approved endpoint only
- [ ] Contact J. Polizzi (CAMC CHIO) early — DICOM API access requires IT approval
- [ ] **Phase 1 target:** manual input draft tool only — no DICOM dependency, shippable fast
- [ ] Parallel task: resolve syngo Dynamics echo PDF-only export to Cerner

---

## References

- [PA Catheter Normative Data - EMCrit][1]
- [CPO in Cardiogenic Shock - JACC][2]
- [PAPI and RV Function - Circulation][3]

[1]: https://emcrit.org/ibcc/pah/
[2]: https://www.jacc.org/doi/10.1016/j.jacc.2018.04.011
[3]: https://www.ahajournals.org/doi/10.1161/CIRCULATIONAHA.116.023462