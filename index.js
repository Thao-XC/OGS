import { useEffect, useState } from "react";
import Head from "next/head";
import ingredientsData from "../data/ingredients.json";
import Onboarding from "../components/Onboarding";
import IngredientPicker from "../components/IngredientPicker";
import Tray from "../components/Tray";
import RecipeDetail from "../components/RecipeDetail";

const STORAGE_KEY = "kitchen-app-profile";

export default function Home() {
  // `profile` is null until onboarding is finished (or a saved profile
  // is found in localStorage from a previous visit).
  const [profile, setProfile] = useState(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const [selected, setSelected] = useState([]);
  const [diet, setDiet] = useState("No restriction");
  const [cuisine, setCuisine] = useState("Any");
  const [cookTime, setCookTime] = useState("30");

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeRecipe, setActiveRecipe] = useState(null);

  // On first load in the browser, check localStorage for a saved profile
  // so returning users skip onboarding. This only runs client-side.
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setProfile(parsed);
      setDiet(parsed.diet);
      setCuisine(parsed.cuisine);
      setCookTime(parsed.cookTime);
    }
    setProfileLoaded(true);
  }, []);

  function handleOnboardingComplete(data) {
    setProfile(data);
    setDiet(data.diet);
    setCuisine(data.cuisine);
    setCookTime(data.cookTime);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function toggleIngredient(item) {
    setSelected((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item]
    );
  }

  async function findRecipes() {
    setLoading(true);
    setError("");
    setRecipes([]);
    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: selected.map((i) => i.name),
          diet,
          cuisine,
          cookTime,
          name: profile?.name,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }
      setRecipes(data.recipes || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Avoid a flash of the onboarding screen while we check localStorage.
  if (!profileLoaded) return null;

  if (!profile) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <>
      <Head>
        <title>What's in my kitchen?</title>
      </Head>
      <div className="app-shell">
        <div className="top-bar">
          <h1>What's in my kitchen?</h1>
          <span className="greeting">Hey {profile.name} 👋</span>
        </div>

        <div className="layout-grid">
          <div>
            <IngredientPicker
              ingredients={ingredientsData}
              selectedIds={selected.map((i) => i.id)}
              onToggle={toggleIngredient}
            />

            <div className="results-header">
              <h2>Recipes</h2>
            </div>

            {loading && (
              <div className="state-msg">
                <div className="spinner" />
                Looking for recipes that fit your board…
              </div>
            )}

            {!loading && error && (
              <div className="state-msg" style={{ color: "var(--clay)" }}>
                {error}
              </div>
            )}

            {!loading && !error && recipes.length === 0 && (
              <div className="state-msg">
                Pick some ingredients and hit "Find recipes" to see suggestions here.
              </div>
            )}

            {!loading && recipes.length > 0 && (
              <div className="recipe-grid">
                {recipes.map((r) => (
                  <button
                    key={r.title}
                    className="recipe-card"
                    onClick={() => setActiveRecipe(r)}
                  >
                    <h3>{r.title}</h3>
                    <div className="meta">
                      <span className="badge">⏱ {r.cookTimeMinutes} min</span>
                      <span className="badge">{r.difficulty}</span>
                    </div>
                    <p className="desc">{r.description}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Tray
            selected={selected}
            onRemove={toggleIngredient}
            diet={diet}
            setDiet={setDiet}
            cuisine={cuisine}
            setCuisine={setCuisine}
            cookTime={cookTime}
            setCookTime={setCookTime}
            onFindRecipes={findRecipes}
            loading={loading}
          />
        </div>
      </div>

      <RecipeDetail recipe={activeRecipe} onClose={() => setActiveRecipe(null)} />
    </>
  );
}
