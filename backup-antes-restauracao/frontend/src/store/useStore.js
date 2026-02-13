import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // User state
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // Theme state
      theme: 'dark',
      language: 'pt',

      // UI state
      sidebarOpen: false,
      notifications: [],
      unreadCount: 0,

      // Chatbot state
      chatbotOpen: false,
      chatbotMode: 'text', // text, voice, image
      chatHistory: [],

      // Feature flags
      features: {
        crypto: true,
        nft: true,
        staking: true,
        messaging: true,
        analytics: true
      },

      // Actions
      setUser: user => set({ user, isAuthenticated: !!user }),
      setLoading: isLoading => set({ isLoading }),
      setTheme: theme => set({ theme }),
      setLanguage: language => set({ language }),
      toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),

      // Notifications
      addNotification: notification =>
        set(state => ({
          notifications: [...state.notifications, notification],
          unreadCount: state.unreadCount + 1
        })),
      markAsRead: id =>
        set(state => ({
          notifications: state.notifications.map(n => (n.id === id ? { ...n, read: true } : n)),
          unreadCount: Math.max(0, state.unreadCount - 1)
        })),
      clearNotifications: () => set({ notifications: [], unreadCount: 0 }),

      // Chatbot
      toggleChatbot: () => set(state => ({ chatbotOpen: !state.chatbotOpen })),
      setChatbotMode: mode => set({ chatbotMode: mode }),
      addChatMessage: message =>
        set(state => ({
          chatHistory: [...state.chatHistory, message]
        })),
      clearChatHistory: () => set({ chatHistory: [] }),

      // Feature flags
      toggleFeature: feature =>
        set(state => ({
          features: {
            ...state.features,
            [feature]: !state.features[feature]
          }
        })),

      // Logout
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          notifications: [],
          unreadCount: 0,
          chatHistory: []
        })
    }),
    {
      name: 'agrosync-store',
      partialize: state => ({
        theme: state.theme,
        language: state.language,
        features: state.features
      })
    }
  )
);

export default useStore;
