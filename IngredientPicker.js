import { useMemo, useState } from "react";

// Renders the searchable, filterable grid of ingredient tiles.
// `ingredients` is the full 300+ item list (passed down from index.js).
// `selectedIds` and `onToggle` let this component stay "dumb" — it
// doesn't own the selection state itself, it just reports taps upward.
export default function IngredientPicker({ ingredients, selectedIds, onToggle }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    const set = new Set(ingredients.map((i) => i.category));
    return ["All", ...Array.from(set)];
  }, [ingredients]);

  const filtered = useMemo(() => {
    return ingredients.filter((item) => {
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      const matchesQuery = item.name
        .toLowerCase()
        .includes(query.trim().toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [ingredients, activeCategory, query]);

  return (
    <div>
      <div className="filter-bar">
        <input
          className="search-box"
          type="text"
          placeholder="Search ingredients…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="category-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-tab ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="ingredient-grid">
        {filtered.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <button
              key={item.id}
              className={`ingredient-tile ${isSelected ? "selected" : ""}`}
              onClick={() => onToggle(item)}
              aria-pressed={isSelected}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.name}</span>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p style={{ color: "var(--ink-soft)", fontSize: 13 }}>
            No ingredients match "{query}". You can still use the recipe
            search with what you've already picked.
          </p>
        )}
      </div>
    </div>
  );
}
