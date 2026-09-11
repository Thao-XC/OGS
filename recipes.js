// This file lives at /pages/api/recipes.js, which Next.js automatically
// turns into a serverless function at the URL /api/recipes.
// When deployed on Vercel, this code runs on Vercel's servers, NOT in the
// browser — which is exactly why it's safe to use a secret API key here.
// The key is read from an environment variable (set in Vercel's dashboard,
// or in a local .env.local file), never written into the code itself.
//
// This version calls Google's Gemini API. Get a free key at
// https://aistudio.google.com/apikey

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests are allowed." });
  }

  const { ingredients, diet, cuisine, cookTime, name } = req.body;

  if (!ingredients || ingredients.length === 0) {
    return res.status(400).json({ error: "Pick at least one ingredient first." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error:
        "No API key configured on the server. Add GEMINI_API_KEY in your Vercel project settings (or .env.local for local dev).",
    });
  }

  // We describe exactly what shape of JSON we want back, so we can
  // parse it directly into the UI without extra guesswork.
  const prompt = `You are a home cooking assistant. Suggest 4 recipes using mostly these
available ingredients: ${ingredients.join(", ")}.

User preferences:
- Diet: ${diet || "no restriction"}
- Preferred cuisine: ${cuisine || "any"}
- Max cooking time: ${cookTime || "any"} minutes
${name ? `- Cooking for: ${name}` : ""}

Rules:
- Prefer recipes that use only the listed ingredients, plus common pantry
  basics (salt, pepper, oil, water) which don't need to be listed.
- Respect the diet and cuisine preferences when possible.
- Keep instructions clear and beginner-friendly.

Respond with ONLY valid JSON, matching exactly this shape:

{
  "recipes": [
    {
      "title": "string",
      "description": "one short enticing sentence",
      "cookTimeMinutes": number,
      "difficulty": "Easy" | "Medium" | "Hard",
      "usesIngredients": ["ingredient", "ingredient"],
      "steps": ["step one", "step two", "..."]
    }
  ]
}`;

  const model = "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        // Gemini's JSON mode: this tells the model to return raw JSON
        // instead of prose, so we don't need to strip markdown fences.
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(502).json({ error: `AI API error: ${errText}` });
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (parseErr) {
      return res.status(502).json({
        error: "The AI response wasn't valid JSON. Try again.",
        raw: rawText,
      });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
