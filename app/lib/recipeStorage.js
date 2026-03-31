const STORAGE_KEY = "nextjs_recipes";

export function getRecipesFromStorage() {
  if (typeof window === "undefined") {
    return [];
  }

  const storedRecipes = localStorage.getItem(STORAGE_KEY);

  if (!storedRecipes) {
    return [];
  }

  try {
    const parsedRecipes = JSON.parse(storedRecipes);

    if (Array.isArray(parsedRecipes)) {
      return parsedRecipes;
    }

    return [];
  } catch (error) {
    console.error("Error reading recipes from localStorage:", error);
    return [];
  }
}

export function saveRecipesToStorage(recipes) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}