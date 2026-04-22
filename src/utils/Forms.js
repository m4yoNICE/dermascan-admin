export function buildProductFormData(formData) {
  const data = new FormData();
  data.append("productName", formData.productName);
  data.append("productBrand", formData.productBrand || "");
  data.append("highlightedIngredients", formData.highlightedIngredients || "");
  data.append("ingredient", formData.ingredient);
  data.append("description", formData.description);
  data.append("productType", formData.productType);
  data.append("locality", formData.locality);
  data.append("availableIn", formData.availableIn || "");
  data.append("skinType", formData.skinType);
  data.append("dermaTested", formData.dermaTested);
  data.append("routine", formData.routine || "");
  data.append("timeRoutine", formData.timeRoutine);
  data.append("price", formData.price);
  data.append("conditionIds", JSON.stringify(formData.conditionIds || []));
  if (formData.productImage) {
    data.append("productImage", formData.productImage);
  }
  return data;
}