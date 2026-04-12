import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/Api.js";

export const fetchOutOfScope = createAsyncThunk(
  "outOfScope/fetchOutOfScope",
  async (_, thunkAPI) => {
    try {
      const response = await API.getOutOfScopeData();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

const outOfScopeSlice = createSlice({
  name: "outOfScope",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOutOfScope.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOutOfScope.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchOutOfScope.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default outOfScopeSlice.reducer;
