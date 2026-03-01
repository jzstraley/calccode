// src/components/CalcRunner.jsx
import React, { useEffect, useMemo, useState } from "react";
import { RotateCcw, Info, Copy, Check } from "lucide-react";

function initValues(calc) {
  const out = {};
  for (const f of calc.fields) {
    if (f.type === "boolean") out[f.key] = false;
    else if (f.type === "select") out[f.key] = f.defaultValue ?? (f.options?.[0]?.value ?? "");
    else out[f.key] = "";
  }
  return out;
}

function isEmptyLike(x) {
  return x === "" || x === null || typeof x === "undefined";
}

function hasAnyInput(calc, values) {
  for (const f of calc.fields) {
    const v = values[f.key];
    if (f.type === "boolean" && !!v) return true;
    if (f.type !== "boolean" && !isEmptyLike(v)) return true;
  }
  return false;
}

function classForSeverity(sev) {
  if (sev === "critical") return "sev critical";
  if (sev === "high") return "sev high";
  if (sev === "borderline") return "sev borderline";
  return "sev ok";
}

async function copyToClipboard(text) {
  // Modern
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Fallback
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
}

export default function CalcRunner({ calc }) {
  const [values, setValues] = useState(() => initValues(calc));
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setValues(initValues(calc));
    setShowDetails(false);
    setCopied(false);
  }, [calc.id]);

  const result = useMemo(() => {
    try {
      return calc.compute(values) || null;
    } catch (e) {
      return {
        title: "Error",
        lines: [{ label: "Compute failed", value: String(e?.message || e), severity: "critical" }],
        notes: [],
      };
    }
  }, [calc, values]);

  const anyInput = useMemo(() => hasAnyInput(calc, values), [calc, values]);

  const hero = useMemo(() => {
    const first = result?.lines?.[0];
    if (!first) return null;
    return { label: first.label, value: first.value, severity: first.severity || "ok" };
  }, [result]);

  const secondary = useMemo(() => {
    const lines = result?.lines || [];
    return lines.slice(1, 4);
  }, [result]);

  const notes = result?.notes || [];

  const reset = () => {
    setValues(initValues(calc));
    setShowDetails(false);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!anyInput || !result) return;
    const text =
      typeof calc.copyText === "function"
        ? calc.copyText(values, result)
        : `${calc.name}: ${(result.lines || [])
            .map((l) => `${l.label} ${l.value}`)
            .join(". ")}.`;

    try {
      await copyToClipboard(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // If clipboard blocked, do nothing
    }
  };

  return (
    <div className="ccRunnerSimple">
      {/* Inputs */}
      <div className="ccSimpleCard">
        <div className="ccSimpleCardTop">
          <div className="ccSimpleCardTitle">Inputs</div>
          <div className="ccBtnRow">
            <button className="ccMiniBtn" type="button" onClick={reset} title="Reset">
              <RotateCcw size={14} />
              Reset
            </button>
          </div>
        </div>

        <div className="ccInputs">
          {calc.fields.map((f) => (
            <div key={f.key} className="ccField">
              <label className="ccFieldLabel">{f.label}</label>

              {f.type === "number" && (
                <input
                  className="ccFieldInput"
                  inputMode="decimal"
                  value={values[f.key]}
                  placeholder={f.placeholder || ""}
                  onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
                />
              )}

              {f.type === "select" && (
                <div className="ccSelectChips" role="group" aria-label={f.label}>
                  {(f.options || []).map((opt) => {
                    const on = String(values[f.key]) === String(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        className={`ccChipBtn ${on ? "on" : ""}`}
                        onClick={() => setValues((prev) => ({ ...prev, [f.key]: opt.value }))}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {f.type === "boolean" && (
                <div className="ccSelectChips" role="group" aria-label={f.label}>
                  <button
                    type="button"
                    className={`ccChipBtn ${values[f.key] ? "on" : ""}`}
                    onClick={() => setValues((prev) => ({ ...prev, [f.key]: true }))}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className={`ccChipBtn ${!values[f.key] ? "on" : ""}`}
                    onClick={() => setValues((prev) => ({ ...prev, [f.key]: false }))}
                  >
                    No
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Output */}
      <div className="ccSimpleCard">
        <div className="ccSimpleCardTop">
          <div className="ccSimpleCardTitle">Output</div>

          <div className="ccBtnRow">
            <button
              className={`ccMiniBtn ${copied ? "on" : ""}`}
              type="button"
              onClick={handleCopy}
              title="Copy to clipboard"
              disabled={!anyInput}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy"}
            </button>

            {notes.length > 0 && (
              <button
                className={`ccMiniBtn ${showDetails ? "on" : ""}`}
                type="button"
                onClick={() => setShowDetails((s) => !s)}
                title="Details"
              >
                <Info size={14} />
                Details
              </button>
            )}
          </div>
        </div>

        {!anyInput ? (
          <div className="ccEmptyState">Start typing above. Output updates live.</div>
        ) : (
          <>
            <div className={`ccHero ${classForSeverity(hero?.severity)}`}>
              <div className="ccHeroValue">{hero?.value ?? "—"}</div>
              <div className="ccHeroLabel">{hero?.label ?? (result?.title || "Result")}</div>
            </div>

            {secondary.length > 0 && (
              <div className="ccSecondary">
                {secondary.map((ln, idx) => (
                  <div key={idx} className={`ccSecondaryRow ${classForSeverity(ln.severity)}`}>
                    <div className="ccSecondaryLabel">{ln.label}</div>
                    <div className="ccSecondaryValue">{ln.value}</div>
                  </div>
                ))}
              </div>
            )}

            {showDetails && notes.length > 0 && (
              <div className="ccDetails">
                <div className="ccDetailsTitle">Details</div>
                <ul className="ccDetailsList">
                  {notes.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {calc.links?.length > 0 && (
          <div className="ccLinks">
            {calc.links.map((lnk, i) => (
              <a
                key={i}
                href={lnk.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ccLinkBtn"
              >
                {lnk.label} ↗
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}