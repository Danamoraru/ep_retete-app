"use client";

export default function RecipeList({ recipes, onEditRecipe, onDeleteRecipe }) {
  return (
    <section style={sectionStyle}>
      <h2>Lista rețetelor</h2>

      {recipes.length === 0 ? (
        <p>Nu există rețete salvate.</p>
      ) : (
        <div style={gridStyle}>
          {recipes.map(function renderRecipe(recipe) {
            return (
              <article key={recipe.id} style={cardStyle}>
                <h3>{recipe.name}</h3>
                <p>
                  <strong>Ingrediente:</strong> {recipe.ingredients}
                </p>
                <p>
                  <strong>Timp preparare:</strong> {recipe.preparationTime} minute
                </p>
                <p>
                  <strong>Dificultate:</strong> {recipe.difficulty}
                </p>

                <div style={buttonContainerStyle}>
                  <button
                    onClick={function handleEditClick() {
                      onEditRecipe(recipe);
                    }}
                    style={editButtonStyle}
                  >
                    Editează
                  </button>

                  <button
                    onClick={function handleDeleteClick() {
                      onDeleteRecipe(recipe.id);
                    }}
                    style={deleteButtonStyle}
                  >
                    Șterge
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

const sectionStyle = {
  backgroundColor: "#ffffff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "16px",
};

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "16px",
  backgroundColor: "#fafafa",
};

const buttonContainerStyle = {
  display: "flex",
  gap: "10px",
  marginTop: "16px",
};

const editButtonStyle = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const deleteButtonStyle = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};