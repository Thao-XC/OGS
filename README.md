# What's in my kitchen?

Pick the ingredients you have, set a diet/cuisine/time preference, and get
AI-generated recipe suggestions — with a little cutting-board animation
when you open a recipe.

## Project structure

- `data/ingredients.json` — 300+ ingredients, categorized, each with an emoji icon
- `components/` — Onboarding, IngredientPicker, Tray (sidebar), RecipeDetail
- `pages/index.js` — main app screen, holds all the state
- `pages/api/recipes.js` — serverless function that calls the Gemini API (runs
  on Vercel's server, keeps your API key hidden from the browser)
- `styles/globals.css` — all styling, using CSS variables as design tokens

## Run it locally

```
npm install
cp .env.local.example .env.local   # then paste your Gemini API key into .env.local
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

1. Push this folder to a new GitHub repository.
2. Go to vercel.com, "Add New Project", import that repository.
3. Before deploying, add an Environment Variable:
   - Key: `GEMINI_API_KEY`
   - Value: your Gemini API key (get one free at https://aistudio.google.com/apikey)
4. Deploy. Vercel automatically turns `pages/api/recipes.js` into a live
   serverless function at `/api/recipes`.

## Ideas for what to build next

- Swap localStorage for a real account system if you want profiles to
  follow a user across devices
- Add more animation on the cutting board (e.g. ingredients that look
  "chopped" as each step is checked off)
- Let users add their own custom ingredients to the list
- Cache/save favorite recipes
