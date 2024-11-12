import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { createAsyncThunk } from "@reduxjs/toolkit";

export interface AuthState {
  loading: boolean;
  authenticated: boolean;

  logged_in: boolean;
  data: {
    _id: string;
    name: string;
    email: string;

    image: string;
    phoneNumber: string;
  };
}

const initialState: AuthState = {
  loading: true,
  authenticated: false,
  logged_in: false,
  data: {
    _id: "",
    name: "",
    email: "",

    image: "",
    phoneNumber: "",
  },
};

export const userLogin = createAsyncThunk(
  "login",
  async (credentials: { email: string; password: string }) => {
    const response = await fetch("http://localhost:4000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const data = await response.json();
      toast.error(data.message);
      throw new Error(data.error_msg || "Error ");
    }
    const data = await response.json();
    toast.success(data.message);
    return response.status;
  }
);

export const currentProfile = createAsyncThunk(
  "getCurrentProfile",
  async () => {
    const response = await fetch("http://localhost:4000/api/users/profile", {
      method: "GET",
      credentials: "include",
    });

    const jsonResponse = await response.json();

    return jsonResponse;
  }
);

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    handleFacialAuth: (state, action) => {
      state.authenticated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userLogin.fulfilled, (state, action) => {
      if (action.payload === 200) {
        state.authenticated = true;
      }
      return state;
    });

    builder.addCase(userLogin.rejected, (state) => {
      return state;
    });

    builder.addCase(currentProfile.fulfilled, (state, action) => {
      if (action.payload.data) {
        state.data = action.payload.data;
        state.authenticated = true;
        
      }
      state.loading = false;
    });

    builder.addCase(currentProfile.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(userLogin.pending, (state) => {
      state.loading = true;
    });
  },
});

// Action creators are generated for each case reducer function
export const { handleFacialAuth } = authSlice.actions;

export default authSlice.reducer;
