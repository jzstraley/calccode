// src/App.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { HeartPulse, Plus, Search, Star } from "lucide-react";
import { CALCS } from "./calcs/index.js";
import { useLocalStorage } from "./utils/storage.js";
import CalcRunner from "./components/CalcRunner.jsx";

function pickCalc(id) {
  return CALCS.find((c) => c.id === id) || null;
}

export default function App() {
  const barRef = useRef(null);

  const [activeId, setActiveId] = useState(null); // null means Home
  const [query, setQuery] = useState("");

  const [favorites, setFavorites] = useLocalStorage("calccode:favorites", []);
  const [recents, setRecents] = useLocalStorage("calccode:recents", []);

  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);
  const activeCalc = useMemo(() => (activeId ? pickCalc(activeId) : null), [activeId]);

  const pinned = useMemo(() => CALCS.filter((c) => favoriteSet.has(c.id)), [favoriteSet]);
  const recentCalcs = useMemo(
    () => recents.map((id) => pickCalc(id)).filter(Boolean),
    [recents]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CALCS;
    return CALCS.filter((c) => {
      const hay = `${c.name} ${c.category} ${(c.tags || []).join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  const openCalc = (id) => {
    setActiveId(id);
    setRecents((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)];
      return next.slice(0, 12);
    });
  };

  const goHome = () => {
    setActiveId(null);
    requestAnimationFrame(() => barRef.current?.focus());
  };

  const togglePin = (id) => {
    setFavorites((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return Array.from(s);
    });
  };

  // Focus command bar on load
  useEffect(() => {
    barRef.current?.focus();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e) => {
      const isCmdK = (e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K");
      if (isCmdK) {
        e.preventDefault();
        barRef.current?.focus();
        return;
      }

      if (e.key === "Escape") {
        if (activeId) {
          e.preventDefault();
          goHome();
          return;
        }
        if (document.activeElement !== barRef.current) {
          e.preventDefault();
          barRef.current?.focus();
          return;
        }
      }

      if (e.key === "Enter") {
        const q = query.trim();
        if (!q) return;
        const first = filtered[0];
        if (first) {
          e.preventDefault();
          openCalc(first.id);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeId, query, filtered]);

  const onPickFromPinned = (e) => {
    const id = e.target.value;
    if (!id) return;
    openCalc(id);
    e.target.value = "";
  };

  return (
    <div className="ccShell">
      {/* Top chrome */}
      <header className="ccTop">
        <div className="ccTopLeft">
          <div className="ccSelectWrap" title="Pinned calculators">
            <select className="ccSelect" defaultValue="" onChange={onPickFromPinned}>
              <option value="" disabled>
                Pinned
              </option>
              {pinned.length === 0 ? (
                <option value="" disabled>
                  No pinned calculators
                </option>
              ) : (
                pinned.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="ccBrand">
            <span className="ccBrandIcon">
              <HeartPulse size={16} />
            </span>
            <span className="ccBrandText">CalcCode</span>
          </div>
        </div>

        <button
          className="ccIconBtn"
          type="button"
          title="Add calculator (later)"
          onClick={() => {
            // placeholder for future: add custom calculator builder modal
            alert("Custom calculator builder is next. Tell me what fields you want.");
          }}
        >
          <Plus size={16} />
        </button>
      </header>

      {/* Main canvas */}
      <main className="ccCanvas">
        {!activeCalc ? (
          <div className="ccHome">
            <div className="ccCenter">
              <div className="ccMascot" aria-hidden="true" />
              <div className="ccCenterTitle">Type a calculator name</div>
              <div className="ccCenterSub">
                Press Enter to open the first match. Press Esc to focus the bar.
              </div>

              {recentCalcs.length > 0 && (
                <div className="ccSection">
                  <div className="ccSectionTitle">Recent</div>
                  <div className="ccChipRow">
                    {recentCalcs.slice(0, 8).map((c) => (
                      <button key={c.id} className="ccChip" onClick={() => openCalc(c.id)} type="button">
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {pinned.length > 0 && (
                <div className="ccSection">
                  <div className="ccSectionTitle">Pinned</div>
                  <div className="ccChipRow">
                    {pinned.slice(0, 8).map((c) => (
                      <button key={c.id} className="ccChip" onClick={() => openCalc(c.id)} type="button">
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="ccCalc">
            <div className="ccCalcHeader">
              <div className="ccCalcTitleBlock">
                <div className="ccCalcTitle">{activeCalc.name}</div>
                <div className="ccCalcMeta">{activeCalc.category}</div>
              </div>

              <div className="ccCalcActions">
                <button className="ccGhostBtn" type="button" onClick={goHome} title="Back (Esc)">
                  Back
                </button>

                <button
                  className={`ccPinBtn ${favoriteSet.has(activeCalc.id) ? "on" : ""}`}
                  type="button"
                  onClick={() => togglePin(activeCalc.id)}
                  title="Pin"
                >
                  <Star size={16} />
                  Pin
                </button>
              </div>
            </div>

            <div className="ccCard">
              <CalcRunner
                calc={activeCalc}
                isFavorite={favoriteSet.has(activeCalc.id)}
                onToggleFavorite={() => togglePin(activeCalc.id)}
              />
            </div>
          </div>
        )}
      </main>

      {/* Bottom command bar */}
      <footer className="ccBottom">
        <div className="ccCmd">
          <div className="ccCmdIcon">
            <Search size={16} />
          </div>

          <input
            ref={barRef}
            className="ccCmdInput"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search calculators…"
            aria-label="Command bar"
          />

          <div className="ccCmdHint">
            <span className="ccKey">Esc</span>
            <span className="ccKey">Enter</span>
            <span className="ccKey">{navigator.platform.toLowerCase().includes("mac") ? "⌘K" : "Ctrl K"}</span>
          </div>
        </div>

        {/* Tiny results strip that appears only when typing */}
        {query.trim() && !activeCalc && (
          <div className="ccResultsStrip">
            {filtered.slice(0, 6).map((c) => (
              <button
                key={c.id}
                className={`ccResultPill ${favoriteSet.has(c.id) ? "pinned" : ""}`}
                onClick={() => openCalc(c.id)}
                type="button"
              >
                {c.name}
              </button>
            ))}
            {filtered.length === 0 && <div className="ccNoResults">No matches</div>}
          </div>
        )}
      </footer>
    </div>
  );
}