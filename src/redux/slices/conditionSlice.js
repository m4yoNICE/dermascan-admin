import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/Api.js";

export const fetchConditions = createAsyncThunk(
  "conditions/fetchConditions",
  async (_, thunkAPI) => {
    try {
      const response = await API.getConditions();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

const conditionsSlice = createSlice({
  name: "conditions",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConditions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConditions.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchConditions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default conditionsSlice.reducer;
