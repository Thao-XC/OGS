// The sticky wooden-board sidebar showing what's currently selected,
// plus the diet/cuisine/time filters and the "Find Recipes" button.

const CUISINES = ["Any", "Italian", "Mexican", "Japanese", "Indian", "Thai", "American", "Mediterranean"];
const DIETS = ["No restriction", "Vegetarian", "Vegan", "Gluten-free", "Dairy-free", "Low-carb"];
const TIMES = ["15", "30", "45", "60+"];

export default function Tray({
  selected,
  onRemove,
  diet,
  setDiet,
  cuisine,
  setCuisine,
  cookTime,
  setCookTime,
  onFindRecipes,
  loading,
}) {
  return (
    <div className="tray">
      <h2>Your board</h2>
      <div className="count">
        {selected.length === 0
          ? "Nothing picked yet"
          : `${selected.length} ingredient${selected.length > 1 ? "s" : ""} ready`}
      </div>

      <div className="tray-items">
        {selected.length === 0 && (
          <span className="tray-empty">Tap ingredients to add them here.</span>
        )}
        {selected.map((item) => (
          <span className="tray-chip" key={item.id}>
            {item.icon} {item.name}
            <button onClick={() => onRemove(item)} aria-label={`Remove ${item.name}`}>
              ×
            </button>
          </span>
        ))}
      </div>

      <div className="field">
        <label style={{ color: "rgba(255,255,255,0.9)" }}>Diet</label>
        <select
          className="filter-select"
          value={diet}
          onChange={(e) => setDiet(e.target.value)}
          style={{ width: "100%" }}
        >
          {DIETS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label style={{ color: "rgba(255,255,255,0.9)" }}>Cuisine</label>
        <select
          className="filter-select"
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          style={{ width: "100%" }}
        >
          {CUISINES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label style={{ color: "rgba(255,255,255,0.9)" }}>Max time (min)</label>
        <select
          className="filter-select"
          value={cookTime}
          onChange={(e) => setCookTime(e.target.value)}
          style={{ width: "100%" }}
        >
          {TIMES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <button
        className="primary-btn"
        onClick={onFindRecipes}
        disabled={selected.length === 0 || loading}
      >
        {loading ? "Cooking up ideas…" : "Find recipes"}
      </button>
    </div>
  );
}
