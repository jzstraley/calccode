import React from "react";
import { Activity, Stethoscope, Zap, BookOpen } from "lucide-react";
import { CALCS } from "../calcs/index.js";

export default function Landing({ onOpenCalc, pinned, recentCalcs }) {
  // Calculate stats
  const categories = [...new Set(CALCS.map((c) => c.category))];
  const stats = [
    { label: "Calculators", value: CALCS.length, color: "#f07a68" },
    { label: "Categories", value: categories.length, color: "#cfb8ff" },
    { label: "Saved", value: pinned.length, color: "#c9fa75" },
  ];

  // Group calculators by category
  const byCategory = categories.reduce((acc, cat) => {
    acc[cat] = CALCS.filter((c) => c.category === cat).slice(0, 3);
    return acc;
  }, {});

  const getCategoryIcon = (category) => {
    const iconMap = {
      Cardiology: <Activity size={20} />,
      Coronary: <Zap size={20} />,
      Hemodynamics: <Stethoscope size={20} />,
    };
    return iconMap[category] || <BookOpen size={20} />;
  };

  return (
    <div className="ccLanding">
      <div className="ccLandingContent">
        {/* Hero section */}
        <div className="ccLandingHero">
          <h1 className="ccLandingTitle">Clinical Calculators</h1>
          <p className="ccLandingSubtitle">
            Comprehensive collection of cardiac, hemodynamic, and clinical decision support tools
          </p>
        </div>

        {/* Stats section */}
        <div className="ccStatsGrid">
          {stats.map((stat, i) => (
            <div key={i} className="ccStatCard">
              <div className="ccStatLabel">{stat.label}</div>
              <div className="ccStatValue" style={{ color: stat.color }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Featured sections */}
        {Object.entries(byCategory).map(([category, calcs]) => (
          <div key={category} className="ccLandingSection">
            <div className="ccLandingSectionHeader">
              <div className="ccLandingSectionIcon" style={{ color: "#f07a68" }}>
                {getCategoryIcon(category)}
              </div>
              <h2 className="ccLandingSectionTitle">{category}</h2>
            </div>
            <div className="ccCalcGrid">
              {calcs.map((calc) => (
                <button
                  key={calc.id}
                  className="ccCalcCard"
                  onClick={() => onOpenCalc(calc.id)}
                  type="button"
                >
                  <div className="ccCalcCardContent">
                    <div className="ccCalcCardName">{calc.name}</div>
                    <div className="ccCalcCardDesc">{calc.category}</div>
                  </div>
                  <div className="ccCalcCardArrow">→</div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Recent section */}
        {recentCalcs.length > 0 && (
          <div className="ccLandingSection">
            <h2 className="ccLandingSectionTitle">Recently Used</h2>
            <div className="ccChipRow">
              {recentCalcs.slice(0, 6).map((calc) => (
                <button
                  key={calc.id}
                  className="ccChip"
                  onClick={() => onOpenCalc(calc.id)}
                  type="button"
                >
                  {calc.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer hint */}
        <div className="ccLandingFooter">
          <p>💡 Tip: Press <kbd>Cmd K</kbd> to search, or click any calculator to open it</p>
        </div>
      </div>
    </div>
  );
}
