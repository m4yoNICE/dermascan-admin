import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "@/services/Api";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  (_, { rejectWithValue, signal }) => {
    return Api.getSkinProducts({ signal })
      .then((response) => response.data)
      .catch((err) => {
        if (err.name === "AbortError" || err.name === "CanceledError") {
          return rejectWithValue("Request canceled");
        }

        return rejectWithValue(
          err.response?.data?.message || "Failed to fetch products.",
        );
      });
  },
);

export const getProductById = createAsyncThunk(
  "products/getProductById",
  (id, { rejectWithValue }) => {
    return Api.getProductById(id)
      .then((response) => response.data)
      .catch((err) => {
        return rejectWithValue(
          err.response?.data?.message || "Failed to fetch product.",
        );
      });
  },
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  (data, { rejectWithValue }) => {
    return Api.createProductAPI(data)
      .then((response) => response.data)
      .catch((err) => {
        return rejectWithValue(
          err.response?.data?.message || "Failed to create product",
        );
      });
  },
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  ({ id, data }, { rejectWithValue }) => {
    return Api.updateProductAPI(id, data)
      .then((response) => response.data)
      .catch((err) => {
        return rejectWithValue(
          err.response?.data?.message || "Failed to updated product.",
        );
      });
  },
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  (id, { rejectWithValue }) => {
    return Api.deleteProductAPI(id)
      .then((response) => {
        return { id, data: response.data };
      })
      .catch((err) => {
        return rejectWithValue(
          err.response?.data?.message || "Failed to delete product.",
        );
      });
  },
);

export const getConditionCounts = createAsyncThunk(
  "products/getConditionCounts",
  (_, { rejectWithValue }) => {
    return Api.getConditionCounts()
      .then((response) => response.data)
      .catch((err) => {
        return rejectWithValue(
          err.response?.data?.message || "Failed to fetch condition counts.",
        );
      });
  },
);

export const getConditionCountsByProduct = createAsyncThunk(
  "products/getConditionCountsByProduct",
  (_, { rejectWithValue }) => {
    return Api.getConditionCountsByProduct()
      .then((response) => response.data)
      .catch((err) => {
        return rejectWithValue(
          err.response?.data?.message || "Failed to fetch condition counts by product.",
        );
      });
  },
);

export const getAllProductImages = createAsyncThunk(
  "products/getAllProductImages",
  (_, { rejectWithValue }) => {
    return Api.getAllProductImages()
      .then((response) => response.data)
      .catch((err) => {
        return rejectWithValue(
          err.response?.data?.message || "Failed to fetch product images.",
        );
      });
  },
);

//initial state
const initialState = {
  products: [],
  getConditionCounts: [],
  getConditionCountsByProduct: [],
  getAllProductImages: [],
  productsData: null,
  selectedProduct: null,
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
  updateLoading: false,
  updateError: null,
  deleteLoading: false,
  deleteError: null,
  productByIdLoading: false,
  productByIdError: null,
};

//product slice
const skinProductSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //get product by id
      .addCase(getProductById.pending, (state) => {
        state.productByIdLoading = true;
        state.productByIdError = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.productByIdLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.productByIdLoading = false;
        state.productByIdError = action.payload;
      })
      //CREATE PRODUCT
      .addCase(createProduct.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.createLoading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
      })
      //UPDATE PRODUCT
      .addCase(updateProduct.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.products.findIndex(
          (product) => product.id === action.payload.id,
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      })
      //DELETE PRODUCT
      .addCase(deleteProduct.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.products = state.products.filter(
          (product) => product.id !== action.payload.id,
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      })
      //GET CONDITION COUNTS
      .addCase(getConditionCounts.pending, (state) => {
        state.getConditionCounts = [];
      })
      .addCase(getConditionCounts.fulfilled, (state, action) => {
        state.getConditionCounts = action.payload.data;
      })
      .addCase(getConditionCounts.rejected, (state, action) => {
        state.getConditionCounts = [];
      })
      //GET CONDITION COUNTS BY PRODUCT
      .addCase(getConditionCountsByProduct.pending, (state) => {
        state.getConditionCountsByProduct = [];
      })
      .addCase(getConditionCountsByProduct.fulfilled, (state, action) => {
        state.getConditionCountsByProduct = action.payload.data;
      })
      .addCase(getConditionCountsByProduct.rejected, (state, action) => {
        state.getConditionCountsByProduct = [];
      })
      // GET ALL PRODUCT IMAGES
      .addCase(getAllProductImages.pending, (state) => {
        state.getAllProductImages = [];
      })
      .addCase(getAllProductImages.fulfilled, (state, action) => {
        state.getAllProductImages = action.payload.data;
      })
      .addCase(getAllProductImages.rejected, (state, action) => {
        state.getAllProductImages = [];
      });
  },
});

export const { clearError, clearSelectedProduct } = skinProductSlice.actions;
export default skinProductSlice.reducer;
