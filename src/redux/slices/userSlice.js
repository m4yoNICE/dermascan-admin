import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "@/services/Api";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  (_, { rejectWithValue, signal }) => {
    return Api.getUsersData({ signal })
      .then((response) => response.data)
      .catch((err) => {
        if (err.name === "AbortError" || err.name === "CanceledError") {
          return rejectWithValue("Request canceled");
        }

        return rejectWithValue(
          err.response?.data?.message || "Failed to fetch users",
        );
      });
  },
);

export const getUserById = createAsyncThunk(
  "users/getUserById",
  (id, { rejectWithValue }) => {
    return Api.getUserById(id)
      .then((response) => response.data)
      .catch((err) => {
        return rejectWithValue(
          err.response?.data?.message || "Failed to fetch user",
        );
      });
  },
);

export const editUserAPI = createAsyncThunk(
  "users/editUserAPI",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await Api.editUserAPI(id, data); // your Api.js call
      return res.data.user; // this will be available as action.payload
    } catch (err) {
      // return a rejected value for error handling in slice
      return rejectWithValue(err.response?.data || { error: err.message });
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  (id, { rejectWithValue }) => {
    return Api.deleteUserAPI(id)
      .then((response) => {
        return { id, data: response.data };
      })
      .catch((err) => {
        return rejectWithValue(
          err.response?.data?.message || "Failed to delete user",
        );
      });
  },
);
export const getUserCount = createAsyncThunk(
  "users/getUserCount",
  (_, { rejectWithValue }) => {
    return Api.getUserCount()
      .then((response) => response.data)
      .catch((err) => {
        return rejectWithValue(
          err.response?.data?.message || "Failed to fetch user count",
        );
      });
  },
);



//initial state
const initialState = {
  users: [],
  usersData: null,
  selectedUser: null,
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
  updateLoading: false,
  updateError: null,
  deleteLoading: false,
  deleteError: null,
  userByIdLoading: false,
  userByIdError: null,
};

//user slice
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //get user by id
      .addCase(getUserById.pending, (state) => {
        state.userByIdLoading = true;
        state.userByIdError = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.userByIdLoading = false;
        state.selectedUser = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.userByIdLoading = false;
        state.userByIdError = action.payload;
      })
      //delete users
      .addCase(deleteUser.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.users = state.users.filter(
          (user) => user.id !== action.payload.id,
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      })
      // edit user
      .addCase(editUserAPI.fulfilled, (state, action) => {
        state.editLoading = false;
        state.editError = null;

        const index = state.users.findIndex(
          (u) => u.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(editUserAPI.rejected, (state, action) => {
        state.editLoading = false;
        state.editError = action.payload?.error || "Failed to update user";
      })
      //get user count
      .addCase(getUserCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserCount.fulfilled, (state, action) => {
        state.loading = false;
        state.userCount = action.payload;
      })
      .addCase(getUserCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedUser } = userSlice.actions;
export default userSlice.reducer;
