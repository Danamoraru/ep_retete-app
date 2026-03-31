"use client";

import { useEffect, useMemo, useState } from "react";
import RecipeForm from "./components/RecipeForm";
import RecipeList from "./components/RecipeList";
import {
  getRecipesFromStorage,
  saveRecipesToStorage,
} from "./lib/recipeStorage";

export default function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("toate");
  const [sortOption, setSortOption] = useState("name-asc");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedRecipes = getRecipesFromStorage();
    setRecipes(storedRecipes);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    saveRecipesToStorage(recipes);
  }, [recipes, isLoaded]);

  function handleAddRecipe(recipeData) {
    const newRecipe = {
      ...recipeData,
      id: crypto.randomUUID(),
    };

    setRecipes(function updatePreviousRecipes(previousRecipes) {
      return [...previousRecipes, newRecipe];
    });
  }

  function handleUpdateRecipe(updatedRecipe) {
    setRecipes(function updatePreviousRecipes(previousRecipes) {
      return previousRecipes.map(function mapRecipe(recipe) {
        if (recipe.id === updatedRecipe.id) {
          return updatedRecipe;
        }

        return recipe;
      });
    });

    setEditingRecipe(null);
  }

  function handleDeleteRecipe(recipeId) {
    const isConfirmed = window.confirm("Sigur vrei să ștergi această rețetă?");

    if (!isConfirmed) {
      return;
    }

    setRecipes(function updatePreviousRecipes(previousRecipes) {
      return previousRecipes.filter(function filterRecipe(recipe) {
        return recipe.id !== recipeId;
      });
    });

    if (editingRecipe && editingRecipe.id === recipeId) {
      setEditingRecipe(null);
    }
  }

  function handleEditRecipe(recipe) {
    setEditingRecipe(recipe);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setEditingRecipe(null);
  }

  const filteredAndSortedRecipes = useMemo(function computeRecipes() {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    const filteredRecipes = recipes.filter(function filterRecipe(recipe) {
      const matchesSearch =
        recipe.name.toLowerCase().includes(normalizedSearchTerm) ||
        recipe.ingredients.toLowerCase().includes(normalizedSearchTerm);

      const matchesDifficulty =
        difficultyFilter === "toate" || recipe.difficulty === difficultyFilter;

      return matchesSearch && matchesDifficulty;
    });

    const sortedRecipes = [...filteredRecipes];

    sortedRecipes.sort(function sortRecipes(firstRecipe, secondRecipe) {
      if (sortOption === "name-asc") {
        return firstRecipe.name.localeCompare(secondRecipe.name);
      }

      if (sortOption === "name-desc") {
        return secondRecipe.name.localeCompare(firstRecipe.name);
      }

      if (sortOption === "time-asc") {
        return (
          Number(firstRecipe.preparationTime) -
          Number(secondRecipe.preparationTime)
        );
      }

      if (sortOption === "time-desc") {
        return (
          Number(secondRecipe.preparationTime) -
          Number(firstRecipe.preparationTime)
        );
      }

      return 0;
    });

    return sortedRecipes;
  }, [recipes, searchTerm, difficultyFilter, sortOption]);

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <h1 style={titleStyle}>Aplicație Rețete</h1>
        <p style={subtitleStyle}>Next.js + CRUD + localStorage</p>

        <RecipeForm
          onAddRecipe={handleAddRecipe}
          onUpdateRecipe={handleUpdateRecipe}
          editingRecipe={editingRecipe}
          onCancelEdit={handleCancelEdit}
        />

        <section style={filterSectionStyle}>
          <input
            type="text"
            placeholder="Caută după nume sau ingrediente..."
            value={searchTerm}
            onChange={function handleSearchChange(event) {
              setSearchTerm(event.target.value);
            }}
            style={inputStyle}
          />

          <select
            value={difficultyFilter}
            onChange={function handleDifficultyChange(event) {
              setDifficultyFilter(event.target.value);
            }}
            style={inputStyle}
          >
            <option value="toate">Toate dificultățile</option>
            <option value="ușor">Ușor</option>
            <option value="mediu">Mediu</option>
            <option value="greu">Greu</option>
          </select>

          <select
            value={sortOption}
            onChange={function handleSortChange(event) {
              setSortOption(event.target.value);
            }}
            style={inputStyle}
          >
            <option value="name-asc">Nume A-Z</option>
            <option value="name-desc">Nume Z-A</option>
            <option value="time-asc">Timp crescător</option>
            <option value="time-desc">Timp descrescător</option>
          </select>
        </section>

        <RecipeList
          recipes={filteredAndSortedRecipes}
          onEditRecipe={handleEditRecipe}
          onDeleteRecipe={handleDeleteRecipe}
        />
      </div>
    </main>
  );
}

const pageStyle = {
  minHeight: "100vh",
  backgroundColor: "#f5f7fb",
  padding: "30px 16px",
};

const containerStyle = {
  maxWidth: "1000px",
  margin: "0 auto",
};

const titleStyle = {
  textAlign: "center",
  marginBottom: "8px",
};

const subtitleStyle = {
  textAlign: "center",
  color: "#555",
  marginBottom: "24px",
};

const filterSectionStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "12px",
  marginBottom: "24px",
};

const inputStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "14px",
};