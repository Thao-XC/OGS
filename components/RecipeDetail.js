// Full-screen detail view for one recipe. The "usesIngredients" list is
// rendered as tiles that animate onto a wooden cutting board one by one
// (staggered using each tile's index), then the steps follow below.
export default function RecipeDetail({ recipe, onClose }) {
  if (!recipe) return null;

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2>{recipe.title}</h2>
        <div className="meta">
          <span className="badge">⏱ {recipe.cookTimeMinutes} min</span>
          <span className="badge">{recipe.difficulty}</span>
        </div>
        <p style={{ color: "var(--ink-soft)", marginTop: -10, marginBottom: 24 }}>
          {recipe.description}
        </p>

        <div className="cutting-board">
          <h4>On the board</h4>
          <div className="board-items">
            {recipe.usesIngredients?.map((ing, i) => (
              <span
                className="board-item"
                key={ing}
                style={{ animationDelay: `${i * 90}ms` }}
              >
                {ing}
              </span>
            ))}
          </div>
        </div>

        <ol className="steps-list">
          {recipe.steps?.map((step, i) => (
            <li key={i}>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
