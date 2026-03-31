"use client";

import { useEffect, useState } from "react";

const initialFormState = {
  name: "",
  ingredients: "",
  preparationTime: "",
  difficulty: "ușor",
};

export default function RecipeForm({
  onAddRecipe,
  onUpdateRecipe,
  editingRecipe,
  onCancelEdit,
}) {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingRecipe) {
      setFormData({
        name: editingRecipe.name,
        ingredients: editingRecipe.ingredients,
        preparationTime: editingRecipe.preparationTime,
        difficulty: editingRecipe.difficulty,
      });
    } else {
      setFormData(initialFormState);
    }
  }, [editingRecipe]);

  function validateForm() {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Numele rețetei este obligatoriu.";
    }

    if (!formData.ingredients.trim()) {
      newErrors.ingredients = "Ingredientele sunt obligatorii.";
    }

    if (!formData.preparationTime.toString().trim()) {
      newErrors.preparationTime = "Timpul de preparare este obligatoriu.";
    } else if (Number(formData.preparationTime) <= 0) {
      newErrors.preparationTime = "Timpul trebuie să fie mai mare decât 0.";
    }

    if (!formData.difficulty.trim()) {
      newErrors.difficulty = "Dificultatea este obligatorie.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData(function updatePreviousData(previousData) {
      return {
        ...previousData,
        [name]: value,
      };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    const normalizedRecipe = {
      ...formData,
      name: formData.name.trim(),
      ingredients: formData.ingredients.trim(),
      preparationTime: Number(formData.preparationTime),
    };

    if (editingRecipe) {
      onUpdateRecipe({
        ...normalizedRecipe,
        id: editingRecipe.id,
      });
    } else {
      onAddRecipe(normalizedRecipe);
    }

    setFormData(initialFormState);
    setErrors({});
  }

  return (
    <section style={sectionStyle}>
      <h2>{editingRecipe ? "Editează rețeta" : "Adaugă rețetă"}</h2>

      <form onSubmit={handleSubmit} style={formStyle}>
        <div>
          <label style={labelStyle}>Nume</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={inputStyle}
          />
          {errors.name ? <p style={errorStyle}>{errors.name}</p> : null}
        </div>

        <div>
          <label style={labelStyle}>Ingrediente</label>
          <textarea
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            rows="4"
            style={inputStyle}
          />
          {errors.ingredients ? (
            <p style={errorStyle}>{errors.ingredients}</p>
          ) : null}
        </div>

        <div>
          <label style={labelStyle}>Timp preparare (minute)</label>
          <input
            type="number"
            name="preparationTime"
            value={formData.preparationTime}
            onChange={handleChange}
            style={inputStyle}
          />
          {errors.preparationTime ? (
            <p style={errorStyle}>{errors.preparationTime}</p>
          ) : null}
        </div>

        <div>
          <label style={labelStyle}>Dificultate</label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="ușor">Ușor</option>
            <option value="mediu">Mediu</option>
            <option value="greu">Greu</option>
          </select>
          {errors.difficulty ? (
            <p style={errorStyle}>{errors.difficulty}</p>
          ) : null}
        </div>

        <div style={buttonContainerStyle}>
          <button type="submit" style={saveButtonStyle}>
            {editingRecipe ? "Salvează modificările" : "Adaugă rețeta"}
          </button>

          {editingRecipe ? (
            <button
              type="button"
              onClick={onCancelEdit}
              style={cancelButtonStyle}
            >
              Anulează
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}

const sectionStyle = {
  backgroundColor: "#ffffff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  marginBottom: "24px",
};

const formStyle = {
  display: "grid",
  gap: "14px",
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontWeight: "600",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const errorStyle = {
  color: "crimson",
  fontSize: "13px",
  marginTop: "5px",
};

const buttonContainerStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const saveButtonStyle = {
  padding: "10px 16px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const cancelButtonStyle = {
  padding: "10px 16px",
  border: "1px solid #aaa",
  borderRadius: "8px",
  backgroundColor: "#fff",
  cursor: "pointer",
};