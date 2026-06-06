import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isLoggingIn : false,
    isUpdatingProfile : false,
    isSigningUp:false,
    isCheckingAuth:true,
    onlineUsers: [],
    checkAuth: async() => {
        try{
            const res = await axiosInstance.get("/auth/check");
            set({authUser : res.data});
        }catch(err){
            set({authUser : null});
        }finally{
            set({isCheckingAuth: false});
        }
    },

    signup: async (data) => {
        set({isSigningUp: true})
        try{
            const res = await axiosInstance.post("/auth/signup" , data);
            set({authUser: res.data});
            toast.success("Account created successfully");

        }catch(err){
            toast.error(err?.response?.data?.message || "Signup failed");
        }finally{
            set({isSigningUp : false});
        }
    },
    login: async (data) => {
        set({isLoggingIn: true})
        try{
            const res = await axiosInstance.post("/auth/login", data);
            set({authUser: res.data});
            toast.success("Logged In successfully");
        }catch(err){
            toast.error(err?.response?.data?.message || "Login failed");
        }finally{
            set({isLoggingIn: false});
        }
    },
    logout: async () => {
        try{
            await axiosInstance.post("/auth/logout");
            set({authUser: null});
            toast.success("Logged out successfully");
        }catch(err){
            toast.error(err?.response?.data?.message || "Logout failed");
        }
    },
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Profile update failed");
        } finally {
            set({ isUpdatingProfile: false });
        }
    }
})) 