import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAiStore = create((set) => ({
  messages: [],
  isLoading: false,
  isAiopen: false,
  lastPrompt: null,
  clearInputSignal: 0,
  inputDraft: null,
  aiWidth: 400, // Default width

  // Actions for input draft and layout
  setInputDraft: (value) => set({ inputDraft: value }),
  
  setAiOpen: (value) => {
    set({ isAiopen: value });
  },

  // FIX: Added the missing setAiWidth action needed for the resizable slider
  setAiWidth: (width) => {
    set({ aiWidth: width });
  },

  getAiMessages: async (id) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get(`/ai/${id}`);
      set({ messages: res.data });
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to load AI messages");
    } finally {
      set({ isLoading: false });
    }
  },

  sendAiMessage: async (id, content) => {
    // 1. Create a quick optimistic user message object
    const clientUserMessage = {
      _id: `user-${Date.now()}`,
      role: 'user',
      content: content,
    };

    try {
      set({ isLoading: true, lastPrompt: content });
      
      // OPTIMIZATION: Append the user's message immediately so the UI feels fast
      set((state) => ({
        messages: [...state.messages, clientUserMessage]
      }));

      const res = await axiosInstance.post(`/ai/${id}`, { content });
      
      // 2. Append the incoming AI server response
      set((state) => ({
        messages: [...state.messages, res.data],
      }));
      
      set({ lastPrompt: null });
      return res.data;
    } catch (err) {
      // Rollback if the request fails (Optional: remove the optimistic message here if desired)
      toast.error(err?.response?.data?.message || "Failed to send AI message");
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  revealPendingPrompt: () => {
    set((state) => {
      if (!state.lastPrompt) return state;
      const pending = {
        _id: `pending-${Date.now()}`,
        role: 'user',
        content: state.lastPrompt,
      };
      return {
        messages: [...state.messages, pending],
        lastPrompt: null,
        clearInputSignal: (state.clearInputSignal || 0) + 1,
      };
    });
  }
}));