import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import skinProductReducer from "./slices/skinProductSlice";
import outOfScopeReducer from "./slices/outOfScopeSlice";
import analysisReducer from "./slices/analysisSlice";
import conditionReducer from "./slices/conditionSlice";
import skinTypeReducer from "./slices/skinTypeSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    products: skinProductReducer,
    outOfScope: outOfScopeReducer,
    analysis: analysisReducer,
    conditions: conditionReducer,
    skinType: skinTypeReducer,
  },
});
