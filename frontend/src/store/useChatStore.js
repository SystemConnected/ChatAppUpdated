import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { persist } from "zustand/middleware";
import { decryptData, encryptData } from "../lib/utils";

export const useChatStore = create(
  persist(
    (set, get) => ({
      messages: [],
      users: [],
      unreadMessages: {}, // Track unread messages per user
      selectedUser: null,
      isUsersLoading: false,
      isMessagesLoading: false,

      getUsers: async () => {
        set({ isUsersLoading: true });
        try {
          const res = await axiosInstance.get("/messages/users");
          set({ users: res.data });
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isUsersLoading: false });
        }
      },

      getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
          const res = await axiosInstance.get(`/messages/${userId}`);
          set({ messages: res.data });

          // Reset unread count when user opens chat
          set((state) => ({
            unreadMessages: { ...state.unreadMessages, [userId]: 0 },
          }));
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isMessagesLoading: false });
        }
      },
      sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
          const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
          set({ messages: [...messages, res.data] });
        } catch (error) {
          toast.error(error.response.data.message);
        }
      },
      subscribeToMessages: () => {
        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
          const { selectedUser, messages } = get();

          if (newMessage.senderId === selectedUser?._id) {
            // If the message is from the selected user, add it to messages
            set({ messages: [...messages, newMessage] });
          } else {
            // If the message is from another user, update unreadMessages
            set((state) => ({
              unreadMessages: {
                ...state.unreadMessages,
                [newMessage.senderId]: {
                  unreadMessageCount: (state.unreadMessages[newMessage.senderId]?.unreadMessageCount || 0) + 1,
                  unreadMessagesDetails: [
                    ...(state.unreadMessages[newMessage.senderId]?.unreadMessagesDetails || []),
                    newMessage,
                  ],
                },
              },
            }));
          }
        });
      },

      unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
      },

      setSelectedUser: (selectedUser) => {
        set((state) => ({
          selectedUser,
          unreadMessages: {
            ...state.unreadMessages,
            [selectedUser?._id]: { unreadMessageCount: 0, unreadMessagesDetails: [] }, // Clear unread count
          },
        }));
      },

    }),

    {
      name: "chat-store", // Local storage key
      getStorage: () => sessionStorage, // Use sessionStorage for persistence
      serialize: (state) => encryptData(state), // Encrypt before saving
      deserialize: (state) => decryptData(state), // Decrypt when retrieving
    }
  )

);
