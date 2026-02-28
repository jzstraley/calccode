import React from "react";
import { Star } from "lucide-react";

function Section({ title, items, activeId, onOpen, onToggleFavorite, isFavorite }) {
  if (!items.length) return null;
  return (
    <div className="cc-section">
      <div className="cc-section-title">{title}</div>
      <div className="cc-list">
        {items.map(c => (
          <button
            key={c.id}
            className={`cc-item ${c.id === activeId ? "active" : ""}`}
            onClick={() => onOpen(c.id)}
          >
            <div className="cc-item-main">
              <div className="cc-item-name">{c.name}</div>
              <div className="cc-item-meta">{c.category}</div>
            </div>

            <div
              className={`cc-star ${isFavorite(c.id) ? "on" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite(c.id);
              }}
              role="button"
              aria-label="Toggle favorite"
              title="Favorite"
            >
              <Star size={16} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CalcList({ buckets, activeId, onOpen, onToggleFavorite, isFavorite }) {
  return (
    <div className="cc-left-inner">
      <Section
        title="Favorites"
        items={buckets.fav}
        activeId={activeId}
        onOpen={onOpen}
        onToggleFavorite={onToggleFavorite}
        isFavorite={isFavorite}
      />
      <Section
        title="Recent"
        items={buckets.recent}
        activeId={activeId}
        onOpen={onOpen}
        onToggleFavorite={onToggleFavorite}
        isFavorite={isFavorite}
      />
      <Section
        title="All"
        items={buckets.rest}
        activeId={activeId}
        onOpen={onOpen}
        onToggleFavorite={onToggleFavorite}
        isFavorite={isFavorite}
      />
    </div>
  );
}