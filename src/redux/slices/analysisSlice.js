import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/Api.js";

export const fetchAnalysis = createAsyncThunk(
  "analysis/fetchAnalysis",
  async (_, thunkAPI) => {
    try {
      const response = await API.getAnalysisData();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

const analysisSlice = createSlice({
  name: "analysis",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalysis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalysis.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAnalysis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default analysisSlice.reducer;
