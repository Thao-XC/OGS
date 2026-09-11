import { useState } from "react";

const CUISINES = ["Any", "Italian", "Mexican", "Japanese", "Indian", "Thai", "American", "Mediterranean"];
const DIETS = ["No restriction", "Vegetarian", "Vegan", "Gluten-free", "Dairy-free", "Low-carb"];
const TIMES = ["15", "30", "45", "60+"];

// This screen appears once, the very first time someone opens the app.
// It collects a few preferences and hands them back to the parent
// component (via onComplete) to be saved and used to personalize
// recipe suggestions later.
export default function Onboarding({ onComplete }) {
  const [name, setName] = useState("");
  const [cuisine, setCuisine] = useState("Any");
  const [diet, setDiet] = useState("No restriction");
  const [cookTime, setCookTime] = useState("30");

  function handleSubmit(e) {
    e.preventDefault();
    onComplete({ name: name.trim() || "Chef", cuisine, diet, cookTime });
  }

  return (
    <div className="onboarding-wrap">
      <form className="onboarding-card" onSubmit={handleSubmit}>
        <h1>What's in my kitchen?</h1>
        <p className="sub">
          A few quick questions so we can suggest recipes that actually fit you.
        </p>

        <div className="field">
          <label htmlFor="name">What should we call you?</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>

        <div className="field">
          <label>Favorite cuisine</label>
          <div className="chip-row">
            {CUISINES.map((c) => (
              <button
                type="button"
                key={c}
                className={`chip ${cuisine === c ? "selected" : ""}`}
                onClick={() => setCuisine(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label>Dietary preference</label>
          <div className="chip-row">
            {DIETS.map((d) => (
              <button
                type="button"
                key={d}
                className={`chip ${diet === d ? "selected" : ""}`}
                onClick={() => setDiet(d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label>Usual cooking time (minutes)</label>
          <div className="chip-row">
            {TIMES.map((t) => (
              <button
                type="button"
                key={t}
                className={`chip ${cookTime === t ? "selected" : ""}`}
                onClick={() => setCookTime(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="primary-btn">
          Enter the kitchen
        </button>
      </form>
    </div>
  );
}
