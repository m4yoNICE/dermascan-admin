import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, updateProduct } from "@/redux/slices/skinProductSlice";
import { fetchConditions } from "@/redux/slices/conditionSlice";
import { buildProductFormData } from "@/utils/Forms";
import { X } from "lucide-react";
import Api from "@/services/Api";
import { SKIN_TYPES } from "@/constants/skinTypes";

const EditProductModal = ({ isOpen, onClose, product }) => {
  const dispatch = useDispatch();
  const { data: conditions = [] } = useSelector(
    (state) => state.conditions || {},
  );

  const [formData, setFormData] = useState({
    productName: "",
    productImage: "",
    productBrand: "",
    highlightedIngredients: "",
    ingredient: "",
    description: "",
    productType: "",
    locality: "",
    availableIn: "",
    skinType: "",
    dermaTested: false,
    timeRoutine: "",
    conditionIds: [],
  });

  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName || "",
        productImage: product.productImage || "",
        productBrand: product.productBrand || "",
        highlightedIngredients: product.highlightedIngredients || "",
        ingredient: product.ingredient || "",
        description: product.description || "",
        productType: product.productType || "",
        locality: product.locality || "",
        availableIn: product.availableIn || "",
        skinType: product.skinType || "",
        dermaTested: product.dermaTested || false,
        timeRoutine: product.timeRoutine || "",
        conditionIds: product.conditionIds || [],
      });
    }
  }, [product]);

  useEffect(() => {
    dispatch(fetchConditions());
  }, [dispatch]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleConditionToggle = (id) => {
    setFormData((prev) => ({
      ...prev,
      conditionIds: prev.conditionIds.includes(id)
        ? prev.conditionIds.filter((c) => c !== id)
        : [...prev.conditionIds, id],
    }));
  };

  const handleSkinTypeToggle = (type) => {
    setFormData((prev) => {
      const current = prev.skinType ? prev.skinType.split(", ") : [];
      const updated = current.includes(type)
        ? current.filter((t) => t !== type)
        : [...current, type];
      return { ...prev, skinType: updated.join(", ") };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = buildProductFormData(formData);
    await dispatch(updateProduct({ id: product.id, data })).unwrap();
    dispatch(fetchProducts());
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="presentation"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      tabIndex={-1}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Edit Product</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              required
              placeholder="Enter product name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00CC99] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Brand
            </label>
            <input
              type="text"
              name="productBrand"
              value={formData.productBrand}
              onChange={handleChange}
              placeholder="e.g. Cetaphil, CeraVe"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00CC99] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Highlighted Ingredients
            </label>
            <input
              type="text"
              name="highlightedIngredients"
              value={formData.highlightedIngredients}
              onChange={handleChange}
              placeholder="e.g. Salicylic Acid, Niacinamide"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00CC99] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Available In
            </label>
            <input
              type="text"
              name="availableIn"
              value={formData.availableIn}
              onChange={handleChange}
              placeholder="e.g. Shopee, Watson"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00CC99] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image
            </label>
            {formData.productImage &&
              typeof formData.productImage === "string" && (
                <div className="mb-2">
                  <img
                    src={Api.getProductImage(formData.productImage)}
                    alt="current product"
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                  />
                  <p className="text-xs text-gray-400 mt-1">Current image</p>
                </div>
              )}
            <input
              type="file"
              name="productImage"
              accept="image/*"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  productImage: e.target.files[0],
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Type <span className="text-red-500">*</span>
            </label>
            <select
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00CC99] focus:border-transparent"
            >
              <option value="">Select type</option>
              <option value="Cleanser">Cleanser</option>
              <option value="Toner">Toner</option>
              <option value="Serum">Serum</option>
              <option value="Moisturizer">Moisturizer</option>
              <option value="Sunscreen">Sunscreen</option>
              <option value="Exfoliant">Exfoliant</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ingredient
            </label>
            <input
              type="text"
              name="ingredient"
              value={formData.ingredient}
              onChange={handleChange}
              placeholder="e.g. Salicylic Acid, Niacinamide"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00CC99] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Enter product description"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00CC99] focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skin Type
            </label>
            <div className="grid grid-cols-2 gap-2 border border-gray-200 rounded-lg p-3">
              {SKIN_TYPES.map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.skinType
                      .split(", ")
                      .filter(Boolean)
                      .includes(type)}
                    onChange={() => handleSkinTypeToggle(type)}
                    className="w-4 h-4 accent-[#00CC99]"
                  />
                  <span className="capitalize text-gray-600">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Locality
            </label>
            <select
              name="locality"
              value={formData.locality}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00CC99] focus:border-transparent"
            >
              <option value="">Select locality</option>
              <option value="Local">Local</option>
              <option value="International">International</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Routine
            </label>
            <select
              name="timeRoutine"
              value={formData.timeRoutine}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00CC99] focus:border-transparent"
            >
              <option value="">Select routine</option>
              <option value="Morning">Morning</option>
              <option value="Night">Night</option>
              <option value="Morning, Night">Morning & Night</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="dermaTested"
              id="dermaTested"
              checked={formData.dermaTested}
              onChange={handleChange}
              className="w-4 h-4 accent-[#00CC99]"
            />
            <label
              htmlFor="dermaTested"
              className="text-sm font-medium text-gray-700"
            >
              Derma Tested
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Applicable Conditions
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {conditions.map((condition) => (
                <label
                  key={condition.id}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.conditionIds.includes(condition.id)}
                    onChange={() => handleConditionToggle(condition.id)}
                    className="w-4 h-4 accent-[#00CC99]"
                  />
                  <span className="capitalize text-gray-600">
                    {condition.condition}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-[#00CC99] hover:bg-[#00b389] rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
